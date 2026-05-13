/**
 * Pesos por segmento de mídia para cálculo do IVN.
 * Mantenha sincronizado com docs/METRICS.md.
 */
export type MediaSegment =
  | 'PREMIUM'
  | 'NACIONAL_TV'
  | 'NACIONAL_DIGITAL'
  | 'ESPECIALIZADO'
  | 'REGIONAL'
  | 'HOSTIL_ESTRUTURAL';

export const MediaSegmentWeight: Record<MediaSegment, number> = {
  PREMIUM: 2.0,
  NACIONAL_TV: 1.5,
  NACIONAL_DIGITAL: 1.2,
  ESPECIALIZADO: 1.3,
  REGIONAL: 1.0,
  HOSTIL_ESTRUTURAL: 0.7,
};

export const MediaSegmentLabel: Record<MediaSegment, string> = {
  PREMIUM: 'Premium',
  NACIONAL_TV: 'Nacional · TV',
  NACIONAL_DIGITAL: 'Nacional · digital',
  ESPECIALIZADO: 'Especializado',
  REGIONAL: 'Regional',
  HOSTIL_ESTRUTURAL: 'Hostil estrutural',
};

export type MediaType = 'tv' | 'radio' | 'print' | 'online' | 'social';
