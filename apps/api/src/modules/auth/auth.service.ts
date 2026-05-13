import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import type { AuthUserDto, LoginResponseDto } from '@insight/shared';

import { AppConfigService } from '@/config/app-config.service';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UserRepository,
    private readonly jwt: JwtService,
    private readonly config: AppConfigService,
  ) {}

  async validateCredentials(email: string, password: string): Promise<AuthUserDto> {
    const user = await this.users.findByEmail(email);
    if (!user) throw new UnauthorizedException('Credenciais inválidas');
    const ok = await this.users.verifyPassword(user.id, password);
    if (!ok) throw new UnauthorizedException('Credenciais inválidas');
    return this.toDto(user);
  }

  async issueTokens(user: AuthUserDto): Promise<LoginResponseDto> {
    const payload = { sub: user.id, email: user.email, role: user.role, ws: user.workspaces };
    const accessToken = await this.jwt.signAsync(payload);
    const refreshToken = await this.jwt.signAsync(
      { ...payload, type: 'refresh' },
      { expiresIn: this.config.jwtRefreshExpiresIn },
    );
    return {
      accessToken,
      refreshToken,
      expiresIn: 15 * 60,
      user,
    };
  }

  async refresh(token: string): Promise<LoginResponseDto> {
    try {
      const payload = await this.jwt.verifyAsync(token);
      if (payload.type !== 'refresh') throw new UnauthorizedException();
      const user = await this.users.findById(payload.sub);
      if (!user) throw new UnauthorizedException();
      return this.issueTokens(this.toDto(user));
    } catch {
      throw new UnauthorizedException('Refresh token inválido ou expirado');
    }
  }

  private toDto(u: { id: string; email: string; name: string; role: AuthUserDto['role']; workspaces: string[] }): AuthUserDto {
    return { id: u.id, email: u.email, name: u.name, role: u.role, workspaces: u.workspaces };
  }
}
