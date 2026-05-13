import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAlerts } from '@/hooks/use-alerts';
import { useWorkspaceStore } from '@/stores/workspace.store';

export default function AlertsPage(): JSX.Element {
  const workspace = useWorkspaceStore((s) => s.current);
  const { data, isPending } = useAlerts(workspace);

  return (
    <div className="flex flex-col gap-5">
      <header>
        <span className="text-[10px] uppercase tracking-widest text-muted">Alertas</span>
        <h1 className="font-display text-3xl font-semibold">Radar de risco</h1>
      </header>

      <div className="grid gap-3">
        {isPending && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
        {data?.map((alert) => (
          <Card key={alert.id}>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{alert.title}</CardTitle>
                <Badge tone={alert.severity === 'CRITICO' ? 'danger' : alert.severity === 'ALTO' ? 'warning' : 'info'}>
                  {alert.severity}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted">
              {alert.description}
              <p className="mt-2 text-xs">Janela: {alert.responseWindow}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
