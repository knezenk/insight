import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import type {
  Indice360Dto,
  IvnScoreDto,
  FinancialImpactDto,
  ReputationalRiskDto,
} from '@insight/shared';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { WorkspaceGuard } from '@/common/guards/workspace.guard';
import { ScoresQueryDto } from './dto/scores-query.dto';
import { ScoresService } from './scores.service';

@ApiTags('scores')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, WorkspaceGuard)
@Controller({ path: 'scores', version: '1' })
export class ScoresController {
  constructor(private readonly service: ScoresService) {}

  @Get('ivn')
  @ApiOperation({ summary: 'Índice de Valor da Notícia (IVN) do período' })
  ivn(@Query() q: ScoresQueryDto): Promise<IvnScoreDto> {
    return this.service.ivn(q);
  }

  @Get('indice360')
  @ApiOperation({ summary: 'Índice 360 · score consolidado proprietário (0-100)' })
  indice360(@Query() q: ScoresQueryDto): Promise<Indice360Dto> {
    return this.service.indice360(q);
  }

  @Get('risk')
  @ApiOperation({ summary: 'Score de Risco Reputacional (0-100)' })
  risk(@Query() q: ScoresQueryDto): Promise<ReputationalRiskDto> {
    return this.service.reputationalRisk(q);
  }

  @Get('financial')
  @ApiOperation({ summary: 'Score de Impacto Financeiro (0-100)' })
  financial(@Query() q: ScoresQueryDto): Promise<FinancialImpactDto> {
    return this.service.financialImpact(q);
  }
}
