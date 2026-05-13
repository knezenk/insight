import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { InfluencerDto } from '@insight/shared';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { WorkspaceGuard } from '@/common/guards/workspace.guard';
import { InfluencersService } from './influencers.service';

@ApiTags('influencers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, WorkspaceGuard)
@Controller({ path: 'influencers', version: '1' })
export class InfluencersController {
  constructor(private readonly service: InfluencersService) {}

  @Get()
  @ApiOperation({ summary: 'Mapa de influenciadores · jornalistas, colunistas, criadores' })
  list(@Query('workspace') workspace: string): Promise<InfluencerDto[]> {
    return this.service.list(workspace);
  }
}
