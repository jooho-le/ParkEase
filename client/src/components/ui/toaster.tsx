import { useToast } from './use-toast';
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from './toast';

function ToastRenderer() {
  const { toasts, dismiss } = useToast();

  return (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          className={toast.variant === 'destructive' ? 'border-rose-200 bg-rose-50' : ''}
        >
          <div className="grid gap-1">
            {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
            {toast.description && <ToastDescription>{toast.description}</ToastDescription>}
          </div>
          <ToastClose onClick={() => dismiss(toast.id)} />
        </Toast>
      ))}
      <ToastViewport />
    </>
  );
}

export function Toaster() {
  return (
    <ToastProvider>
      <ToastRenderer />
    </ToastProvider>
  );
}
