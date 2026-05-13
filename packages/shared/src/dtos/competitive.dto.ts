export interface CompetitiveDto {
  workspace: string;
  period: { from: string; to: string };
  competitors: {
    name: string;
    isUs: boolean;
    volume: number;
    sov: number;
    ivn: number;
    dominantNarrative?: string;
  }[];
}
