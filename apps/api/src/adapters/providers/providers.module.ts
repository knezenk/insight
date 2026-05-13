import { Global, Module } from '@nestjs/common';

import { CLIPPING_PROVIDER } from './tokens';
import { AppConfigService } from '@/config/app-config.service';
import { ClippingMockProvider } from './clipping/clipping-mock.provider';
import { ClippingHttpProvider } from './clipping/clipping-http.provider';
import type { ClippingProvider } from './clipping/clipping.provider.interface';

import { SCORES_PROVIDER } from './tokens';
import { ScoresMockProvider } from './scores/scores-mock.provider';
import { ScoresHttpProvider } from './scores/scores-http.provider';
import type { ScoresProvider } from './scores/scores.provider.interface';

import { NARRATIVES_PROVIDER, INFLUENCERS_PROVIDER, COMPETITIVE_PROVIDER, ALERTS_PROVIDER } from './tokens';
import { NarrativesMockProvider } from './narratives/narratives-mock.provider';
import { InfluencersMockProvider } from './influencers/influencers-mock.provider';
import { CompetitiveMockProvider } from './competitive/competitive-mock.provider';
import { AlertsMockProvider } from './alerts/alerts-mock.provider';

/**
 * Resolve qual implementação injetar em cada token,
 * baseado em FAKE_DATA. Sem if's de runtime nos consumidores.
 *
 * Adicionando um novo provider:
 *  1. crie ProviderInterface
 *  2. crie *MockProvider e *HttpProvider implementando a interface
 *  3. adicione factory abaixo
 */
@Global()
@Module({
  providers: [
    {
      provide: CLIPPING_PROVIDER,
      inject: [AppConfigService, ClippingMockProvider, ClippingHttpProvider],
      useFactory: (
        config: AppConfigService,
        mock: ClippingMockProvider,
        http: ClippingHttpProvider,
      ): ClippingProvider => (config.fakeData ? mock : http),
    },
    {
      provide: SCORES_PROVIDER,
      inject: [AppConfigService, ScoresMockProvider, ScoresHttpProvider],
      useFactory: (
        config: AppConfigService,
        mock: ScoresMockProvider,
        http: ScoresHttpProvider,
      ): ScoresProvider => (config.fakeData ? mock : http),
    },
    { provide: NARRATIVES_PROVIDER, useExisting: NarrativesMockProvider },
    { provide: INFLUENCERS_PROVIDER, useExisting: InfluencersMockProvider },
    { provide: COMPETITIVE_PROVIDER, useExisting: CompetitiveMockProvider },
    { provide: ALERTS_PROVIDER, useExisting: AlertsMockProvider },
    ClippingMockProvider,
    ClippingHttpProvider,
    ScoresMockProvider,
    ScoresHttpProvider,
    NarrativesMockProvider,
    InfluencersMockProvider,
    CompetitiveMockProvider,
    AlertsMockProvider,
  ],
  exports: [
    CLIPPING_PROVIDER,
    SCORES_PROVIDER,
    NARRATIVES_PROVIDER,
    INFLUENCERS_PROVIDER,
    COMPETITIVE_PROVIDER,
    ALERTS_PROVIDER,
  ],
})
export class ProvidersModule {}
