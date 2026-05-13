import { LogOut, User } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/auth.store';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';
import { PeriodSwitcher } from './PeriodSwitcher';

export function Topbar(): JSX.Element {
  const { user, logout } = useAuthStore();

  return (
    <div className="flex h-full items-center gap-4 px-6">
      <WorkspaceSwitcher />
      <div className="ml-auto flex items-center gap-3">
        <PeriodSwitcher />
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-4 w-4" />
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={4}
              className="z-50 min-w-48 rounded-md border border-line bg-surface p-2 shadow-md"
            >
              {user && (
                <>
                  <div className="px-2 pb-2">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted">{user.email}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-widest text-accent">
                      {user.role}
                    </p>
                  </div>
                  <DropdownMenu.Separator className="my-1 h-px bg-line" />
                </>
              )}
              <DropdownMenu.Item
                onSelect={logout}
                className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-line/40"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sair
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </div>
  );
}
