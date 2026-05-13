import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { AuthUserDto, LoginResponseDto } from '@insight/shared';

import { authService } from '@/services/auth.service';

interface AuthState {
  user: AuthUserDto | null;
  accessToken: string | null;
  refreshToken: string | null;

  login(email: string, password: string): Promise<void>;
  refresh(): Promise<string | null>;
  logout(): void;
  setSession(s: LoginResponseDto): void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,

      async login(email, password) {
        const session = await authService.login({ email, password });
        get().setSession(session);
      },

      async refresh() {
        const rt = get().refreshToken;
        if (!rt) return null;
        try {
          const session = await authService.refresh({ refreshToken: rt });
          get().setSession(session);
          return session.accessToken;
        } catch {
          return null;
        }
      },

      logout() {
        set({ user: null, accessToken: null, refreshToken: null });
      },

      setSession(s) {
        set({ user: s.user, accessToken: s.accessToken, refreshToken: s.refreshToken });
      },
    }),
    { name: 'insight.auth' },
  ),
);
