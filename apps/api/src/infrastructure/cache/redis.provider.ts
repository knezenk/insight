import { Logger, Provider } from '@nestjs/common';
import Redis from 'ioredis';

import { AppConfigService } from '@/config/app-config.service';

export const REDIS = Symbol('REDIS');

export const RedisProvider: Provider = {
  provide: REDIS,
  inject: [AppConfigService],
  useFactory: (config: AppConfigService): Redis => {
    const logger = new Logger('Redis');
    const client = new Redis(config.redisUrl, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      lazyConnect: false,
      retryStrategy: (times) => Math.min(times * 200, 2_000),
    });
    client.on('connect', () => logger.log('Redis conectado'));
    client.on('error', (err) => logger.warn(`Redis erro: ${err.message}`));
    client.on('end', () => logger.warn('Redis desconectado'));
    return client;
  },
};
