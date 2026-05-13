import { MediaSegmentWeight, type MediaSegment } from '../types/media-segment';
import type { SentimentScoreValue } from '../types/sentiment';

export interface IvnInput {
  score: SentimentScoreValue;
  segment: MediaSegment;
}

/**
 * Calcula o IVN ponderado de uma coleção de matérias.
 * Mantenha sincronizado com docs/METRICS.md#ivn.
 *
 * @example
 * calculateIvn([
 *   { score: 3, segment: 'PREMIUM' },     // +3 × 2.0 = +6
 *   { score: -2, segment: 'REGIONAL' },   // -2 × 1.0 = -2
 * ]) // → ((6 - 2) / (2 * 3)) * 10 = 6.67
 */
export function calculateIvn(items: IvnInput[]): number {
  if (items.length === 0) return 0;
  const weightedSum = items.reduce(
    (acc, { score, segment }) => acc + score * MediaSegmentWeight[segment],
    0,
  );
  const denominator = items.length * 3;
  const ivn = (weightedSum / denominator) * 10;
  return Number(ivn.toFixed(2));
}
