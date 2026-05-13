/**
 * Índice 360 — score consolidado proprietário (0-100).
 *
 * 6 variáveis ponderadas:
 * favorability(30%) + reach(20%) + vpe(15%) + premiumShare(15%) +
 * diversity(10%) + velocity(10%)
 */
export const INDICE_360_WEIGHTS = {
  favorability: 0.3,
  reach: 0.2,
  vpe: 0.15,
  premiumShare: 0.15,
  diversity: 0.1,
  velocity: 0.1,
} as const;

export const INDICE_360_BANDS = [
  { min: 0, max: 30, label: 'Crítico', color: '#A02B1A' },
  { min: 31, max: 50, label: 'Adverso', color: '#A57619' },
  { min: 51, max: 70, label: 'Aceitável', color: '#C8861E' },
  { min: 71, max: 85, label: 'Bom', color: '#2D7D5C' },
  { min: 86, max: 100, label: 'Excelente', color: '#1A5F44' },
] as const;
