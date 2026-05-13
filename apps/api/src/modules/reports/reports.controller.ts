import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { ReportJobDto, ReportRequestDto } from '@insight/shared';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { WorkspaceGuard } from '@/common/guards/workspace.guard';
import { ReportRequestBodyDto } from './dto/report-request.dto';
import { ReportsService } from './reports.service';

@ApiTags('reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, WorkspaceGuard)
@Controller({ path: 'reports', version: '1' })
export class ReportsController {
  constructor(private readonly service: ReportsService) {}

  @Post()
  @ApiOperation({ summary: 'Enfileira a geração de um relatório PDF · retorna jobId' })
  @ApiBody({ type: ReportRequestBodyDto })
  enqueue(@Body() body: ReportRequestDto): Promise<ReportJobDto> {
    return this.service.enqueue(body);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Status do job de geração de relatório' })
  status(@Param('id') id: string): Promise<ReportJobDto | null> {
    return this.service.status(id);
  }
}
