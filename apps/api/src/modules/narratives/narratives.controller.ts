import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { NarrativeDto } from '@insight/shared';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { WorkspaceGuard } from '@/common/guards/workspace.guard';
import { ScoresQueryDto } from '@/modules/scores/dto/scores-query.dto';
import { NarrativesService } from './narratives.service';

@ApiTags('narratives')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, WorkspaceGuard)
@Controller({ path: 'narratives', version: '1' })
export class NarrativesController {
  constructor(private readonly service: NarrativesService) {}

  @Get()
  @ApiOperation({ summary: 'Narrativas dominantes do período · ordenadas por volume' })
  list(@Query() q: ScoresQueryDto): Promise<NarrativeDto[]> {
    return this.service.list(q.workspace, q.from, q.to);
  }
}
