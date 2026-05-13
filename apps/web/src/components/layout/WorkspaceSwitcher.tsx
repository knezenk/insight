import * as Select from '@radix-ui/react-select';
import { ChevronDown } from 'lucide-react';

import { useAuthStore } from '@/stores/auth.store';
import { useWorkspaceStore } from '@/stores/workspace.store';

const LABELS: Record<string, string> = {
  mjsp: 'Ministério da Justiça',
  btg: 'BTG Pactual',
  defesa: 'Min. Defesa',
  ebserh: 'EBSERH',
  'tce-ce': 'TCE-CE',
  petrobras: 'Petrobras',
  agu: 'AGU',
};

export function WorkspaceSwitcher(): JSX.Element {
  const { user } = useAuthStore();
  const { current, setCurrent } = useWorkspaceStore();
  const slugs = user?.workspaces ?? [];

  return (
    <Select.Root value={current} onValueChange={setCurrent}>
      <Select.Trigger className="flex h-9 items-center gap-2 rounded-md border border-line bg-surface px-3 text-sm hover:bg-line/40">
        <Select.Value placeholder="Workspace" />
        <ChevronDown className="h-3.5 w-3.5 opacity-60" />
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={4}
          className="z-50 min-w-56 rounded-md border border-line bg-surface p-1 shadow-md"
        >
          <Select.Viewport>
            {slugs.map((s) => (
              <Select.Item
                key={s}
                value={s}
                className="cursor-pointer rounded px-2 py-1.5 text-sm hover:bg-line/40 data-[state=checked]:bg-accent/10 data-[state=checked]:text-accent"
              >
                <Select.ItemText>{LABELS[s] ?? s}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
