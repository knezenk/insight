import { useQuery } from '@tanstack/react-query';
import type { ClippingFilterDto } from '@insight/shared';

import { clippingService } from '@/services/clipping.service';

export function useClipping(filter: ClippingFilterDto) {
  return useQuery({
    queryKey: ['clipping', filter],
    queryFn: () => clippingService.list(filter),
    placeholderData: (prev) => prev,
  });
}
