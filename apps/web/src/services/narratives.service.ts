import type { NarrativeDto } from '@insight/shared';
import { http, unwrap } from '@/lib/http';

export const narrativesService = {
  list: (workspace: string, from: string, to: string) =>
    http
      .get<{ data: NarrativeDto[] }>('/narratives', { params: { workspace, from, to } })
      .then((r) => unwrap(r.data)),
};
