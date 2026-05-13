import { Inject, Injectable, Logger } from '@nestjs/common';
import type Redis from 'ioredis';

import { AppConfigService } from '@/config/app-config.service';
import { REDIS } from './redis.provider';

/**
 * Wrapper sobre ioredis com:
 *  - serialização JSON automática
 *  - TTL default configurável
 *  - cache-aside via wrap()
 *  - degradação graceful (se Redis cair, devolve fresh sem quebrar request)
 */
@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  constructor(
    @Inject(REDIS) private readonly redis: Redis,
    private readonly config: AppConfigService,
  ) {}

  async get<T>(key: string): Promise<T | null> {
    try {
      const raw = await this.redis.get(key);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch (err) {
      this.logger.warn(`cache.get falhou (${key}): ${(err as Error).message}`);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const ttl = ttlSeconds ?? this.config.redisTtlDefault;
    try {
      await this.redis.set(key, JSON.stringify(value), 'EX', ttl);
    } catch (err) {
      this.logger.warn(`cache.set falhou (${key}): ${(err as Error).message}`);
    }
  }

  async del(key: string | string[]): Promise<void> {
    try {
      const keys = Array.isArray(key) ? key : [key];
      if (keys.length) await this.redis.del(...keys);
    } catch (err) {
      this.logger.warn(`cache.del falhou: ${(err as Error).message}`);
    }
  }

  /** Cache-aside: tenta cache, senão executa fetcher e popula. */
  async wrap<T>(key: string, ttlSeconds: number, fetcher: () => Promise<T>): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) return cached;
    const fresh = await fetcher();
    await this.set(key, fresh, ttlSeconds);
    return fresh;
  }

  /** Invalida todas as chaves que casam com pattern (cuidado em prod). */
  async invalidatePattern(pattern: string): Promise<number> {
    let deleted = 0;
    const stream = this.redis.scanStream({ match: pattern, count: 100 });
    for await (const keys of stream) {
      if ((keys as string[]).length) {
        deleted += await this.redis.del(...(keys as string[]));
      }
    }
    return deleted;
  }
}
