import type { CompetitiveDto } from '@insight/shared';
import { http, unwrap } from '@/lib/http';

export const competitiveService = {
  get: (workspace: string, from: string, to: string) =>
    http
      .get<{ data: CompetitiveDto }>('/competitive', { params: { workspace, from, to } })
      .then((r) => unwrap(r.data)),
};
