import { Injectable } from '@nestjs/common';
import axios, { type AxiosInstance } from 'axios';

import type { ClippingFilterDto, ClippingItemDto, Paginated } from '@insight/shared';

import { AppConfigService } from '@/config/app-config.service';
import { withRetry } from '@/common/utils/retry';
import type { ClippingProvider } from './clipping.provider.interface';

/**
 * Provider HTTP real para a API de clipping externa.
 * Ativado quando FAKE_DATA=0.
 */
@Injectable()
export class ClippingHttpProvider implements ClippingProvider {
  private readonly client: AxiosInstance;

  constructor(private readonly config: AppConfigService) {
    const cfg = this.config.clippingApi;
    this.client = axios.create({
      baseURL: cfg.baseUrl,
      timeout: cfg.timeoutMs,
      headers: cfg.token ? { Authorization: `Bearer ${cfg.token}` } : {},
    });
  }

  async list(filter: ClippingFilterDto): Promise<Paginated<ClippingItemDto>> {
    return withRetry(
      async () => {
        const { data } = await this.client.get<Paginated<ClippingItemDto>>('/v1/clippings', {
          params: filter,
        });
        return data;
      },
      { maxAttempts: 3, baseDelayMs: 250, shouldRetry: (e) => this.isRetriable(e) },
    );
  }

  async getById(workspace: string, id: string): Promise<ClippingItemDto | null> {
    try {
      const { data } = await this.client.get<ClippingItemDto>(`/v1/clippings/${id}`, {
        params: { workspace },
      });
      return data;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) return null;
      throw err;
    }
  }

  private isRetriable(err: unknown): boolean {
    if (!axios.isAxiosError(err)) return false;
    const status = err.response?.status ?? 0;
    return status >= 500 || err.code === 'ECONNABORTED' || err.code === 'ETIMEDOUT';
  }
}
