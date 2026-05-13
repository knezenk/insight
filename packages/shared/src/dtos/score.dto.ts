export interface IvnScoreDto {
  workspace: string;
  period: { from: string; to: string };
  ivn: number;
  ivnPrev: number;
  variation: number;
  diagnosis: string;
}

export interface Indice360Dto {
  workspace: string;
  period: { from: string; to: string };
  score: number;
  band: 'critico' | 'adverso' | 'aceitavel' | 'bom' | 'excelente';
  components: {
    favorability: { value: number; weight: number; contribution: number };
    reach: { value: number; weight: number; contribution: number };
    vpe: { value: number; weight: number; contribution: number };
    premiumShare: { value: number; weight: number; contribution: number };
    diversity: { value: number; weight: number; contribution: number };
    velocity: { value: number; weight: number; contribution: number };
  };
}

export interface ReputationalRiskDto {
  workspace: string;
  score: number;
  level: 'irrelevante' | 'baixo' | 'moderado' | 'alto' | 'critico';
  drivers: { factor: string; weight: number; impact: number }[];
}

export interface FinancialImpactDto {
  workspace: string;
  score: number;
  level: 'irrelevante' | 'potencial' | 'relevante' | 'critico';
}
