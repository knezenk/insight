import { Injectable } from '@nestjs/common';

import {
  calculateIndice360,
  type Indice360Dto,
  indice360Band,
  type IvnScoreDto,
  type FinancialImpactDto,
  type ReputationalRiskDto,
} from '@insight/shared';

import { MockDataGenerator } from '@/adapters/strategies/mock-data-generator';
import type { ScoresProvider, ScoresQuery } from './scores.provider.interface';

@Injectable()
export class ScoresMockProvider implements ScoresProvider {
  async ivn(q: ScoresQuery): Promise<IvnScoreDto> {
    const seed = `${q.workspace}-ivn-${q.from}-${q.to}`;
    const gen = new MockDataGenerator(seed);
    const ivn = Number((gen.intBetween(-50, 30) / 10).toFixed(1));
    const ivnPrev = Number((gen.intBetween(-50, 30) / 10).toFixed(1));
    return {
      workspace: q.workspace,
      period: { from: q.from, to: q.to },
      ivn,
      ivnPrev,
      variation: Number((ivn - ivnPrev).toFixed(2)),
      diagnosis:
        ivn < -3
          ? 'Crise reputacional em desenvolvimento · ação imediata'
          : ivn < 0
            ? 'Cobertura adversa · reverter narrativa'
            : ivn < 3
              ? 'Ambiente aceitável · manter posicionamento'
              : 'Reputação sólida · preservar momentum',
    };
  }

  async indice360(q: ScoresQuery): Promise<Indice360Dto> {
    const gen = new MockDataGenerator(`${q.workspace}-i360-${q.from}-${q.to}`);
    const components = {
      favorability: gen.intBetween(20, 90) / 100,
      reach: gen.intBetween(40, 95) / 100,
      vpe: gen.intBetween(30, 90) / 100,
      premiumShare: gen.intBetween(20, 60) / 100,
      diversity: gen.intBetween(40, 90) / 100,
      velocity: gen.intBetween(50, 95) / 100,
    };
    const score = calculateIndice360(components);
    const band = indice360Band(score);
    return {
      workspace: q.workspace,
      period: { from: q.from, to: q.to },
      score,
      band: band.label.toLowerCase().replace('í', 'i').replace('á', 'a') as Indice360Dto['band'],
      components: {
        favorability: { value: components.favorability, weight: 0.3, contribution: components.favorability * 0.3 * 100 },
        reach: { value: components.reach, weight: 0.2, contribution: components.reach * 0.2 * 100 },
        vpe: { value: components.vpe, weight: 0.15, contribution: components.vpe * 0.15 * 100 },
        premiumShare: { value: components.premiumShare, weight: 0.15, contribution: components.premiumShare * 0.15 * 100 },
        diversity: { value: components.diversity, weight: 0.1, contribution: components.diversity * 0.1 * 100 },
        velocity: { value: components.velocity, weight: 0.1, contribution: components.velocity * 0.1 * 100 },
      },
    };
  }

  async reputationalRisk(q: ScoresQuery): Promise<ReputationalRiskDto> {
    const gen = new MockDataGenerator(`${q.workspace}-risk-${q.from}-${q.to}`);
    const score = gen.intBetween(20, 90);
    const level: ReputationalRiskDto['level'] =
      score <= 20 ? 'irrelevante' : score <= 40 ? 'baixo' : score <= 60 ? 'moderado' : score <= 80 ? 'alto' : 'critico';
    return {
      workspace: q.workspace,
      score,
      level,
      drivers: [
        { factor: 'Volume de cobertura negativa', weight: 0.25, impact: gen.intBetween(40, 90) },
        { factor: 'Autoridade dos veículos', weight: 0.2, impact: gen.intBetween(50, 90) },
        { factor: 'Velocidade de propagação', weight: 0.15, impact: gen.intBetween(30, 80) },
        { factor: 'Tema (gravidade)', weight: 0.25, impact: gen.intBetween(30, 90) },
        { factor: 'Alcance social', weight: 0.15, impact: gen.intBetween(20, 70) },
      ],
    };
  }

  async financialImpact(q: ScoresQuery): Promise<FinancialImpactDto> {
    const gen = new MockDataGenerator(`${q.workspace}-fin-${q.from}-${q.to}`);
    const score = gen.intBetween(15, 90);
    const level: FinancialImpactDto['level'] =
      score <= 25 ? 'irrelevante' : score <= 50 ? 'potencial' : score <= 75 ? 'relevante' : 'critico';
    return { workspace: q.workspace, score, level };
  }
}
