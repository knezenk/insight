import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { useToast } from '@/components/common/Toast';
import { reportsService } from '@/services/reports.service';
import { REPORT_LABELS, type ReportType } from '@insight/shared';
import { usePeriod } from '@/hooks/use-period';
import { useWorkspaceStore } from '@/stores/workspace.store';

export default function ReportsPage(): JSX.Element {
  const workspace = useWorkspaceStore((s) => s.current);
  const { from, to } = usePeriod();
  const { toast } = useToast();
  const [busy, setBusy] = useState<ReportType | null>(null);

  async function generate(type: ReportType): Promise<void> {
    setBusy(type);
    try {
      await reportsService.enqueue({ type, workspace, from, to });
      toast(`Relatório "${REPORT_LABELS[type]}" enfileirado`, 'success');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Falha ao gerar relatório', 'error');
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <header>
        <span className="text-[10px] uppercase tracking-widest text-muted">Relatórios</span>
        <h1 className="font-display text-3xl font-semibold">Geração de PDFs</h1>
      </header>

      <div className="grid grid-cols-3 gap-3">
        {(Object.keys(REPORT_LABELS) as ReportType[]).map((t) => (
          <Card key={t}>
            <CardHeader>
              <CardTitle>{REPORT_LABELS[t]}</CardTitle>
              <CardDescription>Padrão profissional · gerado via Puppeteer</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => generate(t)} disabled={busy === t} className="w-full">
                {busy === t ? 'Gerando…' : 'Gerar agora'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
