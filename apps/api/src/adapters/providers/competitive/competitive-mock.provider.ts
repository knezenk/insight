import { Injectable } from '@nestjs/common';
import type { CompetitiveDto } from '@insight/shared';
import { MockDataGenerator } from '@/adapters/strategies/mock-data-generator';

@Injectable()
export class CompetitiveMockProvider {
  async get(workspace: string, from: string, to: string): Promise<CompetitiveDto> {
    const gen = new MockDataGenerator(`${workspace}-comp-${from}-${to}`);
    const competitors = this.competitorsByWorkspace(workspace).map((c, i) => {
      const volume = gen.intBetween(200, 1500);
      return { ...c, volume, ivn: Number((gen.intBetween(-20, 20) / 10).toFixed(1)), sov: 0, dominantNarrative: c.dominantNarrative ?? '' };
    });
    const totalVol = competitors.reduce((s, c) => s + c.volume, 0);
    competitors.forEach((c) => (c.sov = Number(((c.volume / totalVol) * 100).toFixed(1))));
    return { workspace, period: { from, to }, competitors };
  }

  private competitorsByWorkspace(ws: string): { name: string; isUs: boolean; dominantNarrative?: string }[] {
    const map: Record<string, ReturnType<typeof this.competitorsByWorkspace>> = {
      btg: [
        { name: 'BTG Pactual', isUs: true, dominantNarrative: 'performance financeira' },
        { name: 'XP Inc', isUs: false, dominantNarrative: 'disputa de gestores' },
        { name: 'Itaú BBA', isUs: false, dominantNarrative: 'M&A' },
        { name: 'Bradesco BBI', isUs: false },
        { name: 'Santander CIB', isUs: false },
      ],
      mjsp: [
        { name: 'MJSP', isUs: true, dominantNarrative: 'operações PF' },
        { name: 'MPF', isUs: false },
        { name: 'TJDFT', isUs: false },
        { name: 'STJ', isUs: false },
      ],
    };
    return map[ws] ?? [{ name: ws, isUs: true }];
  }
}
