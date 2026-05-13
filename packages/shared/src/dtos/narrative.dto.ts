export interface NarrativeDto {
  id: string;
  workspace: string;
  title: string;
  volume: number;
  ivn: number;
  status: 'normal' | 'alerta' | 'crise';
  trend: 'up' | 'down' | 'stable';
  topSources: string[];
  startedAt: string;
}
