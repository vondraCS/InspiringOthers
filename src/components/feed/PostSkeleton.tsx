import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type PostSkeletonProps = {
  variant?: 'featured' | 'compact';
  className?: string;
};

export function PostSkeleton({ variant = 'featured', className }: PostSkeletonProps) {
  if (variant === 'compact') {
    return (
      <div className={cn('flex flex-col gap-1.5 w-[200px] shrink-0', className)}>
        <Skeleton className="aspect-square rounded-2xl w-full" />
        <Skeleton className="h-4 w-24 mx-auto mt-1" />
        <Skeleton className="h-4 w-5/6 mx-1" />
        <Skeleton className="h-3 w-full mx-1" />
        <Skeleton className="h-3 w-4/5 mx-1" />
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col gap-2.5 min-w-0', className)}>
      <div className="px-2.5 flex flex-col gap-1.5 min-h-[3.5rem]">
        <Skeleton className="h-6 w-4/5" />
        <Skeleton className="h-6 w-3/5" />
      </div>
      <Skeleton className="aspect-[4/3] rounded-2xl w-full" />
      <Skeleton className="h-5 w-40 ml-2.5" />
      <div className="px-2.5 flex flex-col gap-1.5">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}
