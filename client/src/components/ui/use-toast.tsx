import * as React from 'react';

export type ToastProps = {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
};

type ToastState = ToastProps & { id: string };

const ToastContext = React.createContext<{
  toasts: ToastState[];
  toast: (props: ToastProps) => void;
  dismiss: (id: string) => void;
} | null>(null);

export function ToastStateProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastState[]>([]);

  const toast = React.useCallback((props: ToastProps) => {
    const id = Math.random().toString(36).slice(2, 9);
    const next: ToastState = { id, ...props };
    setToasts((prev) => [...prev, next]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 4000);
  }, []);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
