import { Injectable } from '@nestjs/common';
import { DataSource } from '@prisma/client';
import { bool, cleanEnv, host, json, num, port, str } from 'envalid';

import { Environment } from './interfaces/environment.interface';

@Injectable()
export class ConfigurationService {
  private readonly environmentConfiguration: Environment;

  public constructor() {
    this.environmentConfiguration = cleanEnv(process.env, {
      ACCESS_TOKEN_SALT: str(),
      ALPHA_VANTAGE_API_KEY: str({ default: '' }),
      CACHE_TTL: num({ default: 1 }),
      DATA_SOURCE_PRIMARY: str({ default: DataSource.YAHOO }),
      DATA_SOURCES: json({ default: JSON.stringify([DataSource.YAHOO]) }),
      ENABLE_FEATURE_BLOG: bool({ default: false }),
      ENABLE_FEATURE_CUSTOM_SYMBOLS: bool({ default: false }),
      ENABLE_FEATURE_FEAR_AND_GREED_INDEX: bool({ default: false }),
      ENABLE_FEATURE_IMPORT: bool({ default: true }),
      ENABLE_FEATURE_READ_ONLY_MODE: bool({ default: false }),
      ENABLE_FEATURE_SOCIAL_LOGIN: bool({ default: false }),
      ENABLE_FEATURE_STATISTICS: bool({ default: false }),
      ENABLE_FEATURE_SUBSCRIPTION: bool({ default: false }),
      ENABLE_FEATURE_SYSTEM_MESSAGE: bool({ default: false }),
      GOOGLE_CLIENT_ID: str({ default: 'dummyClientId' }),
      GOOGLE_SECRET: str({ default: 'dummySecret' }),
      GOOGLE_SHEETS_ACCOUNT: str({ default: '' }),
      GOOGLE_SHEETS_ID: str({ default: '' }),
      GOOGLE_SHEETS_PRIVATE_KEY: str({ default: '' }),
      JWT_SECRET_KEY: str({}),
      MAX_ITEM_IN_CACHE: num({ default: 9999 }),
      MAX_ORDERS_TO_IMPORT: num({ default: Number.MAX_SAFE_INTEGER }),
      PORT: port({ default: 3333 }),
      RAKUTEN_RAPID_API_KEY: str({ default: '' }),
      REDIS_HOST: str({ default: 'localhost' }),
      REDIS_PORT: port({ default: 6379 }),
      ROOT_URL: str({ default: 'http://localhost:4200' }),
      STRIPE_PUBLIC_KEY: str({ default: '' }),
      STRIPE_SECRET_KEY: str({ default: '' }),
      WEB_AUTH_RP_ID: host({ default: 'localhost' })
    });
  }

  public get<K extends keyof Environment>(key: K): Environment[K] {
    return this.environmentConfiguration[key];
  }
}
