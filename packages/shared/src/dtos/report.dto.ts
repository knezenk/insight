export type ReportType =
  | 'audit_full'
  | 'daily_brief'
  | 'crisis'
  | 'competitive'
  | 'influencers_map'
  | 'narratives_map'
  | 'sector_intelligence'
  | 'social'
  | 'release'
  | 'custom';

export interface ReportRequestDto {
  type: ReportType;
  workspace: string;
  from: string;
  to: string;
  recipients?: string[];
}

export interface ReportJobDto {
  id: string;
  type: ReportType;
  workspace: string;
  status: 'queued' | 'rendering' | 'ready' | 'failed';
  progress: number;
  pdfUrl?: string;
  error?: string;
  createdAt: string;
  completedAt?: string;
  expiresAt?: string;
}
