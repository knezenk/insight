import type { MediaSegment, MediaType } from '../types/media-segment';
import type { SentimentLabel, SentimentScoreValue } from '../types/sentiment';

export interface ClippingItemDto {
  id: string;
  workspace: string;
  title: string;
  url?: string;
  source: string;
  segment: MediaSegment;
  mediaType: MediaType;
  publishedAt: string;
  category: string;
  author?: string;
  sentimentScore: SentimentScoreValue;
  sentimentLabel: SentimentLabel;
  ivn: number;
  reach?: number;
  vpe?: number;
  spread: 'baixa' | 'media' | 'alta';
  thumbnailUrl?: string;
  excerpt?: string;
}

export interface ClippingFilterDto {
  workspace: string;
  from?: string;
  to?: string;
  segments?: MediaSegment[];
  mediaTypes?: MediaType[];
  sentiments?: SentimentScoreValue[];
  categories?: string[];
  sources?: string[];
  searchQuery?: string;
  page?: number;
  pageSize?: number;
}
