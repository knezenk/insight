import type { ClippingFilterDto, ClippingItemDto, Paginated } from '@insight/shared';

import { http, unwrap } from '@/lib/http';

export const clippingService = {
  list: (filter: ClippingFilterDto) =>
    http
      .get<{ data: Paginated<ClippingItemDto> }>('/clipping', { params: filter })
      .then((r) => unwrap(r.data)),
  get: (id: string, workspace: string) =>
    http
      .get<{ data: ClippingItemDto }>(`/clipping/${id}`, { params: { workspace } })
      .then((r) => unwrap(r.data)),
};
