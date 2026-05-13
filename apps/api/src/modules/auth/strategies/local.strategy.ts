import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import type { AuthUserDto } from '@insight/shared';

import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly auth: AuthService) {
    super({ usernameField: 'email', passwordField: 'password' });
  }
  validate(email: string, password: string): Promise<AuthUserDto> {
    return this.auth.validateCredentials(email, password);
  }
}
