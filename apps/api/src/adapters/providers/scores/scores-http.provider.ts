import { Injectable, Logger } from '@nestjs/common';
import axios, { type AxiosInstance } from 'axios';

import type { Indice360Dto, IvnScoreDto, FinancialImpactDto, ReputationalRiskDto } from '@insight/shared';

import { AppConfigService } from '@/config/app-config.service';
import { withRetry } from '@/common/utils/retry';
import type { ScoresProvider, ScoresQuery } from './scores.provider.interface';

@Injectable()
export class ScoresHttpProvider implements ScoresProvider {
  private readonly logger = new Logger(ScoresHttpProvider.name);
  private readonly client: AxiosInstance;

  constructor(private readonly config: AppConfigService) {
    const cfg = this.config.nlpApi;
    this.client = axios.create({
      baseURL: cfg.baseUrl,
      timeout: cfg.timeoutMs,
      headers: cfg.token ? { Authorization: `Bearer ${cfg.token}` } : {},
    });
  }

  ivn(q: ScoresQuery): Promise<IvnScoreDto> {
    return withRetry(() => this.client.get<IvnScoreDto>('/v1/scores/ivn', { params: q }).then((r) => r.data));
  }
  indice360(q: ScoresQuery): Promise<Indice360Dto> {
    return withRetry(() => this.client.get<Indice360Dto>('/v1/scores/indice360', { params: q }).then((r) => r.data));
  }
  reputationalRisk(q: ScoresQuery): Promise<ReputationalRiskDto> {
    return withRetry(() =>
      this.client.get<ReputationalRiskDto>('/v1/scores/risk', { params: q }).then((r) => r.data),
    );
  }
  financialImpact(q: ScoresQuery): Promise<FinancialImpactDto> {
    return withRetry(() =>
      this.client.get<FinancialImpactDto>('/v1/scores/financial', { params: q }).then((r) => r.data),
    );
  }
}
