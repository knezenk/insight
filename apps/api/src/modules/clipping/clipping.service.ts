import { Inject, Injectable } from '@nestjs/common';

import type { ClippingFilterDto, ClippingItemDto, Paginated } from '@insight/shared';

import { CLIPPING_PROVIDER } from '@/adapters/providers/tokens';
import type { ClippingProvider } from '@/adapters/providers/clipping/clipping.provider.interface';
import { CacheService } from '@/infrastructure/cache/cache.service';
import { AppConfigService } from '@/config/app-config.service';
import { buildCacheKey } from '@/common/utils/cache-key';

@Injectable()
export class ClippingService {
  constructor(
    @Inject(CLIPPING_PROVIDER) private readonly provider: ClippingProvider,
    private readonly cache: CacheService,
    private readonly config: AppConfigService,
  ) {}

  async list(filter: ClippingFilterDto): Promise<Paginated<ClippingItemDto>> {
    const key = buildCacheKey('clipping:list', filter);
    return this.cache.wrap(key, this.config.redisTtlDefault, () => this.provider.list(filter));
  }

  async getById(workspace: string, id: string): Promise<ClippingItemDto | null> {
    const key = `clipping:${workspace}:${id}`;
    return this.cache.wrap(key, this.config.redisTtlDefault, () =>
      this.provider.getById(workspace, id),
    );
  }
}
