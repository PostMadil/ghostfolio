import { PortfolioModule } from '@ghostfolio/api/app/portfolio/portfolio.module';
import { RedisCacheModule } from '@ghostfolio/api/app/redis-cache/redis-cache.module';
import { UserModule } from '@ghostfolio/api/app/user/user.module';
import { ConfigurationModule } from '@ghostfolio/api/services/configuration.module';
import { DataProviderModule } from '@ghostfolio/api/services/data-provider/data-provider.module';
import { ExchangeRateDataModule } from '@ghostfolio/api/services/exchange-rate-data.module';
import { ImpersonationModule } from '@ghostfolio/api/services/impersonation.module';
import { PrismaModule } from '@ghostfolio/api/services/prisma.module';
import { Module } from '@nestjs/common';

import { AccountController } from './account.controller';
import { AccountService } from './account.service';

@Module({
  controllers: [AccountController],
  imports: [
    ConfigurationModule,
    DataProviderModule,
    ExchangeRateDataModule,
    ImpersonationModule,
    PortfolioModule,
    PrismaModule,
    RedisCacheModule,
    UserModule
  ],
  providers: [AccountService]
})
export class AccountModule {}
