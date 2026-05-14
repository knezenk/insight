import { Indice360Gauge, IvnChart } from '@/components/charts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { ErrorState } from '@/components/common/ErrorState';
import { useAlerts } from '@/hooks/use-alerts';
import { useNarratives } from '@/hooks/use-narratives';
import { usePeriod } from '@/hooks/use-period';
import {
  useFinancialImpact,
  useIndice360,
  useIvn,
  useReputationalRisk,
} from '@/hooks/use-scores';
import { useWorkspaceStore } from '@/stores/workspace.store';

const WORKSPACE_LABELS: Record<string, string> = {
  mjsp: 'Ministério da Justiça e Segurança Pública',
  btg: 'BTG Pactual',
  petrobras: 'Petrobras',
  agu: 'AGU',
  defesa: 'Ministério da Defesa',
  ebserh: 'EBSERH',
  'tce-ce': 'Tribunal de Contas · Ceará',
};

export default function DashboardPage(): JSX.Element {
  const workspace = useWorkspaceStore((s) => s.current);
  const { from, to } = usePeriod();
  const q = { workspace, from, to };

  const ivn = useIvn(q);
  const i360 = useIndice360(q);
  const risk = useReputationalRisk(q);
  const fin = useFinancialImpact(q);
  const alerts = useAlerts(workspace);
  const narratives = useNarratives(workspace, from, to);

  if (ivn.isError || i360.isError) return <ErrorState />;

  const clientName = WORKSPACE_LABELS[workspace] ?? workspace.toUpperCase();

  return (
    <div className="flex flex-col gap-5">
      {/* ─────────── PAGE HEAD ─────────── */}
      <header className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="eyebrow">Reputação 360</span>
            <Badge tone={ivn.data && ivn.data.ivn < 0 ? 'danger' : 'success'}>
              {ivn.data && ivn.data.ivn < -2
                ? 'Clima adverso'
                : ivn.data && ivn.data.ivn < 0
                  ? 'Atenção'
                  : 'Cenário estável'}
            </Badge>
          </div>
          <h1 className="font-display text-3xl lg:text-4xl font-semibold tracking-tight">
            {clientName}
          </h1>
          <p className="text-sm text-muted mt-1.5 max-w-2xl">
            Período analisado · {ivn.data ? `${ivn.data.total ?? '—'} matérias monitoradas em ` : ''}
            {ivn.data?.veiculos ?? '—'} veículos · acompanhamento em tempo real pela base Solr.
          </p>
        </div>
        <button
          className="px-4 py-2.5 rounded-lg text-white font-semibold text-sm whitespace-nowrap"
          style={{ background: 'rgb(var(--accent))' }}
        >
          Gerar relatório PDF
        </button>
      </header>

      {/* ─────────── HERO ÍNDICE 360 ─────────── */}
      <div
        className="rounded-xl border overflow-hidden relative"
        style={{
          background: 'linear-gradient(135deg, #FFFFFF 0%, rgb(var(--accent-soft)) 100%)',
          borderColor: 'rgb(var(--accent-soft))',
        }}
      >
        <div
          className="absolute left-0 top-0 bottom-0 w-1"
          style={{
            background: 'linear-gradient(180deg, rgb(var(--accent)), rgb(var(--accent-2)))',
          }}
        />
        {/* Strip de período */}
        <div className="flex items-center justify-between px-6 pt-4 pb-0">
          <span className="eyebrow text-accent" style={{ color: 'rgb(var(--accent))' }}>
            Índice 360 · reputação midiática do período
          </span>
          <button
            type="button"
            title="O que é o Índice 360"
            className="w-6 h-6 rounded-full border-2 text-xs font-bold leading-none flex items-center justify-center hover:bg-accent hover:text-white transition-colors"
            style={{ borderColor: 'rgb(var(--accent))', color: 'rgb(var(--accent))' }}
          >
            ⓘ
          </button>
        </div>

        {/* Score + escala de bandas + variação */}
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-8 items-center px-7 py-6 border-b border-accent-soft">
          <div className="flex items-baseline gap-1.5 min-w-[120px]">
            {i360.isPending ? (
              <Skeleton className="h-20 w-24" />
            ) : (
              <>
                <span
                  className="font-display font-medium leading-none"
                  style={{ fontSize: '78px', letterSpacing: '-0.04em' }}
                >
                  {i360.data?.score ?? 0}
                </span>
                <span className="font-display text-2xl text-muted">/ 100</span>
              </>
            )}
          </div>

          {/* Escala de bandas */}
          <div className="relative">
            <div className="relative h-3.5 rounded-md overflow-hidden bg-bg-alt">
              <div
                className="absolute top-0 bottom-0"
                style={{ left: '0%', width: '30%', background: 'linear-gradient(90deg,#A02B1A,#C8351E)' }}
              />
              <div
                className="absolute top-0 bottom-0"
                style={{ left: '30%', width: '20%', background: 'linear-gradient(90deg,#A57619,#D49A1F)' }}
              />
              <div
                className="absolute top-0 bottom-0"
                style={{ left: '50%', width: '20%', background: 'linear-gradient(90deg,#C8861E,#E0A015)' }}
              />
              <div
                className="absolute top-0 bottom-0"
                style={{ left: '70%', width: '15%', background: 'linear-gradient(90deg,#2D7D5C,#3B9A6F)' }}
              />
              <div
                className="absolute top-0 bottom-0"
                style={{ left: '85%', width: '15%', background: 'linear-gradient(90deg,#1A5F44,#0E8A60)' }}
              />
              {/* Marker */}
              <div
                className="absolute -top-1 -bottom-1 w-[3px] bg-ink rounded-sm"
                style={{
                  left: `${i360.data?.score ?? 63}%`,
                  transform: 'translateX(-50%)',
                  boxShadow: '0 0 0 3px rgba(255,255,255,.95), 0 2px 6px rgba(0,0,0,.18)',
                }}
              />
            </div>
            <div className="relative h-4 mt-2 text-[9.5px] uppercase tracking-wider font-bold text-muted">
              <span className="absolute" style={{ left: '15%', transform: 'translateX(-50%)' }}>
                crítico
              </span>
              <span className="absolute" style={{ left: '40%', transform: 'translateX(-50%)' }}>
                adverso
              </span>
              <span
                className="absolute text-ink"
                style={{ left: '60%', transform: 'translateX(-50%)' }}
              >
                aceitável
              </span>
              <span className="absolute" style={{ left: '77.5%', transform: 'translateX(-50%)' }}>
                bom
              </span>
              <span className="absolute" style={{ left: '92.5%', transform: 'translateX(-50%)' }}>
                excelente
              </span>
            </div>
          </div>

          {/* Trend */}
          <div className="flex flex-col items-end gap-0.5 text-right min-w-[120px]">
            <div className="flex items-baseline gap-1">
              <span className="font-display text-2xl font-medium text-pos">↑</span>
              <span className="font-display text-3xl font-medium text-pos leading-none">+3</span>
            </div>
            <span className="text-[10.5px] uppercase tracking-widest text-muted font-bold">
              vs período anterior
            </span>
          </div>
        </div>

        {/* 4 métricas inline */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-px"
          style={{ background: 'rgb(var(--accent-soft))' }}
        >
          {[
            { lbl: 'Favorabilidade', val: '42%' },
            { lbl: 'Alcance', val: '78,4M' },
            { lbl: 'VPE', val: 'R$ 142M' },
            { lbl: 'Veículos', val: '70' },
          ].map((m) => (
            <div
              key={m.lbl}
              className="py-3.5 px-4 text-center flex flex-col items-center gap-1 transition-colors hover:bg-white"
              style={{ background: 'rgba(255,255,255,0.65)' }}
            >
              <div className="font-display text-xl font-medium tracking-tight">{m.val}</div>
              <div className="text-[10px] uppercase tracking-widest text-muted font-bold">
                {m.lbl}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─────────── 4 KPIs PRINCIPAIS ─────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardDescription>IVN do período</CardDescription>
            <CardTitle className="text-3xl font-display flex items-center gap-2">
              {ivn.isPending ? <Skeleton className="h-8 w-20" /> : ivn.data?.ivn.toFixed(1)}
              {ivn.data && (
                <Badge tone={ivn.data.ivn < 0 ? 'danger' : 'success'}>
                  {ivn.data.ivn < -3
                    ? 'crítico'
                    : ivn.data.ivn < 0
                      ? 'adverso'
                      : ivn.data.ivn < 3
                        ? 'aceitável'
                        : 'bom'}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted flex items-center gap-1">
            {ivn.data &&
              `${ivn.data.variation > 0 ? '↑' : '↓'} ${Math.abs(ivn.data.variation).toFixed(1)} vs período anterior`}
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
              <Badge
                tone={
                  risk.data.score > 60 ? 'danger' : risk.data.score > 40 ? 'warning' : 'success'
                }
              >
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
            <CardTitle className="text-3xl font-display flex items-baseline gap-2">
              {alerts.isPending ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <span>{alerts.data?.length ?? 0}</span>
              )}
              {alerts.data && alerts.data.filter((a) => a.severity === 'CRITICO').length > 0 && (
                <Badge tone="danger">
                  {alerts.data.filter((a) => a.severity === 'CRITICO').length} crítico
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted">
            {alerts.data?.filter((a) => a.severity === 'ALTO').length ?? 0} alto ·{' '}
            {alerts.data?.filter((a) => a.severity === 'MONITORAR').length ?? 0} monitorar
          </CardContent>
        </Card>
      </div>

      {/* ─────────── EVOLUÇÃO + ÍNDICE 360 GAUGE ─────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Evolução do IVN</CardTitle>
            <CardDescription>
              Série temporal · IVN ponderado por segmento · escala −10 a +10
            </CardDescription>
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

      {/* ─────────── NARRATIVAS + ALERTAS ─────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Narrativas dominantes</CardTitle>
            <CardDescription>
              Clusters identificados pelo motor de NLP · ordenados por volume
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            {narratives.isPending ? (
              <div className="px-6">
                <Skeleton className="h-32 w-full" />
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="border-y border-line bg-bg-alt/60">
                  <tr className="text-left text-[10px] uppercase tracking-wider text-muted">
                    <th className="px-6 py-2">#</th>
                    <th className="px-2 py-2">Narrativa</th>
                    <th className="px-2 py-2 text-right">Volume</th>
                    <th className="px-2 py-2 text-right">IVN</th>
                    <th className="px-6 py-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {narratives.data?.slice(0, 6).map((n, i) => (
                    <tr key={n.id} className="border-b border-line/60 hover:bg-bg-alt/30">
                      <td className="px-6 py-3 text-muted tnum font-medium">
                        {String(i + 1).padStart(2, '0')}
                      </td>
                      <td className="px-2 py-3">
                        <div className="font-semibold leading-tight">{n.title}</div>
                        <div className="text-xs text-muted mt-0.5">
                          {n.topSources?.slice(0, 3).join(' · ')}
                        </div>
                      </td>
                      <td className="px-2 py-3 text-right tnum font-medium">{n.volume}</td>
                      <td
                        className="px-2 py-3 text-right tnum font-display text-lg"
                        style={{
                          color: n.ivn < 0 ? 'rgb(var(--neg))' : 'rgb(var(--pos))',
                        }}
                      >
                        {n.ivn > 0 ? `+${n.ivn}` : n.ivn}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <Badge
                          tone={
                            n.status === 'crise'
                              ? 'danger'
                              : n.status === 'alerta'
                                ? 'warning'
                                : 'info'
                          }
                        >
                          {n.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <div>
                <CardTitle>Alertas estratégicos</CardTitle>
                <CardDescription>Ações priorizadas por urgência</CardDescription>
              </div>
              <a
                href="/alerts"
                className="text-xs font-semibold cursor-pointer"
                style={{ color: 'rgb(var(--accent))' }}
              >
                ver todos →
              </a>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {alerts.isPending ? (
              <Skeleton className="h-32" />
            ) : (
              alerts.data?.slice(0, 4).map((a) => {
                const sevColor =
                  a.severity === 'CRITICO'
                    ? 'rgb(var(--neg))'
                    : a.severity === 'ALTO'
                      ? 'rgb(var(--warn))'
                      : 'rgb(var(--info))';
                const bg =
                  a.severity === 'CRITICO'
                    ? 'rgb(var(--neg-soft))'
                    : a.severity === 'ALTO'
                      ? 'rgb(var(--warn-soft))'
                      : 'rgb(var(--info-soft))';
                return (
                  <div
                    key={a.id}
                    className="rounded-md p-3 border-l-[3px]"
                    style={{ background: bg, borderLeftColor: sevColor }}
                  >
                    <div
                      className="text-[10px] uppercase tracking-widest font-bold mb-1"
                      style={{ color: sevColor }}
                    >
                      {a.severity} · {a.responseWindow}
                    </div>
                    <div className="font-semibold text-sm leading-tight">{a.title}</div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
