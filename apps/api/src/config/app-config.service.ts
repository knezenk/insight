import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Tipagem forte sobre process.env. Valida na inicialização.
 * Toda configuração lida do ambiente passa por aqui — proibido usar
 * process.env diretamente nos módulos.
 */
@Injectable()
export class AppConfigService {
  constructor(private readonly raw: ConfigService) {}

  // ─── Núcleo ─────────────────────────────────────────────────────
  get nodeEnv(): 'development' | 'production' | 'test' {
    return (this.raw.get<string>('NODE_ENV') ?? 'development') as
      | 'development'
      | 'production'
      | 'test';
  }
  get port(): number {
    return Number(this.raw.get('API_PORT') ?? 3001);
  }
  get host(): string {
    return this.raw.get<string>('API_HOST') ?? '0.0.0.0';
  }
  get apiPrefix(): string {
    return this.raw.get<string>('API_PREFIX') ?? '/api/v1';
  }
  get corsOrigins(): string[] | true {
    const raw = this.raw.get<string>('API_CORS_ORIGINS') ?? '*';
    return raw === '*' ? true : raw.split(',').map((s) => s.trim());
  }

  // ─── Modo dados ─────────────────────────────────────────────────
  get fakeData(): boolean {
    return this.raw.get<string>('FAKE_DATA') !== '0';
  }

  // ─── Logging ────────────────────────────────────────────────────
  get logLevel(): string {
    return this.raw.get<string>('LOG_LEVEL') ?? 'info';
  }
  get logPretty(): boolean {
    return this.raw.get<string>('LOG_PRETTY') === 'true' && this.nodeEnv !== 'production';
  }

  // ─── JWT ────────────────────────────────────────────────────────
  get jwtSecret(): string {
    const s = this.raw.get<string>('JWT_SECRET');
    if (!s || s.length < 16) throw new Error('JWT_SECRET ausente ou muito curto');
    return s;
  }
  get jwtAccessExpiresIn(): string {
    return this.raw.get<string>('JWT_ACCESS_EXPIRES_IN') ?? '15m';
  }
  get jwtRefreshExpiresIn(): string {
    return this.raw.get<string>('JWT_REFRESH_EXPIRES_IN') ?? '7d';
  }
  get jwtIssuer(): string {
    return this.raw.get<string>('JWT_ISSUER') ?? 'insight-api';
  }
  get jwtAudience(): string {
    return this.raw.get<string>('JWT_AUDIENCE') ?? 'insight-web';
  }

  // ─── Redis / Cache ──────────────────────────────────────────────
  get redisUrl(): string {
    return this.raw.get<string>('REDIS_URL') ?? 'redis://localhost:6379';
  }
  get redisTtlDefault(): number {
    return Number(this.raw.get('REDIS_TTL_DEFAULT') ?? 60);
  }
  get redisTtlScores(): number {
    return Number(this.raw.get('REDIS_TTL_SCORES') ?? 300);
  }
  get redisTtlDictionary(): number {
    return Number(this.raw.get('REDIS_TTL_DICTIONARY') ?? 3600);
  }

  // ─── Rate limit ─────────────────────────────────────────────────
  get rateLimitTtl(): number {
    return Number(this.raw.get('RATE_LIMIT_TTL') ?? 60);
  }
  get rateLimitMax(): number {
    return Number(this.raw.get('RATE_LIMIT_MAX') ?? 100);
  }
  get rateLimitAuthMax(): number {
    return Number(this.raw.get('RATE_LIMIT_AUTH_MAX') ?? 10);
  }

  // ─── External APIs ─────────────────────────────────────────────
  get clippingApi(): ExternalApiConfig {
    return {
      baseUrl: this.raw.get<string>('CLIPPING_API_BASE_URL') ?? '',
      token: this.raw.get<string>('CLIPPING_API_TOKEN') ?? '',
      timeoutMs: Number(this.raw.get('CLIPPING_API_TIMEOUT_MS') ?? 10_000),
    };
  }
  get nlpApi(): ExternalApiConfig {
    return {
      baseUrl: this.raw.get<string>('NLP_API_BASE_URL') ?? '',
      token: this.raw.get<string>('NLP_API_TOKEN') ?? '',
      timeoutMs: Number(this.raw.get('NLP_API_TIMEOUT_MS') ?? 15_000),
    };
  }
  get socialApi(): ExternalApiConfig {
    return {
      baseUrl: this.raw.get<string>('SOCIAL_API_BASE_URL') ?? '',
      token: this.raw.get<string>('SOCIAL_API_TOKEN') ?? '',
      timeoutMs: Number(this.raw.get('SOCIAL_API_TIMEOUT_MS') ?? 8_000),
    };
  }
  get pdfServiceUrl(): string {
    return this.raw.get<string>('PDF_SERVICE_URL') ?? '';
  }
}

export interface ExternalApiConfig {
  baseUrl: string;
  token: string;
  timeoutMs: number;
}
