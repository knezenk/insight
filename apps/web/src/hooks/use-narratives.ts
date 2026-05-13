import { useQuery } from '@tanstack/react-query';
import { narrativesService } from '@/services/narratives.service';

export function useNarratives(workspace: string, from: string, to: string) {
  return useQuery({
    queryKey: ['narratives', workspace, from, to],
    queryFn: () => narrativesService.list(workspace, from, to),
  });
}
