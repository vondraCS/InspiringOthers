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
      className="absolute inset-0 z-10 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
    />
  );

  if (variant === 'compact') {
    return (
      <article
        className={cn(
          'group relative flex flex-col gap-1.5 w-[200px] shrink-0 rounded-2xl pt-3 pb-4',
          'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover',
          className,
        )}
      >
        <div className="px-3">
          <div className="aspect-square bg-image-placeholder rounded-2xl overflow-hidden w-full flex items-center justify-center">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
            ) : (
              <Image size={32} className="text-muted-foreground" strokeWidth={1} />
            )}
          </div>
        </div>

        <div className="flex items-center justify-center gap-1 pb-0.5 font-inter font-normal text-[15px] text-foreground w-full">
          <span>By</span>
          <Link to={`/users/${authorId}`} className="relative z-20 hover:underline">
            {authorName}
          </Link>
        </div>

        <div className="px-3">
          <h3 className="font-inter font-bold text-base text-foreground leading-normal transition-colors group-hover:text-primary">
            {title}
          </h3>
        </div>

        <div className="px-3">
          <p className="font-inter font-normal text-[13px] text-foreground/80 leading-normal line-clamp-3">
            {body}
          </p>
        </div>

        {stretchedLink}
      </article>
    );
  }

  return (
    <article
      className={cn(
        'group relative flex flex-col gap-2.5 min-w-0 rounded-2xl pt-4 pb-5',
        'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover',
        className,
      )}
    >
      <div className="px-5">
        <h2 className="font-inter font-bold text-xl text-foreground leading-normal line-clamp-2 min-h-[3.5rem] transition-colors group-hover:text-primary">
          {title}
        </h2>
      </div>

      <div className="px-5">
      <div className="aspect-[4/3] bg-image-placeholder rounded-2xl overflow-hidden w-full flex items-center justify-center shrink-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <Image size={48} className="text-muted-foreground" strokeWidth={1} />
        )}
      </div>
      </div>

      <div className="flex items-center gap-1 pl-5 pb-1 font-inter font-normal text-xl text-foreground">
        <span>By</span>
        <Link to={`/users/${authorId}`} className="relative z-20 hover:underline">
          {authorName}
        </Link>
      </div>

      <div className="px-5">
        <p className="font-inter font-normal text-base text-foreground/80 leading-normal line-clamp-5">
          {body}
        </p>
      </div>

      {tags && tags.length > 0 && (
        <div className="px-5 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="font-inter text-xs text-muted-foreground bg-muted rounded-full px-2 py-0.5"
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
