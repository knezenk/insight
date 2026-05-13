import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import type { Request, Response } from 'express';
import { Observable, map } from 'rxjs';
import { v4 as uuid } from 'uuid';

import type { ApiResponse, ApiResponseMeta } from '@insight/shared';

/**
 * Embrulha toda resposta de sucesso no envelope ApiResponse<T>.
 * Endpoints podem desabilitar adicionando `@SkipTransform()` (futuro).
 */
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ApiResponse<T>> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();
    const requestId = (req.headers['x-request-id'] as string) ?? uuid();
    res.setHeader('x-request-id', requestId);

    return next.handle().pipe(
      map((data) => {
        const meta: ApiResponseMeta = {
          requestId,
          timestamp: new Date().toISOString(),
          cached: res.getHeader('x-cache-hit') === 'HIT',
        };
        return { data, meta };
      }),
    );
  }
}
