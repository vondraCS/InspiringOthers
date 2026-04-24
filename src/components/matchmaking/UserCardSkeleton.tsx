import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export function UserCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-2 w-[200px] shrink-0 p-3 border border-border-subtle rounded-2xl',
        className,
      )}
    >
      <Skeleton className="w-20 h-20 rounded-full" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-3 w-16" />
      <Skeleton className="h-3 w-20" />
      <div className="flex gap-1 pt-0.5">
        <Skeleton className="h-4 w-12 rounded-full" />
        <Skeleton className="h-4 w-14 rounded-full" />
      </div>
    </div>
  );
}
