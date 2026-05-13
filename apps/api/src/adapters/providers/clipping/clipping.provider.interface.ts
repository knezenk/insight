import type { ClippingFilterDto, ClippingItemDto, Paginated } from '@insight/shared';

export interface ClippingProvider {
  list(filter: ClippingFilterDto): Promise<Paginated<ClippingItemDto>>;
  getById(workspace: string, id: string): Promise<ClippingItemDto | null>;
}
