import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { type SkillLevel } from '@/types';

type UserCardProps = {
  id: string;
  name: string;
  avatar: string;
  skillLevel: SkillLevel;
  interests: string[];
  location: string;
  className?: string;
};

export function UserCard({
  id,
  name,
  avatar,
  skillLevel,
  interests,
  location,
  className,
}: UserCardProps) {
  const profileHref = `/users/${id}`;
  return (
    <article
      className={cn(
        'flex flex-col items-center gap-2 w-[200px] shrink-0 p-3 border border-black/15 rounded-[15px]',
        className,
      )}
    >
      <Link to={profileHref} aria-label={name} className="shrink-0">
        <img
          src={avatar}
          alt={name}
          className="w-20 h-20 rounded-full object-cover bg-[#d5d5d5]"
        />
      </Link>

      <Link to={profileHref} className="hover:underline text-center">
        <h3 className="font-inter font-bold text-base text-black leading-tight">{name}</h3>
      </Link>

      <span className="font-inter text-xs text-black/80 border border-black/20 rounded-full px-2 py-0.5 capitalize">
        {skillLevel}
      </span>

      <div className="flex items-center gap-1 text-black/70">
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
              className="font-inter text-[11px] text-black/70 border border-black/15 rounded-full px-1.5 py-0.5"
            >
              {interest}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
