import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

import { indice360Band } from '@insight/shared';

export function Indice360Gauge({ score }: { score: number }): JSX.Element {
  const band = indice360Band(score);
  const data = [
    { name: 'achieved', value: score },
    { name: 'remaining', value: 100 - score },
  ];
  return (
    <div className="relative flex h-44 items-center justify-center">
      <ResponsiveContainer width={240} height={140}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="100%"
            innerRadius={60}
            outerRadius={90}
            startAngle={180}
            endAngle={0}
            stroke="none"
            dataKey="value"
          >
            <Cell fill={band.color} />
            <Cell fill="rgb(var(--line))" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute bottom-0 flex flex-col items-center">
        <span className="font-display text-4xl font-semibold" style={{ color: band.color }}>
          {score}
        </span>
        <span className="text-[10px] uppercase tracking-widest text-muted">{band.label}</span>
      </div>
    </div>
  );
}
