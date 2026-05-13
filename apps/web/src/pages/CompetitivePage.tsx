import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { ShareOfVoiceBars } from '@/components/charts';
import { useCompetitive } from '@/hooks/use-competitive';
import { usePeriod } from '@/hooks/use-period';
import { useWorkspaceStore } from '@/stores/workspace.store';

export default function CompetitivePage(): JSX.Element {
  const workspace = useWorkspaceStore((s) => s.current);
  const { from, to } = usePeriod();
  const { data, isPending } = useCompetitive(workspace, from, to);

  return (
    <div className="flex flex-col gap-5">
      <header>
        <span className="text-[10px] uppercase tracking-widest text-muted">Competitivo</span>
        <h1 className="font-display text-3xl font-semibold">Share of Voice</h1>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Concorrentes do setor</CardTitle>
          <CardDescription>Volume relativo de matérias no período</CardDescription>
        </CardHeader>
        <CardContent>
          {isPending ? <Skeleton className="h-72" /> : data && <ShareOfVoiceBars data={data} />}
        </CardContent>
      </Card>
    </div>
  );
}
