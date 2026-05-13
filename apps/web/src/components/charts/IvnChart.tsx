import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';

interface Point {
  date: string;
  ivn: number;
}

export function IvnChart({ data }: { data: Point[] }): JSX.Element {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
        <CartesianGrid stroke="rgb(var(--line))" strokeDasharray="3 3" />
        <XAxis dataKey="date" stroke="rgb(var(--muted))" fontSize={11} />
        <YAxis stroke="rgb(var(--muted))" fontSize={11} domain={[-10, 10]} />
        <Tooltip
          contentStyle={{
            background: 'rgb(var(--surface))',
            border: '1px solid rgb(var(--line))',
            borderRadius: 6,
            fontSize: 12,
          }}
        />
        <Line
          type="monotone"
          dataKey="ivn"
          stroke="rgb(var(--accent))"
          strokeWidth={2.4}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
