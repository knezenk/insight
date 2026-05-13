import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { useNarratives } from '@/hooks/use-narratives';
import { usePeriod } from '@/hooks/use-period';
import { useWorkspaceStore } from '@/stores/workspace.store';

export default function NarrativesPage(): JSX.Element {
  const workspace = useWorkspaceStore((s) => s.current);
  const { from, to } = usePeriod();
  const { data, isPending } = useNarratives(workspace, from, to);

  return (
    <div className="flex flex-col gap-5">
      <header>
        <span className="text-[10px] uppercase tracking-widest text-muted">Narrativas</span>
        <h1 className="font-display text-3xl font-semibold">Mapa de narrativas</h1>
      </header>

      <div className="grid gap-3">
        {isPending && Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20" />)}
        {data?.map((n) => (
          <Card key={n.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle>{n.title}</CardTitle>
                  <p className="mt-1 text-xs text-muted">
                    {n.volume} matérias · IVN {n.ivn} · principais fontes: {n.topSources.join(' · ')}
                  </p>
                </div>
                <Badge tone={n.status === 'crise' ? 'danger' : n.status === 'alerta' ? 'warning' : 'info'}>
                  {n.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent />
          </Card>
        ))}
      </div>
    </div>
  );
}
