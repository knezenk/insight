import { subDays } from 'date-fns';
import { Calendar } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { usePeriodStore } from '@/stores/period.store';

const PRESETS = [
  { label: '7 dias', days: 7 },
  { label: '30 dias', days: 30 },
  { label: '90 dias', days: 90 },
];

export function PeriodSwitcher(): JSX.Element {
  const { setRange } = usePeriodStore();
  return (
    <div className="flex items-center gap-1 rounded-md border border-line bg-surface p-0.5">
      <Calendar className="ml-2 h-3.5 w-3.5 text-muted" />
      {PRESETS.map((p) => (
        <Button
          key={p.days}
          variant="ghost"
          size="sm"
          onClick={() => {
            const to = new Date();
            const from = subDays(to, p.days);
            setRange(from.toISOString(), to.toISOString());
          }}
        >
          {p.label}
        </Button>
      ))}
    </div>
  );
}
