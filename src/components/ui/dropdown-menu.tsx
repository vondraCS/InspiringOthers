import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import { cn } from '@/lib/utils';

export const DropdownMenu = MenuPrimitive.Root;
export const DropdownMenuTrigger = MenuPrimitive.Trigger;

type ContentProps = {
  className?: string;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
};

export function DropdownMenuContent({
  className,
  children,
  side = 'bottom',
  align = 'end',
  sideOffset = 6,
}: ContentProps) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner side={side} align={align} sideOffset={sideOffset}>
        <MenuPrimitive.Popup
          className={cn(
            'z-50 min-w-[160px] rounded-xl border border-border bg-popover text-popover-foreground shadow-card-hover p-1',
            'data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 transition-opacity duration-150',
            className,
          )}
        >
          {children}
        </MenuPrimitive.Popup>
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

type ItemProps = {
  className?: string;
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  disabled?: boolean;
};

export function DropdownMenuItem({ className, children, onClick, disabled }: ItemProps) {
  return (
    <MenuPrimitive.Item
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 rounded-md px-3 py-1.5 font-inter text-sm text-foreground cursor-pointer select-none',
        'data-[highlighted]:bg-muted data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed',
        'outline-none',
        className,
      )}
    >
      {children}
    </MenuPrimitive.Item>
  );
}
