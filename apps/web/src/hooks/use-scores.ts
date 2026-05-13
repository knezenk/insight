import { useQuery } from '@tanstack/react-query';
import { scoresService } from '@/services/scores.service';

interface Q {
  workspace: string;
  from: string;
  to: string;
}

export function useIvn(q: Q) {
  return useQuery({ queryKey: ['scores', 'ivn', q], queryFn: () => scoresService.ivn(q) });
}
export function useIndice360(q: Q) {
  return useQuery({ queryKey: ['scores', 'i360', q], queryFn: () => scoresService.indice360(q) });
}
export function useReputationalRisk(q: Q) {
  return useQuery({ queryKey: ['scores', 'risk', q], queryFn: () => scoresService.risk(q) });
}
export function useFinancialImpact(q: Q) {
  return useQuery({ queryKey: ['scores', 'fin', q], queryFn: () => scoresService.financial(q) });
}
