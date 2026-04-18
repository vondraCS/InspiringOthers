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
      <h2 className="font-raleway font-bold text-[36px] text-black leading-normal">{title}</h2>
      {seeMoreHref && (
        <Link
          to={seeMoreHref}
          className="flex items-center gap-0.5 border-b border-black pb-0.5 hover:opacity-70 transition-opacity"
        >
          <span className="font-inter font-light text-base text-black">{seeMoreLabel}</span>
          <ArrowRight size={24} strokeWidth={1.5} />
        </Link>
      )}
    </div>
  );
}
