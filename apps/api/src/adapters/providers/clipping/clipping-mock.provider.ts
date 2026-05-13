import { Injectable, Logger } from '@nestjs/common';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, type ClippingFilterDto, type ClippingItemDto, type Paginated } from '@insight/shared';

import { MockDataGenerator } from '@/adapters/strategies/mock-data-generator';
import type { ClippingProvider } from './clipping.provider.interface';

const VOLUME_BY_WORKSPACE: Record<string, number> = {
  mjsp: 1025,
  btg: 1482,
  defesa: 184,
  ebserh: 142,
  petrobras: 312,
  agu: 168,
};

@Injectable()
export class ClippingMockProvider implements ClippingProvider {
  private readonly logger = new Logger(ClippingMockProvider.name);
  private readonly cache = new Map<string, ClippingItemDto[]>();

  private getDataset(workspace: string): ClippingItemDto[] {
    if (!this.cache.has(workspace)) {
      const total = VOLUME_BY_WORKSPACE[workspace] ?? 250;
      const gen = new MockDataGenerator(workspace);
      this.cache.set(workspace, gen.generateClippings(workspace, total));
      this.logger.log(`Mock dataset gerado · ${workspace} · ${total} matérias`);
    }
    return this.cache.get(workspace)!;
  }

  async list(filter: ClippingFilterDto): Promise<Paginated<ClippingItemDto>> {
    let items = this.getDataset(filter.workspace);
    if (filter.from) items = items.filter((i) => i.publishedAt >= filter.from!);
    if (filter.to) items = items.filter((i) => i.publishedAt <= filter.to!);
    if (filter.segments?.length) items = items.filter((i) => filter.segments!.includes(i.segment));
    if (filter.mediaTypes?.length) items = items.filter((i) => filter.mediaTypes!.includes(i.mediaType));
    if (filter.sentiments?.length)
      items = items.filter((i) => filter.sentiments!.includes(i.sentimentScore));
    if (filter.categories?.length)
      items = items.filter((i) => filter.categories!.includes(i.category));
    if (filter.sources?.length) items = items.filter((i) => filter.sources!.includes(i.source));
    if (filter.searchQuery) {
      const q = filter.searchQuery.toLowerCase();
      items = items.filter((i) => i.title.toLowerCase().includes(q));
    }

    const page = filter.page ?? DEFAULT_PAGE;
    const pageSize = filter.pageSize ?? DEFAULT_PAGE_SIZE;
    const total = items.length;
    const start = (page - 1) * pageSize;
    const slice = items.slice(start, start + pageSize);

    return {
      items: slice,
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
      hasNext: start + pageSize < total,
      hasPrev: page > 1,
    };
  }

  async getById(workspace: string, id: string): Promise<ClippingItemDto | null> {
    return this.getDataset(workspace).find((i) => i.id === id) ?? null;
  }
}
