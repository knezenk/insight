import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import type { ReportJobDto, ReportRequestDto } from '@insight/shared';

/**
 * Em produção: dispara job no PDF service (Puppeteer) via fila.
 * Por ora, em modo mock, retorna job "ready" simulado.
 */
@Injectable()
export class ReportsService {
  private readonly jobs = new Map<string, ReportJobDto>();

  async enqueue(req: ReportRequestDto): Promise<ReportJobDto> {
    const id = uuid();
    const now = new Date().toISOString();
    const job: ReportJobDto = {
      id,
      type: req.type,
      workspace: req.workspace,
      status: 'queued',
      progress: 0,
      createdAt: now,
    };
    this.jobs.set(id, job);
    setTimeout(() => {
      this.jobs.set(id, {
        ...job,
        status: 'ready',
        progress: 100,
        completedAt: new Date().toISOString(),
        pdfUrl: `/api/v1/reports/${id}/download`,
        expiresAt: new Date(Date.now() + 7 * 86_400_000).toISOString(),
      });
    }, 1500);
    return job;
  }

  async status(id: string): Promise<ReportJobDto | null> {
    return this.jobs.get(id) ?? null;
  }
}
