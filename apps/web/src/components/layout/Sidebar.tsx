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

import { useAuthStore } from '@/stores/auth.store';
import { cn } from '@insight/ui';

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: string;
}

// IMPORTANTE: só rotas que existem no App.tsx atual.
// Pra adicionar mais (Newsletter, Clipping, Clientes, etc), o dev precisa
// criar as páginas correspondentes E registrar as rotas no App.tsx primeiro.
const MAIN_NAV: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/workbench', label: 'Notícias', icon: FileText },
  { to: '/alerts', label: 'Alertas', icon: AlertTriangle, badge: '3' },
];

const ANALYSIS_NAV: NavItem[] = [
  { to: '/narratives', label: 'Narrativas', icon: Network },
  { to: '/influencers', label: 'Influenciadores', icon: Users },
  { to: '/competitive', label: 'Competitivo', icon: BarChart3 },
];

const DELIVERY_NAV: NavItem[] = [
  { to: '/reports', label: 'Relatórios', icon: Telescope },
];

function NavGroup({
  title,
  items,
}: {
  title?: string;
  items: NavItem[];
}): JSX.Element {
  return (
    <div className="mb-3">
      {title && (
        <div className="px-3 mb-1.5 text-[10px] uppercase tracking-widest text-muted-2 font-bold">
          {title}
        </div>
      )}
      <div className="flex flex-col gap-0.5">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2.5 rounded-md px-3 py-2 text-[12.5px] font-medium transition-colors relative',
                isActive
                  ? 'text-accent font-semibold'
                  : 'text-ink-2/85 hover:bg-line/40 hover:text-ink',
              )
            }
            style={({ isActive }) =>
              isActive
                ? {
                    background:
                      'linear-gradient(90deg, rgb(var(--accent-soft)), rgb(var(--surface)))',
                  }
                : undefined
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span
                    className="absolute left-[-12px] top-1.5 bottom-1.5 w-[3px] rounded-r"
                    style={{ background: 'rgb(var(--accent))' }}
                  />
                )}
                <item.icon className="h-[17px] w-[17px] flex-shrink-0" strokeWidth={1.8} />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded-md text-white"
                    style={{ background: 'rgb(var(--accent))' }}
                  >
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export function Sidebar(): JSX.Element {
  const user = useAuthStore((s) => s.user);

  return (
    <nav
      className="flex h-full flex-col px-4 py-5"
      style={{ background: 'rgb(var(--surface))' }}
    >
      <div className="px-3 pb-5 mb-4 border-b border-line">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-2xl font-semibold tracking-tight">Insight</span>
        </div>
        <p className="text-[10px] uppercase tracking-widest text-muted-2 font-bold mt-0.5">
          REPUTAÇÃO 360
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <NavGroup items={MAIN_NAV} />
        <NavGroup title="Análise" items={ANALYSIS_NAV} />
        <NavGroup title="Entrega" items={DELIVERY_NAV} />
      </div>

      <div className="mt-auto pt-3 border-t border-line">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium',
              isActive ? 'bg-line/40 text-ink' : 'text-muted hover:bg-line/30 hover:text-ink',
            )
          }
        >
          <Settings className="h-4 w-4" />
          Configurações
        </NavLink>

        {user && (
          <div className="mt-4 px-3 py-2 rounded-md bg-bg-alt/60 text-[11px] text-muted">
            Logado como <b className="text-ink">{user.name}</b>
          </div>
        )}
      </div>
    </nav>
  );
}