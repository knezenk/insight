import { Inject, Injectable } from '@nestjs/common';
import type { NarrativeDto } from '@insight/shared';
import { NARRATIVES_PROVIDER } from '@/adapters/providers/tokens';
import { NarrativesMockProvider } from '@/adapters/providers/narratives/narratives-mock.provider';
import { CacheService } from '@/infrastructure/cache/cache.service';
import { AppConfigService } from '@/config/app-config.service';
import { buildCacheKey } from '@/common/utils/cache-key';

@Injectable()
export class NarrativesService {
  constructor(
    @Inject(NARRATIVES_PROVIDER) private readonly provider: NarrativesMockProvider,
    private readonly cache: CacheService,
    private readonly config: AppConfigService,
  ) {}

  list(workspace: string, from: string, to: string): Promise<NarrativeDto[]> {
    return this.cache.wrap(
      buildCacheKey('narratives', { workspace, from, to }),
      this.config.redisTtlScores,
      () => this.provider.list(workspace, from, to),
    );
  }
}
