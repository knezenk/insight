import { Injectable } from '@nestjs/common';
import type { AlertDto } from '@insight/shared';
import { MockDataGenerator } from '@/adapters/strategies/mock-data-generator';

@Injectable()
export class AlertsMockProvider {
  async list(workspace: string): Promise<AlertDto[]> {
    const gen = new MockDataGenerator(`${workspace}-alerts`);
    const seeds = [
      { sev: 'CRITICO' as const, title: 'Pico negativo Premium', win: '24-48h', desc: '8 matérias NEG em veículos premium em 6h' },
      { sev: 'CRITICO' as const, title: 'Influenciador hostil ALTO', win: '24-48h', desc: 'Cobertura crítica de jornalista de alto alcance' },
      { sev: 'ALTO' as const, title: 'Greve afeta operação', win: '72h', desc: 'Categoria do setor anuncia paralisação' },
    ];
    return seeds.map((s, i) => ({
      id: `${workspace}-alert-${i}`,
      workspace,
      severity: s.sev,
      title: s.title,
      description: s.desc,
      triggeredAt: new Date(Date.now() - gen.intBetween(0, 24) * 3_600_000).toISOString(),
      rule: 'pico-neg-premium',
      responseWindow: s.win,
      status: 'open',
    }));
  }
}
