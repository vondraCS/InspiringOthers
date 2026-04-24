import { isValidElement, type ReactElement } from 'react';
import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip';
import { cn } from '@/lib/utils';

export const TooltipProvider = TooltipPrimitive.Provider;

type TooltipProps = {
  children: React.ReactNode;
  content: React.ReactNode;
  /**
   * When true, the tooltip never opens. Useful for disabling the tooltip
   * in expanded-sidebar mode without restructuring the component tree.
   */
  disabled?: boolean;
  side?: 'top' | 'right' | 'bottom' | 'left';
  sideOffset?: number;
  className?: string;
};

export function Tooltip({
  children,
  content,
  disabled,
  side = 'top',
  sideOffset = 6,
  className,
}: TooltipProps) {
  if (disabled || !isValidElement(children)) return <>{children}</>;

  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger render={children as ReactElement} />
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Positioner side={side} sideOffset={sideOffset}>
          <TooltipPrimitive.Popup
            className={cn(
              'z-50 rounded-md bg-foreground text-background font-inter text-xs px-2 py-1 shadow-md',
              'data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 transition-opacity duration-150',
              className,
            )}
          >
            {content}
          </TooltipPrimitive.Popup>
        </TooltipPrimitive.Positioner>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}
