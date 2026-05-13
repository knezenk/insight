import { Component, type ErrorInfo, type ReactNode } from 'react';

interface State {
  err?: Error;
}

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = {};

  static getDerivedStateFromError(err: Error): State {
    return { err };
  }

  componentDidCatch(err: Error, info: ErrorInfo): void {
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary]', err, info);
  }

  render() {
    if (this.state.err) {
      return (
        <div className="flex h-full min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
          <h1 className="font-display text-2xl">Algo deu errado</h1>
          <p className="max-w-md text-sm text-muted">{this.state.err.message}</p>
          <button
            onClick={() => location.reload()}
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white"
          >
            Recarregar aplicação
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
