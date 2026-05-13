import { useQuery } from '@tanstack/react-query';
import { influencersService } from '@/services/influencers.service';

export function useInfluencers(workspace: string) {
  return useQuery({
    queryKey: ['influencers', workspace],
    queryFn: () => influencersService.list(workspace),
  });
}
