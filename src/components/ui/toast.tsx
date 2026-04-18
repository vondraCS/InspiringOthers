import { Toast as ToastPrimitive } from '@base-ui/react/toast';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export const toastManager = ToastPrimitive.createToastManager();

type ToastInput = { title?: string; description?: string; timeout?: number };

export const toast = {
  show: ({ title, description, timeout }: ToastInput) =>
    toastManager.add({ title, description, timeout, type: 'info' }),
  success: ({ title, description, timeout }: ToastInput) =>
    toastManager.add({ title, description, timeout, type: 'success' }),
  error: ({ title, description, timeout }: ToastInput) =>
    toastManager.add({ title, description, timeout, type: 'error', priority: 'high' }),
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <ToastPrimitive.Provider toastManager={toastManager}>
      {children}
      <Toaster />
    </ToastPrimitive.Provider>
  );
}

function Toaster() {
  return (
    <ToastPrimitive.Portal>
      <ToastPrimitive.Viewport className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-[340px] max-w-[calc(100vw-2rem)]">
        <ToastList />
      </ToastPrimitive.Viewport>
    </ToastPrimitive.Portal>
  );
}

function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager();
  return (
    <>
      {toasts.map((t) => (
        <ToastPrimitive.Root
          key={t.id}
          toast={t}
          className={cn(
            'flex items-start gap-3 rounded-[12px] border bg-white shadow-md px-4 py-3',
            'data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 transition-opacity',
            t.type === 'error'
              ? 'border-red-300'
              : t.type === 'success'
                ? 'border-[#2ECB71]/40'
                : 'border-black/15',
          )}
        >
          <div className="flex-1 flex flex-col gap-0.5">
            {t.title && (
              <ToastPrimitive.Title className="font-inter font-semibold text-sm text-black">
                {t.title}
              </ToastPrimitive.Title>
            )}
            {t.description && (
              <ToastPrimitive.Description className="font-inter text-sm text-black/70">
                {t.description}
              </ToastPrimitive.Description>
            )}
          </div>
          <ToastPrimitive.Close
            aria-label="Dismiss"
            className="shrink-0 rounded p-1 hover:bg-black/5 cursor-pointer"
          >
            <X size={14} strokeWidth={2} />
          </ToastPrimitive.Close>
        </ToastPrimitive.Root>
      ))}
    </>
  );
}
