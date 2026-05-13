import type { AlertSeverity } from '../types/severity';

export interface AlertDto {
  id: string;
  workspace: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  triggeredAt: string;
  rule: string;
  responseWindow: string;
  status: 'open' | 'in_progress' | 'resolved';
  relatedClippingIds?: string[];
}

export interface AlertRuleDto {
  id: string;
  workspace: string;
  name: string;
  enabled: boolean;
  condition: AlertCondition;
  action: { severity: AlertSeverity; channels: string[] };
}

export interface AlertCondition {
  metric: 'volume_negative' | 'volume_total' | 'mention' | 'velocity' | 'social_shares';
  operator: '>=' | '>' | '=';
  threshold: number;
  windowHours: number;
  segment?: string;
}
