import { INDICE_360_BANDS, INDICE_360_WEIGHTS } from '../constants/indice360';

export interface Indice360Components {
  favorability: number;
  reach: number;
  vpe: number;
  premiumShare: number;
  diversity: number;
  velocity: number;
}

/**
 * Calcula o Índice 360 (0-100) a partir das 6 componentes (cada uma 0-1).
 * Detalhes em docs/METRICS.md#indice-360.
 */
export function calculateIndice360(c: Indice360Components): number {
  const w = INDICE_360_WEIGHTS;
  const score =
    c.favorability * w.favorability +
    c.reach * w.reach +
    c.vpe * w.vpe +
    c.premiumShare * w.premiumShare +
    c.diversity * w.diversity +
    c.velocity * w.velocity;
  return Math.round(score * 100);
}

export function indice360Band(
  score: number,
): (typeof INDICE_360_BANDS)[number] {
  return INDICE_360_BANDS.find((b) => score >= b.min && score <= b.max) ?? INDICE_360_BANDS[0];
}
