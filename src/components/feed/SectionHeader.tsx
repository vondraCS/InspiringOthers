import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type SectionHeaderProps = {
  title: string;
  seeMoreHref?: string;
  seeMoreLabel?: string;
  className?: string;
};

export function SectionHeader({
  title,
  seeMoreHref,
  seeMoreLabel = 'See More',
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      <h2 className="font-raleway font-bold text-heading text-foreground">{title}</h2>
      {seeMoreHref && (
        <Link
          to={seeMoreHref}
          className="group flex items-center gap-1 text-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 rounded-sm"
        >
          <span className="relative font-inter font-light text-base pb-0.5">
            {seeMoreLabel}
            <span
              aria-hidden="true"
              className="absolute left-0 bottom-0 h-px w-full bg-current origin-left transition-transform duration-200 scale-x-0 group-hover:scale-x-100"
            />
          </span>
          <ArrowRight size={20} strokeWidth={1.5} />
        </Link>
      )}
    </div>
  );
}
