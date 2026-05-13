import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WorkspaceState {
  current: string;
  setCurrent(slug: string): void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      current: 'mjsp',
      setCurrent: (slug) => set({ current: slug }),
    }),
    { name: 'insight.workspace' },
  ),
);
