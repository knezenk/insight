/**
 * Sistema de sentimento de 6 níveis (sem neutro).
 * Cada matéria recebe exatamente 1 destes valores.
 */
export const SentimentScore = {
  MUITO_POSITIVO: 3,
  POSITIVO: 2,
  POUCO_POSITIVO: 1,
  POUCO_NEGATIVO: -1,
  NEGATIVO: -2,
  MUITO_NEGATIVO: -3,
} as const;

export type SentimentScoreValue = (typeof SentimentScore)[keyof typeof SentimentScore];

export type SentimentLabel =
  | 'MUITO_POSITIVO'
  | 'POSITIVO'
  | 'POUCO_POSITIVO'
  | 'POUCO_NEGATIVO'
  | 'NEGATIVO'
  | 'MUITO_NEGATIVO';

export const SentimentLabelByScore: Record<SentimentScoreValue, SentimentLabel> = {
  3: 'MUITO_POSITIVO',
  2: 'POSITIVO',
  1: 'POUCO_POSITIVO',
  [-1]: 'POUCO_NEGATIVO',
  [-2]: 'NEGATIVO',
  [-3]: 'MUITO_NEGATIVO',
};

export const SentimentColorByScore: Record<SentimentScoreValue, string> = {
  3: '#1A5F44',
  2: '#2D7D5C',
  1: '#A7DEC2',
  [-1]: '#FCEFD7',
  [-2]: '#E54724',
  [-3]: '#A02B1A',
};
