import {
  AlertTriangle,
  BarChart3,
  FileText,
  LayoutDashboard,
  Mail,
  MessageCircle,
  Network,
  Newspaper,
  Radio,
  Settings,
  Telescope,
  Tv,
  Users,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

import { cn } from '@insight/ui';
import { useAuthStore } from '@/stores/auth.store';

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  badge?: string;
  adminOnly?: boolean;
  editorOnly?: boolean;
}

const MAIN_NAV: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/alerts', label: 'Alertas', icon: AlertTriangle, badge: '3' },
  { to: '/trends', label: 'Tendências', icon: BarChart3 },
];

const CLIPPING_NAV: NavItem[] = [
  { to: '/clipping/tv', label: 'Clipping TV', icon: Tv },
  { to: '/clipping/radio', label: 'Clipping Rádio', icon: Radio },
  { to: '/clipping/print', label: 'Clipping Impresso', icon: Newspaper },
  { to: '/clipping/online', label: 'Clipping Online', icon: FileText },
  { to: '/clipping/social', label: 'Redes Sociais', icon: MessageCircle },
];

const ANALYSIS_NAV: NavItem[] = [
  { to: '/workbench', label: 'Notícias (todas)', icon: FileText },
  { to: '/influencers', label: 'Influenciadores', icon: Users },
  { to: '/competitive', label: 'Competitivo', icon: BarChart3 },
  { to: '/narratives', label: 'Narrativas', icon: Network },
];

const DELIVERY_NAV: NavItem[] = [
  { to: '/reports', label: 'Relatórios', icon: Telescope },
  { to: '/newsletter', label: 'Newsletter', icon: Mail },
];

const ADMIN_NAV: NavItem[] = [
  { to: '/clients', label: 'Clientes', icon: Users, adminOnly: true },
  { to: '/users', label: 'Usuários', icon: Users, adminOnly: true },
  { to: '/dictionary', label: 'Dicionário', icon: FileText, editorOnly: true },
  { to: '/ai-config', label: 'Config. IA', icon: Settings, adminOnly: true },
  { to: '/audit', label: 'Auditoria', icon: AlertTriangle, adminOnly: true },
];

function NavGroup({
  title,
  items,
  canAdmin,
  canEdit,
}: {
  title?: string;
  items: NavItem[];
  canAdmin: boolean;
  canEdit: boolean;
}): JSX.Element | null {
  const visible = items.filter((i) => {
    if (i.adminOnly && !canAdmin) return false;
    if (i.editorOnly && !canEdit) return false;
    return true;
  });
  if (visible.length === 0) return null;
  return (
    <div className="mb-3">
      {title && (
        <div className="px-3 mb-1.5 text-[10px] uppercase tracking-widest text-muted-2 font-bold">
          {title}
        </div>
      )}
      <div className="flex flex-col gap-0.5">
        {visible.map((item) => (
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
  const canAdmin = user?.role === 'super_admin';
  const canEdit = user?.role !== 'cliente';

  return (
    <nav
      className="flex h-full flex-col px-4 py-5"
      style={{ background: 'rgb(var(--surface))' }}
    >
      {/* Brand */}
      <div className="px-3 pb-5 mb-4 border-b border-line">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-2xl font-semibold tracking-tight">Insight</span>
        </div>
        <p className="text-[10px] uppercase tracking-widest text-muted-2 font-bold mt-0.5">
          REPUTAÇÃO 360
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <NavGroup items={MAIN_NAV} canAdmin={canAdmin} canEdit={canEdit} />
        <NavGroup title="Clipping de mídia" items={CLIPPING_NAV} canAdmin={canAdmin} canEdit={canEdit} />
        <NavGroup title="Análise" items={ANALYSIS_NAV} canAdmin={canAdmin} canEdit={canEdit} />
        <NavGroup title="Entrega" items={DELIVERY_NAV} canAdmin={canAdmin} canEdit={canEdit} />
        <NavGroup title="Admin" items={ADMIN_NAV} canAdmin={canAdmin} canEdit={canEdit} />
      </div>

      {/* Settings + Footer */}
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

        {/* Footer mini · health */}
        <div className="mt-4 px-3 py-2.5 rounded-md bg-bg-alt/60">
          <div className="text-[10px] uppercase tracking-widest text-muted-2 font-bold mb-1">
            Apache Solr
          </div>
          <div className="text-[11px] text-muted leading-tight">clipping_v3 · 21M docs</div>
          <div className="flex items-center gap-1.5 mt-1 text-[11px]">
            <span
              className="w-1.5 h-1.5 rounded-full inline-block"
              style={{ background: 'rgb(var(--pos))' }}
            />
            <span style={{ color: 'rgb(var(--pos))' }}>healthy</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
