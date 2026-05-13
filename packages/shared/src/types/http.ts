/**
 * Envelope padrão de resposta HTTP usado pela API.
 * Toda resposta de sucesso vem nesse formato.
 */
export interface ApiResponse<T> {
  data: T;
  meta?: ApiResponseMeta;
}

export interface ApiResponseMeta {
  requestId: string;
  timestamp: string;
  cached?: boolean;
  cacheTTL?: number;
  source?: 'mock' | 'http';
}

export interface ApiError {
  statusCode: number;
  code: string;
  message: string;
  details?: unknown;
  timestamp: string;
  path?: string;
  requestId?: string;
}

export const HTTP_HEADERS = {
  REQUEST_ID: 'x-request-id',
  TENANT_ID: 'x-tenant-id',
  IDEMPOTENCY_KEY: 'idempotency-key',
} as const;
