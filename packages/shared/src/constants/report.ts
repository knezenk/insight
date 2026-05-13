import type { ReportType } from '../dtos/report.dto';

export const REPORT_LABELS: Record<ReportType, string> = {
  audit_full: 'Reputação 360 · mensal',
  daily_brief: 'Boletim Executivo Diário',
  crisis: 'Dossiê de crise',
  competitive: 'Análise competitiva',
  influencers_map: 'Mapa de influenciadores',
  narratives_map: 'Mapa de narrativas',
  sector_intelligence: 'Inteligência setorial',
  social: 'Social listening',
  release: 'Repercussão de release',
  custom: 'Relatório personalizado',
};

export const REPORT_PAGES_ESTIMATE: Record<ReportType, number> = {
  audit_full: 32,
  daily_brief: 2,
  crisis: 11,
  competitive: 14,
  influencers_map: 8,
  narratives_map: 9,
  sector_intelligence: 16,
  social: 10,
  release: 4,
  custom: 24,
};
