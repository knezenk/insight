import { Inject, Injectable } from '@nestjs/common';
import type { CompetitiveDto } from '@insight/shared';
import { COMPETITIVE_PROVIDER } from '@/adapters/providers/tokens';
import { CompetitiveMockProvider } from '@/adapters/providers/competitive/competitive-mock.provider';
import { CacheService } from '@/infrastructure/cache/cache.service';
import { AppConfigService } from '@/config/app-config.service';
import { buildCacheKey } from '@/common/utils/cache-key';

@Injectable()
export class CompetitiveService {
  constructor(
    @Inject(COMPETITIVE_PROVIDER) private readonly provider: CompetitiveMockProvider,
    private readonly cache: CacheService,
    private readonly config: AppConfigService,
  ) {}

  get(workspace: string, from: string, to: string): Promise<CompetitiveDto> {
    return this.cache.wrap(
      buildCacheKey('competitive', { workspace, from, to }),
      this.config.redisTtlScores,
      () => this.provider.get(workspace, from, to),
    );
  }
}
