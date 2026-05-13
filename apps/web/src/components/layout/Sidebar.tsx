import {
  AlertTriangle,
  BarChart3,
  FileText,
  LayoutDashboard,
  Network,
  Settings,
  Telescope,
  Users,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

import { cn } from '@insight/ui';

const items = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/workbench', label: 'Notícias', icon: FileText },
  { to: '/alerts', label: 'Alertas', icon: AlertTriangle },
  { to: '/narratives', label: 'Narrativas', icon: Network },
  { to: '/influencers', label: 'Influenciadores', icon: Users },
  { to: '/competitive', label: 'Competitivo', icon: BarChart3 },
  { to: '/reports', label: 'Relatórios', icon: Telescope },
];

export function Sidebar(): JSX.Element {
  return (
    <nav className="flex h-full flex-col gap-1 px-3 py-4">
      <div className="px-3 pb-4">
        <span className="font-display text-lg font-semibold tracking-tight text-ink">Insight</span>
        <p className="text-[10px] uppercase tracking-widest text-muted">Reputação 360</p>
      </div>

      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
              isActive
                ? 'bg-accent/10 font-medium text-accent'
                : 'text-ink/80 hover:bg-line/50 hover:text-ink',
            )
          }
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </NavLink>
      ))}

      <div className="mt-auto border-t border-line pt-2">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-2 rounded-md px-3 py-2 text-sm',
              isActive ? 'bg-line/40 font-medium' : 'text-ink/70 hover:bg-line/40',
            )
          }
        >
          <Settings className="h-4 w-4" />
          Configurações
        </NavLink>
      </div>
    </nav>
  );
}
