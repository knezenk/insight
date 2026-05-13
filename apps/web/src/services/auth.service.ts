import type { LoginRequestDto, LoginResponseDto, RefreshTokenRequestDto } from '@insight/shared';

import { http, unwrap } from '@/lib/http';

export const authService = {
  login: (body: LoginRequestDto) =>
    http.post<{ data: LoginResponseDto }>('/auth/login', body).then((r) => unwrap(r.data)),
  refresh: (body: RefreshTokenRequestDto) =>
    http.post<{ data: LoginResponseDto }>('/auth/refresh', body).then((r) => unwrap(r.data)),
  logout: () => http.post('/auth/logout'),
};
