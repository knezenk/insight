import type { InfluencerDto } from '@insight/shared';
import { http, unwrap } from '@/lib/http';

export const influencersService = {
  list: (workspace: string) =>
    http.get<{ data: InfluencerDto[] }>('/influencers', { params: { workspace } }).then((r) => unwrap(r.data)),
};
