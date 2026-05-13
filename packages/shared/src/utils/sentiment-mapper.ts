import {
  SentimentLabelByScore,
  type SentimentLabel,
  type SentimentScoreValue,
  SentimentScore,
} from '../types/sentiment';

export function sentimentToLabel(score: SentimentScoreValue): SentimentLabel {
  return SentimentLabelByScore[score];
}

export function isPositive(score: number): boolean {
  return score > 0;
}

export function isNegative(score: number): boolean {
  return score < 0;
}

export function labelToScore(label: SentimentLabel): SentimentScoreValue {
  return SentimentScore[label];
}
