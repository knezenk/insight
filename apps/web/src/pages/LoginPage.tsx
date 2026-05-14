import { useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useToast } from '@/components/common/Toast';
import { useAuthStore } from '@/stores/auth.store';

interface DemoAccount {
  id: string;
  email: string;
  password: string;
  name: string;
  role: string;
  initials: string;
  badge: string;
  badgeColor: string;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    id: 'rafael',
    email: 'rafael@target360.com.br',
    password: '360rafa',
    name: 'Rafael Barbosa',
    role: 'Estrategista Sênior',
    initials: 'RB',
    badge: 'SUPER ADMIN',
    badgeColor: 'bg-red-100 text-red-800',
  },
  {
    id: 'juliana',
    email: 'juliana@target360.com.br',
    password: '360edit',
    name: 'Juliana Pires',
    role: 'Editor',
    initials: 'JP',
    badge: 'EDITOR',
    badgeColor: 'bg-amber-100 text-amber-800',
  },
  {
    id: 'eduardo',
    email: 'eduardo@mj.gov.br',
    password: '360mjsp',
    name: 'Eduardo Lima · MJSP',
    role: 'Cliente',
    initials: 'EL',
    badge: 'CLIENTE',
    badgeColor: 'bg-blue-100 text-blue-800',
  },
];

