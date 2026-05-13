import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import compression from 'compression';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { AppConfigService } from './config/app-config.service';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));

  const config = app.get(AppConfigService);

  // ─── Security ────────────────────────────────────────────────────
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    }),
  );
  app.use(compression());

  // ─── Global pipes / filters / interceptors ──────────────────────
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
    new TimeoutInterceptor(),
  );

  // ─── API versioning + prefix ────────────────────────────────────
  app.setGlobalPrefix('api', { exclude: ['health', 'healthz', 'metrics'] });
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  // ─── CORS ────────────────────────────────────────────────────────
  app.enableCors({
    origin: config.corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Tenant-Id', 'X-Request-Id'],
    exposedHeaders: ['X-Request-Id', 'X-Cache-Hit'],
  });

  // ─── Swagger ─────────────────────────────────────────────────────
  if (config.nodeEnv !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Insight API')
      .setDescription('BFF · API Gateway · agregação de dados de inteligência midiática')
      .setVersion('1.0.0')
      .addBearerAuth()
      .addTag('auth', 'Autenticação e gestão de tokens')
      .addTag('clipping', 'Listagem e busca de matérias')
      .addTag('scores', 'IVN, Índice 360, Risco, Impacto Financeiro')
      .addTag('alerts', 'Alertas estratégicos e regras')
      .addTag('narratives', 'Narrativas dominantes')
      .addTag('influencers', 'Mapa de influenciadores')
      .addTag('competitive', 'Análise competitiva')
      .addTag('reports', 'Geração de relatórios PDF')
      .addTag('health', 'Healthchecks e métricas')
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });
  }

  // ─── Graceful shutdown ─────────────────────────────────────────
  app.enableShutdownHooks();

  await app.listen(config.port, config.host);
  // eslint-disable-next-line no-console
  console.log(`▶ Insight API · http://${config.host}:${config.port}/api/v1`);
  // eslint-disable-next-line no-console
  console.log(`▶ Swagger    · http://${config.host}:${config.port}/api/docs`);
  // eslint-disable-next-line no-console
  console.log(`▶ FAKE_DATA  · ${config.fakeData ? '1 (mocks)' : '0 (live APIs)'}`);
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('Bootstrap failed', err);
  process.exit(1);
});
