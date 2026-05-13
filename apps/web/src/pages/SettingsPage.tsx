import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAuthStore } from '@/stores/auth.store';

export default function SettingsPage(): JSX.Element {
  const user = useAuthStore((s) => s.user);
  return (
    <div className="flex flex-col gap-5">
      <header>
        <span className="text-[10px] uppercase tracking-widest text-muted">Configurações</span>
        <h1 className="font-display text-3xl font-semibold">Conta</h1>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
          <CardDescription>{user?.email}</CardDescription>
        </CardHeader>
        <CardContent className="text-sm">
          <p>Nome: {user?.name}</p>
          <p>Papel: {user?.role}</p>
          <p>Workspaces: {user?.workspaces.join(', ')}</p>
        </CardContent>
      </Card>
    </div>
  );
}
