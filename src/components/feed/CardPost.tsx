import { Link } from 'react-router-dom';
import { Image } from 'lucide-react';
import { cn } from '@/lib/utils';

type CardPostProps = {
  id: string;
  title: string;
  authorId: string;
  authorName: string;
  body: string;
  imageUrl?: string;
  className?: string;
};

export function CardPost({
  id,
  title,
  authorId,
  authorName,
  body,
  imageUrl,
  className,
}: CardPostProps) {
  const postHref = `/posts/${id}`;
  return (
    <article className={cn('flex flex-col gap-1.5 w-[200px] shrink-0', className)}>
      <Link
        to={postHref}
        aria-label={title}
        className="aspect-square bg-[#d5d5d5] rounded-[15px] overflow-hidden w-full flex items-center justify-center"
      >
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <Image size={32} className="text-gray-400" strokeWidth={1} />
        )}
      </Link>

      <div className="flex items-center justify-center gap-1 pb-0.5 font-inter font-normal text-[15px] text-black w-full">
        <span>By</span>
        <Link to={`/users/${authorId}`} className="hover:underline">
          {authorName}
        </Link>
      </div>

      <div className="px-1">
        <Link to={postHref} className="hover:underline">
          <h3 className="font-inter font-bold text-base text-black leading-normal">{title}</h3>
        </Link>
      </div>

      <div className="px-1">
        <p className="font-inter font-normal text-[13px] text-black leading-normal line-clamp-3">
          {body}
        </p>
      </div>
    </article>
  );
}
