import { AlertTriangle } from 'lucide-react';

export function ErrorState({ message }: { message?: string }): JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      <AlertTriangle className="h-10 w-10 text-warning" />
      <h3 className="font-display text-lg">Falha ao carregar dados</h3>
      <p className="max-w-md text-sm text-muted">
        {message ?? 'Não foi possível obter as informações desta seção. Tente recarregar.'}
      </p>
    </div>
  );
}
