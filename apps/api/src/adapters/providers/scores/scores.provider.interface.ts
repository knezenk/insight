import type { Indice360Dto, IvnScoreDto, ReputationalRiskDto, FinancialImpactDto } from '@insight/shared';

export interface ScoresQuery {
  workspace: string;
  from: string;
  to: string;
}

export interface ScoresProvider {
  ivn(q: ScoresQuery): Promise<IvnScoreDto>;
  indice360(q: ScoresQuery): Promise<Indice360Dto>;
  reputationalRisk(q: ScoresQuery): Promise<ReputationalRiskDto>;
  financialImpact(q: ScoresQuery): Promise<FinancialImpactDto>;
}
