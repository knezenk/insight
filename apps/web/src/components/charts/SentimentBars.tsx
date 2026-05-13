import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

import { SentimentLabelByScore, type SentimentScoreValue } from '@insight/shared';

interface Distribution {
  score: SentimentScoreValue;
  count: number;
}

export function SentimentBars({ data }: { data: Distribution[] }): JSX.Element {
  const enriched = data.map((d) => ({
    label: SentimentLabelByScore[d.score].replace('_', ' '),
    count: d.count,
    fill: d.score > 0 ? 'rgb(var(--success))' : 'rgb(var(--danger))',
  }));
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={enriched} layout="vertical" margin={{ left: 60 }}>
        <XAxis type="number" stroke="rgb(var(--muted))" fontSize={10} />
        <YAxis type="category" dataKey="label" stroke="rgb(var(--muted))" fontSize={10} width={120} />
        <Bar dataKey="count" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
