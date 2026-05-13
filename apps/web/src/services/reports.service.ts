import type { ReportJobDto, ReportRequestDto } from '@insight/shared';
import { http, unwrap } from '@/lib/http';

export const reportsService = {
  enqueue: (req: ReportRequestDto) =>
    http.post<{ data: ReportJobDto }>('/reports', req).then((r) => unwrap(r.data)),
  status: (id: string) =>
    http.get<{ data: ReportJobDto }>(`/reports/${id}`).then((r) => unwrap(r.data)),
};
