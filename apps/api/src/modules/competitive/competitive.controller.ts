import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { CompetitiveDto } from '@insight/shared';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { WorkspaceGuard } from '@/common/guards/workspace.guard';
import { ScoresQueryDto } from '@/modules/scores/dto/scores-query.dto';
import { CompetitiveService } from './competitive.service';

@ApiTags('competitive')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, WorkspaceGuard)
@Controller({ path: 'competitive', version: '1' })
export class CompetitiveController {
  constructor(private readonly service: CompetitiveService) {}

  @Get()
  @ApiOperation({ summary: 'Análise competitiva · SoV, IVN e narrativa por concorrente' })
  get(@Query() q: ScoresQueryDto): Promise<CompetitiveDto> {
    return this.service.get(q.workspace, q.from, q.to);
  }
}
