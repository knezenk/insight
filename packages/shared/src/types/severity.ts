export type AlertSeverity = 'CRITICO' | 'ALTO' | 'MONITORAR';

export const AlertSeverityWeight: Record<AlertSeverity, number> = {
  CRITICO: 100,
  ALTO: 60,
  MONITORAR: 20,
};

export const AlertSeverityWindow: Record<AlertSeverity, string> = {
  CRITICO: '24-48h',
  ALTO: '72h',
  MONITORAR: '7d',
};
