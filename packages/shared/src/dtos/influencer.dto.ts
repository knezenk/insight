export interface InfluencerDto {
  id: string;
  workspace: string;
  name: string;
  outlet: string;
  posture: 'FAVORAVEL' | 'CRITICO' | 'HOSTIL';
  influence: 'BAIXO' | 'MEDIO' | 'ALTO';
  mentionsCount: number;
  averageIvn: number;
  recommendedAction: 'CULTIVAR' | 'RELACIONAR' | 'MONITORAR' | 'ATENCAO';
  reach?: number;
}
