import type { AlertDto } from '@insight/shared';
import { http, unwrap } from '@/lib/http';

export const alertsService = {
  list: (workspace: string) =>
    http.get<{ data: AlertDto[] }>('/alerts', { params: { workspace } }).then((r) => unwrap(r.data)),
};
