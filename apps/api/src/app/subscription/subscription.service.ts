import { ConfigurationService } from '@ghostfolio/api/services/configuration.service';
import { PrismaService } from '@ghostfolio/api/services/prisma.service';
import { SubscriptionType } from '@ghostfolio/common/types/subscription.type';
import { Injectable, Logger } from '@nestjs/common';
import { Subscription, User } from '@prisma/client';
import { addDays, isBefore } from 'date-fns';
import Stripe from 'stripe';

@Injectable()
export class SubscriptionService {
  private stripe: Stripe;

  public constructor(
    private readonly configurationService: ConfigurationService,
    private readonly prismaService: PrismaService
  ) {
    this.stripe = new Stripe(
      this.configurationService.get('STRIPE_SECRET_KEY'),
      {
        apiVersion: '2020-08-27'
      }
    );
  }

  public async createCheckoutSession({
    couponId,
    priceId,
    userId
  }: {
    couponId?: string;
    priceId: string;
    userId: string;
  }) {
    const checkoutSessionCreateParams: Stripe.Checkout.SessionCreateParams = {
      cancel_url: `${this.configurationService.get('ROOT_URL')}/account`,
      client_reference_id: userId,
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      mode: 'payment',
      payment_method_types: ['card'],
      success_url: `${this.configurationService.get(
        'ROOT_URL'
      )}/api/subscription/stripe/callback?checkoutSessionId={CHECKOUT_SESSION_ID}`
    };

    if (couponId) {
      checkoutSessionCreateParams.discounts = [
        {
          coupon: couponId
        }
      ];
    }

    const session = await this.stripe.checkout.sessions.create(
      checkoutSessionCreateParams
    );

    return {
      sessionId: session.id
    };
  }

  public async createSubscription(aUserId: string) {
    await this.prismaService.subscription.create({
      data: {
        expiresAt: addDays(new Date(), 365),
        User: {
          connect: {
            id: aUserId
          }
        }
      }
    });
  }

  public async createSubscriptionViaStripe(aCheckoutSessionId: string) {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(
        aCheckoutSessionId
      );

      await this.createSubscription(session.client_reference_id);

      await this.stripe.customers.update(session.customer as string, {
        description: session.client_reference_id
      });

      return session.client_reference_id;
    } catch (error) {
      Logger.error(error);
    }
  }

  public getSubscription(aSubscriptions: Subscription[]) {
    if (aSubscriptions.length > 0) {
      const latestSubscription = aSubscriptions.reduce((a, b) => {
        return new Date(a.expiresAt) > new Date(b.expiresAt) ? a : b;
      });

      return {
        expiresAt: latestSubscription.expiresAt,
        type: isBefore(new Date(), latestSubscription.expiresAt)
          ? SubscriptionType.Premium
          : SubscriptionType.Basic
      };
    } else {
      return {
        type: SubscriptionType.Basic
      };
    }
  }
}
