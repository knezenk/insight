import { Inject, Injectable } from '@nestjs/common';
import type { AlertDto } from '@insight/shared';
import { ALERTS_PROVIDER } from '@/adapters/providers/tokens';
import { AlertsMockProvider } from '@/adapters/providers/alerts/alerts-mock.provider';
import { CacheService } from '@/infrastructure/cache/cache.service';
import { AppConfigService } from '@/config/app-config.service';

@Injectable()
export class AlertsService {
  constructor(
    @Inject(ALERTS_PROVIDER) private readonly provider: AlertsMockProvider,
    private readonly cache: CacheService,
    private readonly config: AppConfigService,
  ) {}

  list(workspace: string): Promise<AlertDto[]> {
    return this.cache.wrap(`alerts:${workspace}`, this.config.redisTtlDefault, () =>
      this.provider.list(workspace),
    );
  }
}