export default function LoginPage(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((s) => s.login);
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  async function doLogin(useEmail: string, usePassword: string): Promise<void> {
    setLoading(true);
    try {
      await login(useEmail, usePassword);
      const from =
        (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Falha no login', 'error');
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(e: FormEvent): void {
    e.preventDefault();
    if (!email || !password) {
      toast('Preencha email e senha', 'error');
      return;
    }
    void doLogin(email, password);
  }

  function quickDemo(acc: DemoAccount): void {
    setEmail(acc.email);
    setPassword(acc.password);
    void doLogin(acc.email, acc.password);
  }

  return (
    <div className="min-h-screen w-full grid lg:grid-cols-2 bg-bg">
      {/* ────────── LADO ESQUERDO · FORM ────────── */}
      <div className="flex flex-col justify-between p-10 lg:p-14 bg-surface relative overflow-y-auto">
        <div>
          <div className="flex items-center gap-2 mb-12">
            <span className="font-display text-2xl font-semibold tracking-tight">Insight</span>
            <span className="eyebrow ml-1">REPUTAÇÃO 360</span>
          </div>

          <div className="max-w-md">
            <span className="eyebrow text-accent mb-3 block">Login institucional</span>
            <h1 className="font-display text-3xl lg:text-4xl font-semibold tracking-tight mb-3 leading-tight">
              Bem-vindo de volta.
            </h1>
            <p className="text-muted text-sm lg:text-base leading-relaxed mb-8">
              Entre com seu e-mail corporativo · SSO institucional disponível para clientes
              enterprise.
            </p>

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="eyebrow mb-1.5 block">E-mail corporativo</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@empresa.com.br"
                  autoComplete="email"
                  className="w-full px-4 py-3 border-2 border-line bg-surface rounded-lg text-sm focus:outline-none focus:border-accent transition-colors"
                />
              </div>

              <div>
                <label className="eyebrow mb-1.5 block">Senha</label>
                <div className="relative">
                  <input
                    type={showPwd ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="w-full px-4 py-3 pr-20 border-2 border-line bg-surface rounded-lg text-sm focus:outline-none focus:border-accent transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted hover:text-ink font-medium"
                  >
                    {showPwd ? '🙈 ocultar' : '👁 mostrar'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-accent text-white font-semibold text-sm tracking-wide hover:bg-accent-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: 'rgb(var(--accent))' }}
              >
                {loading ? 'Autenticando…' : 'Entrar'}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3 text-xs text-muted">
              <div className="flex-1 h-px bg-line" />
              <span>OU CONTINUAR COM</span>
              <div className="flex-1 h-px bg-line" />
            </div>

            <div className="space-y-2">
              <button className="w-full py-2.5 border-2 border-line bg-surface rounded-lg text-sm font-medium hover:bg-bg-alt flex items-center justify-center gap-2">
                <svg width="16" height="16" viewBox="0 0 18 18">
                  <path
                    d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.79 2.72v2.26h2.9c1.7-1.56 2.69-3.87 2.69-6.62z"
                    fill="#4285F4"
                  />
                  <path
                    d="M9 18c2.43 0 4.47-.81 5.96-2.18l-2.9-2.26c-.8.54-1.83.86-3.06.86-2.36 0-4.36-1.6-5.07-3.74H.96v2.34A9 9 0 0 0 9 18z"
                    fill="#34A853"
                  />
                  <path
                    d="M3.93 10.68A5.42 5.42 0 0 1 3.64 9c0-.59.1-1.16.29-1.68V4.98H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.02l2.97-2.34z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58A8.99 8.99 0 0 0 9 0 9 9 0 0 0 .96 4.98l2.97 2.34C4.64 5.18 6.64 3.58 9 3.58z"
                    fill="#EA4335"
                  />
                </svg>
                Entrar com Google
              </button>
              <button className="w-full py-2.5 border-2 border-line bg-surface rounded-lg text-sm font-medium hover:bg-bg-alt flex items-center justify-center gap-2">
                <svg width="16" height="16" viewBox="0 0 21 21">
                  <path fill="#f25022" d="M1 1h9v9H1z" />
                  <path fill="#7fba00" d="M11 1h9v9h-9z" />
                  <path fill="#00a4ef" d="M1 11h9v9H1z" />
                  <path fill="#ffb900" d="M11 11h9v9h-9z" />
                </svg>
                Entrar com Microsoft 365
              </button>
            </div>

            {/* Quick demo */}
            <div className="mt-8 pt-6 border-t border-line">
              <div className="eyebrow mb-3">⚡ ACESSO RÁPIDO DEMO · 1 CLIQUE</div>
              <div className="space-y-2">
                {DEMO_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.id}
                    onClick={() => quickDemo(acc)}
                    disabled={loading}
                    className="w-full px-3 py-2.5 border border-line bg-bg-alt hover:bg-surface rounded-lg flex items-center gap-3 text-left transition-colors disabled:opacity-50"
                  >
                    <span className="w-8 h-8 rounded-full bg-ink text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
                      {acc.initials}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block font-semibold text-sm leading-tight">{acc.name}</span>
                      <span className="block text-xs text-muted truncate">{acc.email}</span>
                    </span>
                    <span
                      className={`text-[9.5px] px-2 py-0.5 rounded font-bold tracking-wider ${acc.badgeColor}`}
                    >
                      {acc.badge}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-2 mt-8">
          © 2026 Target 360 · Insights ·{' '}
          <a href="#" className="hover:text-ink underline">
            Termos
          </a>{' '}
          ·{' '}
          <a href="#" className="hover:text-ink underline">
            Privacidade
          </a>
        </div>
      </div>

      {/* ────────── LADO DIREITO · HERO ────────── */}
      <div className="hidden lg:flex flex-col justify-center p-14 relative overflow-hidden text-white">
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, #0E1A14 0%, #1F3D2E 45%, #2D5142 100%)',
          }}
        />
        <div
          className="absolute top-0 right-0 w-96 h-96 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at top right, rgba(255,204,0,.18), transparent 65%)',
          }}
        />
        <div
          className="absolute -bottom-12 -right-4 font-display font-semibold leading-none pointer-events-none select-none"
          style={{
            fontSize: '240px',
            color: 'rgba(255,204,0,0.08)',
            letterSpacing: '-0.05em',
          }}
        >
          360
        </div>

        <div className="relative max-w-lg">
          <span
            className="inline-block mb-6 px-3 py-1.5 rounded text-xs font-bold tracking-widest"
            style={{ background: 'rgba(255,204,0,0.16)', color: '#FFCC00' }}
          >
            ⭐ REPUTAÇÃO 360 · INTELIGÊNCIA MIDIÁTICA
          </span>

          <h2 className="font-display text-4xl xl:text-5xl font-semibold tracking-tight leading-tight mb-5">
            Decisão estratégica baseada em dado, não em achismo.
          </h2>

          <p className="text-base text-white/80 leading-relaxed mb-10">
            Reputação 360 completa · Índice 360 proprietário · mapa de influenciadores · relatórios
            profissionais — tudo em um único produto.
          </p>

          <div className="grid grid-cols-3 gap-6 py-6 border-t border-white/15 border-b">
            <div>
              <div className="font-display text-3xl font-semibold leading-none">21M+</div>
              <div className="text-xs uppercase tracking-wider text-white/60 mt-2 font-semibold">
                matérias indexadas
              </div>
            </div>
            <div>
              <div className="font-display text-3xl font-semibold leading-none">14</div>
              <div className="text-xs uppercase tracking-wider text-white/60 mt-2 font-semibold">
                clientes ativos
              </div>
            </div>
            <div>
              <div className="font-display text-3xl font-semibold leading-none">99,9%</div>
              <div className="text-xs uppercase tracking-wider text-white/60 mt-2 font-semibold">
                SLA uptime
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
