import type {
  Indice360Dto,
  IvnScoreDto,
  FinancialImpactDto,
  ReputationalRiskDto,
} from '@insight/shared';

import { http, unwrap } from '@/lib/http';

interface Q {
  workspace: string;
  from: string;
  to: string;
}

export const scoresService = {
  ivn: (q: Q) => http.get<{ data: IvnScoreDto }>('/scores/ivn', { params: q }).then((r) => unwrap(r.data)),
  indice360: (q: Q) =>
    http.get<{ data: Indice360Dto }>('/scores/indice360', { params: q }).then((r) => unwrap(r.data)),
  risk: (q: Q) =>
    http.get<{ data: ReputationalRiskDto }>('/scores/risk', { params: q }).then((r) => unwrap(r.data)),
  financial: (q: Q) =>
    http
      .get<{ data: FinancialImpactDto }>('/scores/financial', { params: q })
      .then((r) => unwrap(r.data)),
};
