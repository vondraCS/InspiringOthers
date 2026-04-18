import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export function DialogContent({
  className,
  children,
  title,
  description,
  hideCloseButton,
}: {
  className?: string;
  children: React.ReactNode;
  title?: string;
  description?: string;
  hideCloseButton?: boolean;
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Backdrop className="fixed inset-0 bg-black/40 z-50 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 transition-opacity" />
      <DialogPrimitive.Popup
        className={cn(
          'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50',
          'w-[520px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-4rem)] overflow-y-auto',
          'bg-white rounded-[15px] border border-black/15 shadow-xl p-6',
          'data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 transition-opacity',
          className,
        )}
      >
        {title && (
          <DialogPrimitive.Title className="font-raleway font-bold text-xl text-black">
            {title}
          </DialogPrimitive.Title>
        )}
        {description && (
          <DialogPrimitive.Description className="font-inter text-sm text-black/70 mt-1">
            {description}
          </DialogPrimitive.Description>
        )}
        {!hideCloseButton && (
          <DialogPrimitive.Close
            aria-label="Close"
            className="absolute top-4 right-4 rounded p-1 hover:bg-black/5 cursor-pointer"
          >
            <X size={18} strokeWidth={2} />
          </DialogPrimitive.Close>
        )}
        <div className={cn(title || description ? 'mt-4' : '')}>{children}</div>
      </DialogPrimitive.Popup>
    </DialogPrimitive.Portal>
  );
}
