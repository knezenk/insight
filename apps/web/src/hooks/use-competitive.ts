import { useQuery } from '@tanstack/react-query';
import { competitiveService } from '@/services/competitive.service';

export function useCompetitive(workspace: string, from: string, to: string) {
  return useQuery({
    queryKey: ['competitive', workspace, from, to],
    queryFn: () => competitiveService.get(workspace, from, to),
  });
}
