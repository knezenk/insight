import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import type { Request } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<Request>();
    const start = Date.now();
    return next.handle().pipe(
      tap({
        next: () =>
          this.logger.log(
            `${req.method} ${req.url} ${Date.now() - start}ms`,
          ),
        error: (err) =>
          this.logger.warn(
            `${req.method} ${req.url} FAIL ${Date.now() - start}ms · ${(err as Error).message}`,
          ),
      }),
    );
  }
}
