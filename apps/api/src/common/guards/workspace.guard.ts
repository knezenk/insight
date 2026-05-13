import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import type { Request } from 'express';
import type { AuthUserDto } from '@insight/shared';

/**
 * Garante que o user só consulta dados do workspace ao qual pertence.
 * Endpoints com :workspace na URL ou query param `workspace`.
 */
@Injectable()
export class WorkspaceGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request & { user?: AuthUserDto }>();
    const requested =
      (req.params.workspace as string | undefined) ??
      (req.query.workspace as string | undefined);
    if (!requested) return true;
    const user = req.user;
    if (!user) throw new ForbiddenException('Usuário não autenticado');
    if (user.role === 'super_admin') return true;
    if (!user.workspaces.includes(requested)) {
      throw new ForbiddenException(`Acesso negado ao workspace ${requested}`);
    }
    return true;
  }
}
