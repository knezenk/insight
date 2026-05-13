import { Test, type TestingModule } from '@nestjs/testing';

import type { Indice360Dto } from '@insight/shared';

import { CacheService } from '@/infrastructure/cache/cache.service';
import { AppConfigService } from '@/config/app-config.service';
import { SCORES_PROVIDER } from '@/adapters/providers/tokens';
import type { ScoresProvider } from '@/adapters/providers/scores/scores.provider.interface';

import { ScoresService } from './scores.service';

describe('ScoresService', () => {
  let service: ScoresService;
  let provider: jest.Mocked<ScoresProvider>;
  let cache: jest.Mocked<CacheService>;

  beforeEach(async () => {
    provider = {
      ivn: jest.fn(),
      indice360: jest.fn(),
      reputationalRisk: jest.fn(),
      financialImpact: jest.fn(),
    };
    cache = {
      wrap: jest.fn().mockImplementation(async (_k: string, _ttl: number, fn: () => unknown) => fn()),
    } as unknown as jest.Mocked<CacheService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScoresService,
        { provide: SCORES_PROVIDER, useValue: provider },
        { provide: CacheService, useValue: cache },
        {
          provide: AppConfigService,
          useValue: { redisTtlScores: 300 } as Partial<AppConfigService>,
        },
      ],
    }).compile();

    service = module.get(ScoresService);
  });

  it('delega ivn para o provider injetado e usa cache.wrap', async () => {
    const fakeIvn = {
      workspace: 'mjsp',
      period: { from: '2026-04-01T00:00:00Z', to: '2026-04-30T23:59:59Z' },
      ivn: -1.4,
      ivnPrev: -1.0,
      variation: -0.4,
      diagnosis: 'adverso',
    };
    provider.ivn.mockResolvedValue(fakeIvn);
    const result = await service.ivn({
      workspace: 'mjsp',
      from: '2026-04-01T00:00:00Z',
      to: '2026-04-30T23:59:59Z',
    });
    expect(result).toEqual(fakeIvn);
    expect(cache.wrap).toHaveBeenCalledTimes(1);
  });

  it('passa pela camada de cache antes de chamar provider de indice360', async () => {
    const fake: Indice360Dto = {
      workspace: 'mjsp',
      period: { from: '2026-04-01T00:00:00Z', to: '2026-04-30T23:59:59Z' },
      score: 63,
      band: 'aceitavel',
      components: {
        favorability: { value: 0.42, weight: 0.3, contribution: 12.6 },
        reach: { value: 0.89, weight: 0.2, contribution: 17.8 },
        vpe: { value: 0.82, weight: 0.15, contribution: 12.3 },
        premiumShare: { value: 0.26, weight: 0.15, contribution: 3.9 },
        diversity: { value: 0.7, weight: 0.1, contribution: 7.0 },
        velocity: { value: 0.94, weight: 0.1, contribution: 9.4 },
      },
    };
    provider.indice360.mockResolvedValue(fake);
    await service.indice360({
      workspace: 'mjsp',
      from: '2026-04-01T00:00:00Z',
      to: '2026-04-30T23:59:59Z',
    });
    expect(cache.wrap).toHaveBeenCalledWith(
      expect.stringMatching(/^scores:i360:[a-f0-9]+$/),
      300,
      expect.any(Function),
    );
  });
});
