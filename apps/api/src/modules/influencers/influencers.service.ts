import { Inject, Injectable } from '@nestjs/common';
import type { InfluencerDto } from '@insight/shared';
import { INFLUENCERS_PROVIDER } from '@/adapters/providers/tokens';
import { InfluencersMockProvider } from '@/adapters/providers/influencers/influencers-mock.provider';
import { CacheService } from '@/infrastructure/cache/cache.service';
import { AppConfigService } from '@/config/app-config.service';

@Injectable()
export class InfluencersService {
  constructor(
    @Inject(INFLUENCERS_PROVIDER) private readonly provider: InfluencersMockProvider,
    private readonly cache: CacheService,
    private readonly config: AppConfigService,
  ) {}

  list(workspace: string): Promise<InfluencerDto[]> {
    return this.cache.wrap(`influencers:${workspace}`, this.config.redisTtlScores, () =>
      this.provider.list(workspace),
    );
  }
}
