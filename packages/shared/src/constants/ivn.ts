/**
 * Índice de Valor da Notícia (IVN) — escala -10 a +10.
 *
 * Fórmula: Σ(score × peso_segmento) ÷ (total_matérias × 3) × 10
 */
export const IVN_SCALE_MIN = -10;
export const IVN_SCALE_MAX = 10;

export const IVN_BANDS = [
  { min: 7, max: 10, label: 'Excelente', tone: 'success' },
  { min: 3, max: 7, label: 'Bom', tone: 'success' },
  { min: 0, max: 3, label: 'Aceitável', tone: 'warning' },
  { min: -3, max: 0, label: 'Adverso', tone: 'warning' },
  { min: -6, max: -3, label: 'Crítico', tone: 'danger' },
  { min: -10, max: -6, label: 'Grave', tone: 'danger' },
] as const;
