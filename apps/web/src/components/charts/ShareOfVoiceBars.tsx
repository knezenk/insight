import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import type { CompetitiveDto } from '@insight/shared';

export function ShareOfVoiceBars({ data }: { data: CompetitiveDto }): JSX.Element {
  const enriched = data.competitors.map((c) => ({
    name: c.name,
    sov: c.sov,
    fill: c.isUs ? 'rgb(var(--accent))' : 'rgb(var(--muted))',
  }));
  return (
    <ResponsiveContainer width="100%" height={Math.max(240, enriched.length * 36)}>
      <BarChart data={enriched} layout="vertical" margin={{ left: 80 }}>
        <XAxis type="number" stroke="rgb(var(--muted))" fontSize={11} unit="%" />
        <YAxis type="category" dataKey="name" stroke="rgb(var(--ink))" fontSize={11} width={140} />
        <Tooltip
          formatter={(v: number) => `${v}%`}
          contentStyle={{ background: 'rgb(var(--surface))', borderRadius: 6, fontSize: 12 }}
        />
        <Bar dataKey="sov" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
