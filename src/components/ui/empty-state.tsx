import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  className?: string;
};

export function EmptyState({ icon: Icon, title, description, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 py-10 px-4 text-center',
        className,
      )}
    >
      {Icon && (
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted text-muted-foreground">
          <Icon size={22} strokeWidth={1.75} />
        </div>
      )}
      <h3 className="font-inter font-semibold text-base text-foreground">{title}</h3>
      {description && (
        <p className="font-inter text-sm text-muted-foreground max-w-sm">{description}</p>
      )}
    </div>
  );
}
