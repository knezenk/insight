import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';

import type { ApiError } from '@insight/shared';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const requestId = (request.headers['x-request-id'] as string) ?? uuid();
    const isHttp = exception instanceof HttpException;
    const status = isHttp ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    let code = 'INTERNAL_ERROR';
    let message = 'Erro interno do servidor';
    let details: unknown;

    if (isHttp) {
      const res = exception.getResponse() as Record<string, unknown> | string;
      if (typeof res === 'string') {
        message = res;
      } else {
        message = (res.message as string) ?? exception.message;
        code = (res.code as string) ?? this.codeFromStatus(status);
        details = res.details ?? undefined;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    if (status >= 500) {
      this.logger.error(
        { err: exception, requestId, path: request.url, method: request.method },
        'Unhandled exception',
      );
    } else {
      this.logger.warn({ requestId, path: request.url, status, message }, 'Handled exception');
    }

    const body: ApiError = {
      statusCode: status,
      code,
      message,
      details,
      timestamp: new Date().toISOString(),
      path: request.url,
      requestId,
    };

    response.status(status).setHeader('x-request-id', requestId).json(body);
  }

  private codeFromStatus(status: number): string {
    const map: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      422: 'UNPROCESSABLE_ENTITY',
      429: 'RATE_LIMIT_EXCEEDED',
    };
    return map[status] ?? 'ERROR';
  }
}
