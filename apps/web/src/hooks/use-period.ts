import { usePeriodStore } from '@/stores/period.store';

export function usePeriod() {
  const { from, to } = usePeriodStore();
  return { from, to };
}
