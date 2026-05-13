import { useQuery } from '@tanstack/react-query';
import { alertsService } from '@/services/alerts.service';

export function useAlerts(workspace: string) {
  return useQuery({
    queryKey: ['alerts', workspace],
    queryFn: () => alertsService.list(workspace),
    refetchInterval: 60_000,
  });
}
