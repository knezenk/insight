import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import type { AuthUserDto } from '@insight/shared';

import { AppConfigService } from '@/config/app-config.service';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: AppConfigService,
    private readonly users: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwtSecret,
      issuer: config.jwtIssuer,
      audience: config.jwtAudience,
    });
  }

  async validate(payload: { sub: string }): Promise<AuthUserDto> {
    const user = await this.users.findById(payload.sub);
    if (!user) throw new UnauthorizedException('Usuário não encontrado');
    return { id: user.id, email: user.email, name: user.name, role: user.role, workspaces: user.workspaces };
  }
}
