import * as ToastPrimitive from '@radix-ui/react-toast';
import { type PropsWithChildren, createContext, useCallback, useContext, useState } from 'react';

import { cn } from '@insight/ui';

interface ToastItem {
  id: number;
  title: string;
  tone: 'default' | 'success' | 'error' | 'info';
}

interface Ctx {
  toast: (title: string, tone?: ToastItem['tone']) => void;
}

const ToastContext = createContext<Ctx | null>(null);

export function ToastProvider({ children }: PropsWithChildren): JSX.Element {
  const [items, setItems] = useState<ToastItem[]>([]);
  const toast = useCallback<Ctx['toast']>((title, tone = 'default') => {
    const id = Date.now() + Math.random();
    setItems((p) => [...p, { id, title, tone }]);
    setTimeout(() => setItems((p) => p.filter((x) => x.id !== id)), 4_000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      <ToastPrimitive.Provider swipeDirection="right">
        {children}
        {items.map((it) => (
          <ToastPrimitive.Root
            key={it.id}
            className={cn(
              'flex items-center gap-3 rounded-md border bg-surface px-4 py-3 shadow-lg',
              it.tone === 'success' && 'border-success text-success',
              it.tone === 'error' && 'border-danger text-danger',
              it.tone === 'info' && 'border-info text-info',
            )}
          >
            <ToastPrimitive.Title className="text-sm">{it.title}</ToastPrimitive.Title>
          </ToastPrimitive.Root>
        ))}
        <ToastPrimitive.Viewport className="fixed bottom-4 right-4 z-50 flex w-96 max-w-full flex-col gap-2" />
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}

export function useToast(): Ctx {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast precisa estar dentro de <ToastProvider>');
  return ctx;
}
