import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import type { ClippingItemDto, Paginated } from '@insight/shared';

import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { WorkspaceGuard } from '@/common/guards/workspace.guard';
import { ClippingFilterQueryDto } from './dto/clipping-filter.dto';
import { ClippingService } from './clipping.service';

@ApiTags('clipping')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, WorkspaceGuard)
@Controller({ path: 'clipping', version: '1' })
export class ClippingController {
  constructor(private readonly service: ClippingService) {}

  @Get()
  @ApiOperation({ summary: 'Lista paginada de matérias do workspace · com filtros' })
  list(@Query() query: ClippingFilterQueryDto): Promise<Paginated<ClippingItemDto>> {
    return this.service.list(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detalhe de uma matéria por ID' })
  getById(
    @Param('id') id: string,
    @Query('workspace') workspace: string,
  ): Promise<ClippingItemDto | null> {
    return this.service.getById(workspace, id);
  }
}
