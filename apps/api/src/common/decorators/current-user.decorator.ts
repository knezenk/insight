import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import type { Request } from 'express';

import type { AuthUserDto } from '@insight/shared';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUserDto | undefined => {
    const req = ctx.switchToHttp().getRequest<Request & { user?: AuthUserDto }>();
    return req.user;
  },
);
