import { Link } from 'react-router-dom';
import { Image } from 'lucide-react';
import { cn } from '@/lib/utils';

type PostCardProps = {
  id: string;
  title: string;
  authorId: string;
  authorName: string;
  body: string;
  imageUrl?: string;
  tags?: string[];
  className?: string;
};

export function PostCard({
  id,
  title,
  authorId,
  authorName,
  body,
  imageUrl,
  tags,
  className,
}: PostCardProps) {
  const postHref = `/posts/${id}`;
  return (
    <article className={cn('flex flex-col gap-2.5 min-w-0', className)}>
      <div className="px-2.5">
        <Link to={postHref} className="hover:underline">
          <h2 className="font-inter font-bold text-xl text-black leading-normal">{title}</h2>
        </Link>
      </div>

      <Link
        to={postHref}
        aria-label={title}
        className="aspect-[4/3] bg-[#d5d5d5] rounded-[15px] overflow-hidden w-full flex items-center justify-center shrink-0"
      >
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <Image size={48} className="text-gray-400" strokeWidth={1} />
        )}
      </Link>

      <div className="flex items-center gap-1 pl-2.5 pb-1 font-inter font-normal text-xl text-black">
        <span>By</span>
        <Link to={`/users/${authorId}`} className="hover:underline">
          {authorName}
        </Link>
      </div>

      <div className="px-2.5">
        <p className="font-inter font-normal text-base text-black leading-normal line-clamp-5">
          {body}{' '}
          <Link to={postHref} className="font-medium hover:underline">
            Read More
          </Link>
        </p>
      </div>

      {tags && tags.length > 0 && (
        <div className="px-2.5 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="font-inter text-xs text-black/70 border border-black/20 rounded-full px-2 py-0.5"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
