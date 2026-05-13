import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import { AppConfigModule } from './config/app-config.module';
import { AppConfigService } from './config/app-config.service';
import { CacheModule } from './infrastructure/cache/cache.module';
import { ProvidersModule } from './adapters/providers/providers.module';

import { AuthModule } from './modules/auth/auth.module';
import { ClippingModule } from './modules/clipping/clipping.module';
import { ScoresModule } from './modules/scores/scores.module';
import { NarrativesModule } from './modules/narratives/narratives.module';
import { InfluencersModule } from './modules/influencers/influencers.module';
import { AlertsModule } from './modules/alerts/alerts.module';
import { CompetitiveModule } from './modules/competitive/competitive.module';
import { ReportsModule } from './modules/reports/reports.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    AppConfigModule,
    LoggerModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        pinoHttp: {
          level: config.logLevel,
          transport: config.logPretty
            ? { target: 'pino-pretty', options: { singleLine: true, translateTime: 'SYS:standard' } }
            : undefined,
          autoLogging: true,
          customProps: () => ({ context: 'HTTP' }),
          serializers: {
            req: (req) => ({
              id: req.id,
              method: req.method,
              url: req.url,
            }),
            res: (res) => ({ statusCode: res.statusCode }),
          },
        },
      }),
    }),
    ThrottlerModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => [
        { ttl: config.rateLimitTtl * 1000, limit: config.rateLimitMax },
      ],
    }),
    CacheModule,
    ProvidersModule,
    AuthModule,
    ClippingModule,
    ScoresModule,
    NarrativesModule,
    InfluencersModule,
    AlertsModule,
    CompetitiveModule,
    ReportsModule,
    HealthModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
