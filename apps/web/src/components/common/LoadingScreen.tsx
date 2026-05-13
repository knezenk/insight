export function LoadingScreen(): JSX.Element {
  return (
    <div className="flex h-full min-h-screen items-center justify-center bg-bg">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        <span className="text-xs uppercase tracking-widest text-muted">Carregando…</span>
      </div>
    </div>
  );
}
