import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { useInfluencers } from '@/hooks/use-influencers';
import { useWorkspaceStore } from '@/stores/workspace.store';

export default function InfluencersPage(): JSX.Element {
  const workspace = useWorkspaceStore((s) => s.current);
  const { data, isPending } = useInfluencers(workspace);

  return (
    <div className="flex flex-col gap-5">
      <header>
        <span className="text-[10px] uppercase tracking-widest text-muted">Influenciadores</span>
        <h1 className="font-display text-3xl font-semibold">Quem move a narrativa</h1>
      </header>

      <div className="grid grid-cols-2 gap-3">
        {isPending && Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
        {data?.map((p) => (
          <Card key={p.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle>{p.name}</CardTitle>
                  <p className="mt-1 text-xs text-muted">
                    {p.outlet} · influência {p.influence}
                  </p>
                </div>
                <Badge tone={p.posture === 'HOSTIL' ? 'danger' : p.posture === 'CRITICO' ? 'warning' : 'success'}>
                  {p.posture}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="text-xs text-muted">
              {p.mentionsCount} menções · IVN médio {p.averageIvn} · ação recomendada:{' '}
              <b className="text-ink">{p.recommendedAction}</b>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
