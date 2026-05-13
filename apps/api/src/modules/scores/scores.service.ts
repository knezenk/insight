import { Inject, Injectable } from '@nestjs/common';

import type {
  Indice360Dto,
  IvnScoreDto,
  FinancialImpactDto,
  ReputationalRiskDto,
} from '@insight/shared';

import { SCORES_PROVIDER } from '@/adapters/providers/tokens';
import type {
  ScoresProvider,
  ScoresQuery,
} from '@/adapters/providers/scores/scores.provider.interface';
import { CacheService } from '@/infrastructure/cache/cache.service';
import { AppConfigService } from '@/config/app-config.service';
import { buildCacheKey } from '@/common/utils/cache-key';

@Injectable()
export class ScoresService {
  constructor(
    @Inject(SCORES_PROVIDER) private readonly provider: ScoresProvider,
    private readonly cache: CacheService,
    private readonly config: AppConfigService,
  ) {}

  ivn(q: ScoresQuery): Promise<IvnScoreDto> {
    return this.cache.wrap(buildCacheKey('scores:ivn', q), this.config.redisTtlScores, () =>
      this.provider.ivn(q),
    );
  }
  indice360(q: ScoresQuery): Promise<Indice360Dto> {
    return this.cache.wrap(buildCacheKey('scores:i360', q), this.config.redisTtlScores, () =>
      this.provider.indice360(q),
    );
  }
  reputationalRisk(q: ScoresQuery): Promise<ReputationalRiskDto> {
    return this.cache.wrap(buildCacheKey('scores:risk', q), this.config.redisTtlScores, () =>
      this.provider.reputationalRisk(q),
    );
  }
  financialImpact(q: ScoresQuery): Promise<FinancialImpactDto> {
    return this.cache.wrap(buildCacheKey('scores:fin', q), this.config.redisTtlScores, () =>
      this.provider.financialImpact(q),
    );
  }
}
