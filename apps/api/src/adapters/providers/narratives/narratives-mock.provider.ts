import { Injectable } from '@nestjs/common';
import type { NarrativeDto } from '@insight/shared';
import { MockDataGenerator } from '@/adapters/strategies/mock-data-generator';

@Injectable()
export class NarrativesMockProvider {
  async list(workspace: string, _from: string, _to: string): Promise<NarrativeDto[]> {
    const gen = new MockDataGenerator(`${workspace}-narratives`);
    const titles = this.titlesByWorkspace(workspace);
    return titles.map((title, i) => {
      const ivn = Number((gen.intBetween(-25, 25) / 10).toFixed(1));
      const volume = gen.intBetween(20, 250);
      return {
        id: `${workspace}-narr-${i}`,
        workspace,
        title,
        volume,
        ivn,
        status: ivn < -1 ? 'alerta' : ivn < -2 ? 'crise' : 'normal',
        trend: gen.pick(['up', 'down', 'stable']),
        topSources: gen.pick([
          ['Folha', 'Globo', 'Estadão'],
          ['Valor', 'Brazil Journal', 'InfoMoney'],
          ['UOL', 'G1', 'Metrópoles'],
        ]),
        startedAt: new Date(Date.now() - gen.intBetween(0, 30) * 86_400_000).toISOString(),
      };
    });
  }

  private titlesByWorkspace(workspace: string): string[] {
    const map: Record<string, string[]> = {
      mjsp: ['Caso Master', 'Operações da PF', 'PEC da Segurança', 'Plataforma de feminicídio'],
      btg: ['Performance financeira', 'Disputa com XP', 'M&A / IPOs', 'Wealth Management'],
      petrobras: ['Resultados do trimestre', 'Pré-sal recorde', 'Eólica offshore', 'Royalties RJ'],
    };
    return map[workspace] ?? ['Cobertura institucional', 'Política do setor', 'Resultados', 'Atenção'];
  }
}
