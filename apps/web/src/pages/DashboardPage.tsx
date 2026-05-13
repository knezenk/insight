import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Indice360Gauge, IvnChart } from '@/components/charts';
import { useIvn, useIndice360, useReputationalRisk, useFinancialImpact } from '@/hooks/use-scores';
import { useAlerts } from '@/hooks/use-alerts';
import { usePeriod } from '@/hooks/use-period';
import { useWorkspaceStore } from '@/stores/workspace.store';
import { Badge } from '@/components/ui/Badge';
import { ErrorState } from '@/components/common/ErrorState';

export default function DashboardPage(): JSX.Element {
  const workspace = useWorkspaceStore((s) => s.current);
  const { from, to } = usePeriod();
  const q = { workspace, from, to };

  const ivn = useIvn(q);
  const i360 = useIndice360(q);
  const risk = useReputationalRisk(q);
  const fin = useFinancialImpact(q);
  const alerts = useAlerts(workspace);

  if (ivn.isError || i360.isError) return <ErrorState />;

  return (
    <div className="flex flex-col gap-5">
      <header>
        <span className="text-[10px] uppercase tracking-widest text-muted">Visão geral</span>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Dashboard</h1>
      </header>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardDescription>IVN do período</CardDescription>
            <CardTitle className="text-3xl font-display">
              {ivn.isPending ? <Skeleton className="h-8 w-20" /> : ivn.data?.ivn.toFixed(1)}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted">
            {ivn.data && `vs ${ivn.data.ivnPrev.toFixed(1)} no período anterior`}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Score de Risco</CardDescription>
            <CardTitle className="text-3xl font-display">
              {risk.isPending ? <Skeleton className="h-8 w-20" /> : `${risk.data?.score}/100`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {risk.data && (
              <Badge tone={risk.data.score > 60 ? 'danger' : risk.data.score > 40 ? 'warning' : 'success'}>
                {risk.data.level}
              </Badge>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Impacto financeiro</CardDescription>
            <CardTitle className="text-3xl font-display">
              {fin.isPending ? <Skeleton className="h-8 w-20" /> : `${fin.data?.score}/100`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {fin.data && (
              <Badge tone={fin.data.score > 75 ? 'danger' : fin.data.score > 50 ? 'warning' : 'info'}>
                {fin.data.level}
              </Badge>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Alertas ativos</CardDescription>
            <CardTitle className="text-3xl font-display">
              {alerts.isPending ? <Skeleton className="h-8 w-12" /> : alerts.data?.length ?? 0}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted">
            {alerts.data?.filter((a) => a.severity === 'CRITICO').length ?? 0} críticos
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Evolução do IVN</CardTitle>
            <CardDescription>Série temporal · IVN ponderado por segmento</CardDescription>
          </CardHeader>
          <CardContent>
            {ivn.isPending ? (
              <Skeleton className="h-60 w-full" />
            ) : (
              <IvnChart
                data={[
                  { date: 'sem 1', ivn: -0.8 },
                  { date: 'sem 2', ivn: -1.2 },
                  { date: 'sem 3', ivn: -1.4 },
                  { date: 'sem 4', ivn: ivn.data?.ivn ?? 0 },
                ]}
              />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Índice 360</CardTitle>
            <CardDescription>Score consolidado proprietário</CardDescription>
          </CardHeader>
          <CardContent>
            {i360.isPending ? (
              <Skeleton className="h-44 w-full" />
            ) : (
              <Indice360Gauge score={i360.data?.score ?? 0} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
