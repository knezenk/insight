import { create } from 'zustand';
import { subDays } from 'date-fns';

interface PeriodState {
  from: string;
  to: string;
  setRange(from: string, to: string): void;
}

const today = new Date();
const defaultFrom = subDays(today, 30).toISOString();
const defaultTo = today.toISOString();

export const usePeriodStore = create<PeriodState>((set) => ({
  from: defaultFrom,
  to: defaultTo,
  setRange: (from, to) => set({ from, to }),
}));
