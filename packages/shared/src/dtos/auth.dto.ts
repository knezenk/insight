import type { Role } from '../types/role';

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: AuthUserDto;
}

export interface AuthUserDto {
  id: string;
  email: string;
  name: string;
  role: Role;
  workspaces: string[];
}

export interface RefreshTokenRequestDto {
  refreshToken: string;
}
