import {
  type ClippingItemDto,
  type MediaSegment,
  type MediaType,
  MediaSegmentLabel,
  type SentimentScoreValue,
  SentimentLabelByScore,
  calculateIvn,
} from '@insight/shared';

/**
 * Gerador determinístico de dados sintéticos coerentes.
 * Mesma seed → mesmo resultado. Permite testes reprodutíveis.
 */
export class MockDataGenerator {
  private seed: number;

  constructor(seed: string | number = 'insight') {
    this.seed = typeof seed === 'number' ? seed : this.hashSeed(seed);
  }

  private hashSeed(str: string): number {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
    return h >>> 0;
  }

  /** Mulberry32 — PRNG determinístico, leve e rápido. */
  private rand(): number {
    let t = (this.seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
  }

  pick<T>(arr: readonly T[]): T {
    return arr[Math.floor(this.rand() * arr.length)]!;
  }

  intBetween(min: number, max: number): number {
    return Math.floor(this.rand() * (max - min + 1)) + min;
  }

  randomSentiment(): SentimentScoreValue {
    return this.pick([3, 2, 1, -1, -2, -3] as SentimentScoreValue[]);
  }

  randomMediaSegment(): MediaSegment {
    return this.pick(Object.keys(MediaSegmentLabel) as MediaSegment[]);
  }

  randomMediaType(): MediaType {
    return this.pick(['tv', 'radio', 'print', 'online', 'social'] as MediaType[]);
  }

  /** Gera N matérias coerentes pra um workspace. */
  generateClippings(workspace: string, count: number, periodDays = 30): ClippingItemDto[] {
    const sources = this.sourcesByWorkspace(workspace);
    const categories = ['Operações', 'Política', 'Resultados', 'Atenção', 'Cooperação'];
    const items: ClippingItemDto[] = [];
    for (let i = 0; i < count; i++) {
      const score = this.randomSentiment();
      const segment = this.randomMediaSegment();
      const mediaType = this.randomMediaType();
      const source = this.pick(sources);
      const daysAgo = this.intBetween(0, periodDays);
      const publishedAt = new Date(Date.now() - daysAgo * 86_400_000).toISOString();
      const ivn = calculateIvn([{ score, segment }]);
      items.push({
        id: `${workspace}-${i.toString().padStart(6, '0')}`,
        workspace,
        title: this.titleByWorkspace(workspace, i),
        source,
        segment,
        mediaType,
        publishedAt,
        category: this.pick(categories),
        author: this.pick(['Repórter', 'Coluna', 'Redação', 'Agência']),
        sentimentScore: score,
        sentimentLabel: SentimentLabelByScore[score],
        ivn,
        reach: this.intBetween(10_000, 5_000_000),
        vpe: this.intBetween(1_000, 200_000),
        spread: this.pick(['baixa', 'media', 'alta']),
        excerpt:
          'Resumo da matéria · gerado por mock determinístico para fins de desenvolvimento.',
      });
    }
    return items.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  }

  private sourcesByWorkspace(workspace: string): string[] {
    const map: Record<string, string[]> = {
      mjsp: ['Folha de S.Paulo', 'O Globo', 'Estadão', 'Metrópoles', 'G1', 'JOTA', 'CNN Brasil'],
      btg: ['Valor Econômico', 'InfoMoney', 'Brazil Journal', 'Pipeline Valor', 'Folha', 'Estadão'],
      defesa: ['Defesa Net', 'Estadão', 'O Globo', 'Folha', 'Reuters Brasil'],
      ebserh: ['UOL Saúde', 'Veja Saúde', 'Folha', 'Correio Brasiliense', 'G1'],
      petrobras: ['Valor Econômico', 'Reuters', 'O Globo', 'Estadão', 'Pipeline Valor'],
      agu: ['JOTA', 'ConJur', 'Migalhas', 'Folha', 'Estadão'],
    };
    return map[workspace] ?? ['Veículo A', 'Veículo B', 'Veículo C'];
  }

  private titleByWorkspace(workspace: string, idx: number): string {
    const templates: Record<string, string[]> = {
      mjsp: [
        'PF deflagra operação em',
        'Ministério da Justiça anuncia',
        'Lewandowski participa de',
        'PEC da Segurança avança em',
      ],
      btg: [
        'BTG Pactual anuncia resultado de',
        'BTG amplia operação em',
        'Disputa com XP no segmento',
        'Banco lidera ranking de',
      ],
      defesa: ['Marinha realiza exercício', 'Exército amplia presença em', 'Aeronáutica recebe novo'],
    };
    const list = templates[workspace] ?? ['Cobertura institucional', 'Reportagem sobre', 'Análise de'];
    return `${this.pick(list)} ${idx + 1}`;
  }
}
