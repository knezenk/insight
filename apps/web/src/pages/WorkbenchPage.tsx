import { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { useDebounce } from '@insight/ui';
import { useClipping } from '@/hooks/use-clipping';
import { usePeriod } from '@/hooks/use-period';
import { useWorkspaceStore } from '@/stores/workspace.store';

export default function WorkbenchPage(): JSX.Element {
  const workspace = useWorkspaceStore((s) => s.current);
  const { from, to } = usePeriod();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debounced = useDebounce(search, 300);

  const query = useClipping({ workspace, from, to, searchQuery: debounced, page, pageSize: 25 });

  return (
    <div className="flex flex-col gap-5">
      <header className="flex items-end justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-muted">Notícias</span>
          <h1 className="font-display text-3xl font-semibold">Workbench</h1>
        </div>
        <Input
          placeholder="Buscar matérias…"
          className="w-72"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
      </header>

      <Card>
        <CardHeader>
          <CardTitle>{query.data?.total ?? '—'} matérias no período</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <table className="w-full text-sm">
            <thead className="border-y border-line bg-bg/40">
              <tr className="text-left text-[10px] uppercase tracking-wider text-muted">
                <th className="px-5 py-2">Data</th>
                <th className="px-5 py-2">Veículo</th>
                <th className="px-5 py-2">Título</th>
                <th className="px-5 py-2">Sentimento</th>
                <th className="px-5 py-2 text-right">IVN</th>
              </tr>
            </thead>
            <tbody>
              {query.isPending &&
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b border-line/60">
                    <td colSpan={5} className="px-5 py-3">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  </tr>
                ))}
              {query.data?.items.map((item) => (
                <tr key={item.id} className="cursor-pointer border-b border-line/60 hover:bg-line/30">
                  <td className="px-5 py-3 text-xs text-muted">
                    {new Date(item.publishedAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-5 py-3 font-medium">{item.source}</td>
                  <td className="px-5 py-3">{item.title}</td>
                  <td className="px-5 py-3">
                    <Badge tone={item.sentimentScore > 0 ? 'success' : 'danger'}>{item.sentimentLabel}</Badge>
                  </td>
                  <td className="px-5 py-3 text-right font-display text-base">
                    {item.ivn > 0 ? `+${item.ivn}` : item.ivn}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
