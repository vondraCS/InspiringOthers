import { Link } from 'react-router-dom';
import { Image } from 'lucide-react';
import { cn } from '@/lib/utils';

type PostVariant = 'featured' | 'compact';

type PostProps = {
  id: string;
  title: string;
  authorId: string;
  authorName: string;
  body: string;
  imageUrl?: string;
  tags?: string[];
  variant?: PostVariant;
  className?: string;
};

export function Post({
  id,
  title,
  authorId,
  authorName,
  body,
  imageUrl,
  tags,
  variant = 'featured',
  className,
}: PostProps) {
  const postHref = `/posts/${id}`;

  // Stretched-link overlay: an absolutely positioned link sits ON TOP of the
  // card content (z-10), so any click on the card hits the link and navigates
  // to the post. The byline link is lifted to z-20 so it sits above the
  // overlay and routes to the author profile instead. Both links are siblings,
  // never nested, so we never produce invalid <a> inside <a>.
  const stretchedLink = (
    <Link
      to={postHref}
      aria-label={title}
      className="absolute inset-0 z-10 rounded-[15px]"
    />
  );

  if (variant === 'compact') {
    return (
      <article className={cn('relative flex flex-col gap-1.5 w-[200px] shrink-0', className)}>
        <div className="aspect-square bg-[#d5d5d5] rounded-[15px] overflow-hidden w-full flex items-center justify-center">
          {imageUrl ? (
            <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
          ) : (
            <Image size={32} className="text-gray-400" strokeWidth={1} />
          )}
        </div>

        <div className="flex items-center justify-center gap-1 pb-0.5 font-inter font-normal text-[15px] text-black w-full">
          <span>By</span>
          <Link to={`/users/${authorId}`} className="relative z-20 hover:underline">
            {authorName}
          </Link>
        </div>

        <div className="px-1">
          <h3 className="font-inter font-bold text-base text-black leading-normal">{title}</h3>
        </div>

        <div className="px-1">
          <p className="font-inter font-normal text-[13px] text-black leading-normal line-clamp-3">
            {body}
          </p>
        </div>

        {stretchedLink}
      </article>
    );
  }

  return (
    <article className={cn('relative flex flex-col gap-2.5 min-w-0', className)}>
      <div className="px-2.5">
        <h2 className="font-inter font-bold text-xl text-black leading-normal line-clamp-2 min-h-[3.5rem]">
          {title}
        </h2>
      </div>

      <div className="aspect-[4/3] bg-[#d5d5d5] rounded-[15px] overflow-hidden w-full flex items-center justify-center shrink-0">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <Image size={48} className="text-gray-400" strokeWidth={1} />
        )}
      </div>

      <div className="flex items-center gap-1 pl-2.5 pb-1 font-inter font-normal text-xl text-black">
        <span>By</span>
        <Link to={`/users/${authorId}`} className="relative z-20 hover:underline">
          {authorName}
        </Link>
      </div>

      <div className="px-2.5">
        <p className="font-inter font-normal text-base text-black leading-normal line-clamp-5">
          {body}
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

      {stretchedLink}
    </article>
  );
}
