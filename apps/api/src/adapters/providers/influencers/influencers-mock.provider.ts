import { Injectable } from '@nestjs/common';
import type { InfluencerDto } from '@insight/shared';
import { MockDataGenerator } from '@/adapters/strategies/mock-data-generator';

@Injectable()
export class InfluencersMockProvider {
  async list(workspace: string): Promise<InfluencerDto[]> {
    const gen = new MockDataGenerator(`${workspace}-influencers`);
    const seeds = this.seedsByWorkspace(workspace);
    return seeds.map((s, i) => ({
      id: `${workspace}-inf-${i}`,
      workspace,
      name: s.name,
      outlet: s.outlet,
      posture: s.posture,
      influence: gen.pick(['BAIXO', 'MEDIO', 'ALTO']),
      mentionsCount: gen.intBetween(3, 30),
      averageIvn: Number((gen.intBetween(-25, 25) / 10).toFixed(1)),
      recommendedAction:
        s.posture === 'HOSTIL' ? 'ATENCAO' : s.posture === 'CRITICO' ? 'MONITORAR' : 'CULTIVAR',
      reach: gen.intBetween(50_000, 8_000_000),
    }));
  }

  private seedsByWorkspace(ws: string): { name: string; outlet: string; posture: InfluencerDto['posture'] }[] {
    const map: Record<string, ReturnType<typeof this.seedsByWorkspace>> = {
      mjsp: [
        { name: 'Bela Megale', outlet: 'O Globo', posture: 'HOSTIL' },
        { name: 'Vera Magalhães', outlet: 'Estadão/CBN', posture: 'CRITICO' },
        { name: 'Felipe Recondo', outlet: 'JOTA', posture: 'CRITICO' },
        { name: 'Andréia Sadi', outlet: 'GloboNews', posture: 'FAVORAVEL' },
      ],
      btg: [
        { name: 'Pierre Schurmann', outlet: 'InfoMoney', posture: 'FAVORAVEL' },
        { name: 'Maria Luíza Filgueiras', outlet: 'Brazil Journal', posture: 'CRITICO' },
        { name: 'Lauro Jardim', outlet: 'O Globo', posture: 'CRITICO' },
      ],
    };
    return map[ws] ?? [];
  }
}
