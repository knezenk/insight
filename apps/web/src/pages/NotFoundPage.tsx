import { Link } from 'react-router-dom';

export default function NotFoundPage(): JSX.Element {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-bg p-6 text-center">
      <h1 className="font-display text-5xl font-semibold">404</h1>
      <p className="text-muted">Página não encontrada</p>
      <Link to="/dashboard" className="mt-3 rounded-md bg-accent px-4 py-2 text-sm text-white">
        Voltar pro dashboard
      </Link>
    </div>
  );
}
