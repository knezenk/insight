import axios, { type AxiosError, type AxiosInstance } from 'axios';

import { useAuthStore } from '@/stores/auth.store';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const http: AxiosInstance = axios.create({
  baseURL,
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json' },
});

// Request: injeta Bearer token
http.interceptors.request.use((cfg) => {
  const token = useAuthStore.getState().accessToken;
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// Response: faz refresh em 401
let isRefreshing = false;
let pendingQueue: Array<(t: string | null) => void> = [];

http.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as (typeof error.config & { _retry?: boolean }) | undefined;
    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true;
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push((token) => {
            if (!token) return reject(error);
            original.headers!.Authorization = `Bearer ${token}`;
            resolve(http(original));
          });
        });
      }
      isRefreshing = true;
      try {
        const newToken = await useAuthStore.getState().refresh();
        pendingQueue.forEach((cb) => cb(newToken));
        pendingQueue = [];
        if (!newToken) throw error;
        original.headers!.Authorization = `Bearer ${newToken}`;
        return http(original);
      } catch (err) {
        pendingQueue.forEach((cb) => cb(null));
        pendingQueue = [];
        useAuthStore.getState().logout();
        throw err;
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  },
);

/** Extrai data do envelope ApiResponse<T>. */
export function unwrap<T>(payload: { data: T }): T {
  return payload.data;
}
