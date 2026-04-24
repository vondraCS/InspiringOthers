import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

type UserCardProps = {
  id: string;
  fullName: string;
  username: string;
  avatar: string;
  interests: string[];
  location: string;
  className?: string;
};

export function UserCard({
  id,
  fullName,
  username,
  avatar,
  interests,
  location,
  className,
}: UserCardProps) {
  const profileHref = `/users/${id}`;
  return (
    <article
      className={cn(
        'flex flex-col items-center gap-2 w-[200px] shrink-0 p-3 border border-border-subtle rounded-2xl bg-card',
        'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card',
        className,
      )}
    >
      <Link to={profileHref} aria-label={fullName} className="shrink-0">
        <img
          src={avatar}
          alt={fullName}
          className="w-20 h-20 rounded-full object-cover bg-image-placeholder ring-1 ring-border-subtle"
        />
      </Link>

      <Link to={profileHref} className="hover:underline text-center">
        <h3 className="font-inter font-bold text-base text-foreground leading-tight">{fullName}</h3>
      </Link>

      <span className="font-inter text-xs text-muted-foreground leading-tight">@{username}</span>

      <div className="flex items-center gap-1 text-muted-foreground">
        <MapPin size={12} strokeWidth={1.5} />
        <span className="font-inter text-[12px] leading-tight text-center line-clamp-1">
          {location}
        </span>
      </div>

      {interests.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1 pt-0.5">
          {interests.slice(0, 3).map((interest) => (
            <span
              key={interest}
              className="font-inter text-[11px] text-muted-foreground bg-muted rounded-full px-2 py-0.5"
            >
              {interest}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
