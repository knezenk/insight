import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Select from '@radix-ui/react-select';
import { subDays } from 'date-fns';
import { Calendar, ChevronDown, LogOut, User } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@insight/ui';

import { useAuthStore } from '@/stores/auth.store';
import { usePeriodStore } from '@/stores/period.store';
import { useWorkspaceStore } from '@/stores/workspace.store';

const WORKSPACE_LABELS: Record<string, string> = {
  mjsp: 'Ministério da Justiça',
  btg: 'BTG Pactual',
  defesa: 'Min. Defesa',
  ebserh: 'EBSERH',
  'tce-ce': 'TCE-CE',
  petrobras: 'Petrobras',
  agu: 'AGU',
};

const PERIOD_PRESETS = [
  { label: '7 dias', days: 7 },
  { label: '30 dias', days: 30 },
  { label: '90 dias', days: 90 },
];

export function Topbar(): JSX.Element {
  const { user, logout } = useAuthStore();
  const { current: workspace, setCurrent: setWorkspace } = useWorkspaceStore();
  const { setRange } = usePeriodStore();
  const [activePeriod, setActivePeriod] = useState(30);
  const [mode, setMode] = useState<'exec' | 'analytic'>('exec');

  return (
    <div className="flex h-full items-center gap-4 px-6" style={{ background: 'rgb(var(--surface))' }}>
      <Select.Root value={workspace} onValueChange={setWorkspace}>
        <Select.Trigger className="flex h-9 items-center gap-2 rounded-md border border-line bg-surface px-3 text-sm font-medium hover:bg-bg-alt">
          <Select.Value placeholder="Workspace" />
          <ChevronDown className="h-3.5 w-3.5 opacity-60" />
        </Select.Trigger>
        <Select.Portal>
          <Select.Content position="popper" sideOffset={4} className="z-50 min-w-56 rounded-md border border-line bg-surface p-1 shadow-md">
            <Select.Viewport>
              {(user?.workspaces ?? []).map((s) => (
                <Select.Item key={s} value={s} className="cursor-pointer rounded px-2.5 py-2 text-sm hover:bg-bg-alt data-[state=checked]:bg-accent-soft data-[state=checked]:text-accent outline-none">
                  <Select.ItemText>{WORKSPACE_LABELS[s] ?? s}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select.Portal>
      </Select.Root>

      <div className="flex items-center gap-0.5 rounded-md p-0.5 bg-bg-alt">
        {(['exec', 'analytic'] as const).map((m) => (
          <button key={m} onClick={() => setMode(m)} className={cn('px-3 py-1.5 rounded text-xs font-medium', mode === m ? 'bg-ink text-white' : 'text-muted hover:text-ink')}>
            {m === 'exec' ? 'Executivo' : 'Analítico'}
          </button>
        ))}
      </div>

      <div className="ml-auto flex items-center gap-1 rounded-md border border-line bg-surface p-0.5">
        <Calendar className="ml-2 h-3.5 w-3.5 text-muted" />
        {PERIOD_PRESETS.map((p) => (
          <button key={p.days} onClick={() => { setActivePeriod(p.days); const to = new Date(); setRange(subDays(to, p.days).toISOString(), to.toISOString()); }} className={cn('px-3 py-1.5 rounded text-xs font-medium', activePeriod === p.days ? 'bg-ink text-white' : 'text-muted hover:text-ink')}>
            {p.label}
          </button>
        ))}
      </div>

      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="flex items-center gap-2.5 rounded-md border border-line bg-surface px-3 py-1.5 hover:bg-bg-alt">
            <span className="w-8 h-8 rounded-full text-white flex items-center justify-center text-xs font-bold" style={{ background: 'rgb(var(--ink))' }}>
              {user?.name?.split(' ').map((p) => p[0]).slice(0, 2).join('') ?? '??'}
            </span>
            <div className="text-left hidden md:block">
              <div className="text-xs font-semibold leading-tight">{user?.name}</div>
              <div className="text-[10.5px] text-muted leading-tight">{user?.role ?? ''}</div>
            </div>
            <ChevronDown className="h-3.5 w-3.5 opacity-60" />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content align="end" sideOffset={6} className="z-50 min-w-64 rounded-md border border-line bg-surface p-2 shadow-lg">
            {user && (
              <>
                <div className="px-2 py-2">
                  <div className="text-sm font-semibold">{user.name}</div>
                  <div className="text-xs text-muted">{user.email}</div>
                  <div className="mt-2"><span className="text-[10px] uppercase tracking-widest font-bold rounded px-2 py-0.5" style={{ background: user.role === 'super_admin' ? 'rgb(var(--neg-soft))' : user.role === 'editor' ? 'rgb(var(--warn-soft))' : 'rgb(var(--info-soft))', color: user.role === 'super_admin' ? 'rgb(var(--neg))' : user.role === 'editor' ? 'rgb(var(--warn))' : 'rgb(var(--info))' }}>{user.role}</span></div>
                </div>
                <DropdownMenu.Separator className="my-1 h-px bg-line" />
              </>
            )}
            <DropdownMenu.Item className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-bg-alt outline-none">
              <User className="h-3.5 w-3.5" />Meu perfil
            </DropdownMenu.Item>
            <DropdownMenu.Separator className="my-1 h-px bg-line" />
            <DropdownMenu.Item onSelect={logout} className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-neg-soft outline-none" style={{ color: 'rgb(var(--neg))' }}>
              <LogOut className="h-3.5 w-3.5" />Sair da conta
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}
