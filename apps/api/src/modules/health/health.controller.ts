import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, MemoryHealthIndicator } from '@nestjs/terminus';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { Public } from '@/common/decorators/public.decorator';
import { AppConfigService } from '@/config/app-config.service';

@ApiTags('health')
@Controller()
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly memory: MemoryHealthIndicator,
    private readonly config: AppConfigService,
  ) {}

  @Public()
  @Get('health')
  @ApiOperation({ summary: 'Healthcheck completo · liveness + readiness' })
  @HealthCheck()
  async check() {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 350 * 1024 * 1024),
      () => this.memory.checkRSS('memory_rss', 800 * 1024 * 1024),
      async () => ({
        config: {
          status: 'up',
          fakeData: this.config.fakeData,
          environment: this.config.nodeEnv,
        },
      }),
    ]);
  }

  @Public()
  @Get('healthz')
  @ApiOperation({ summary: 'Liveness probe simples (200 OK se vivo)' })
  liveness() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
