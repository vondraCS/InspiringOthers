import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserStore } from '@/store/userStore';

export default function UserProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const user = useUserStore((s) => (id ? s.usersById[id] : undefined));
  const loading = useUserStore((s) => (id ? s.loadingById[id] : false));
  const error = useUserStore((s) => (id ? s.errorById[id] : null));
  const loadUser = useUserStore((s) => s.loadUser);

  useEffect(() => {
    if (id) loadUser(id);
  }, [id, loadUser]);

  if (!id) {
    return <div className="px-[45px] pt-[55px] font-inter text-base">Missing user id.</div>;
  }

  return (
    <div className="px-[45px] pt-[55px] pb-10 flex flex-col gap-6 max-w-4xl">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="self-start">
        <ArrowLeft size={16} strokeWidth={2} />
        Back
      </Button>

      {loading && !user ? (
        <>
          <header className="flex items-center gap-5">
            <Skeleton className="w-24 h-24 rounded-full" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-40" />
            </div>
          </header>
          <Skeleton className="h-5 w-32" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-7 w-20 rounded-full" />
            ))}
          </div>
        </>
      ) : error && !user ? (
        <p className="font-inter text-base text-foreground">Could not load this user.</p>
      ) : !user ? (
        <p className="font-inter text-base text-foreground">User not found.</p>
      ) : (
        <>
          <header className="flex items-center gap-5">
            <img
              src={user.avatar}
              alt={user.fullName}
              className="w-24 h-24 rounded-full object-cover bg-image-placeholder ring-4 ring-primary/10 shrink-0"
            />
            <div className="flex flex-col gap-1">
              <h1 className="font-raleway font-bold text-3xl text-foreground">{user.fullName}</h1>
              <p className="font-inter text-sm text-muted-foreground">@{user.username}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1 font-inter text-sm text-muted-foreground">
                  <MapPin size={14} strokeWidth={1.5} />
                  {user.location}
                </span>
              </div>
            </div>
          </header>

          <section className="flex flex-col gap-2">
            <h2 className="font-raleway font-bold text-xl text-foreground">Interests</h2>
            {user.interests.length === 0 ? (
              <p className="font-inter text-sm text-muted-foreground">No interests listed.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {user.interests.map((interest) => (
                  <span
                    key={interest}
                    className="font-inter text-sm text-muted-foreground bg-muted rounded-full px-3 py-1"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            )}
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="font-raleway font-bold text-xl text-foreground">Goals</h2>
            {user.goals.length === 0 ? (
              <p className="font-inter text-sm text-muted-foreground">No goals listed.</p>
            ) : (
              <ul className="flex flex-col gap-1.5">
                {user.goals.map((goal) => (
                  <li
                    key={goal}
                    className="font-inter text-base text-foreground/80 pl-4 border-l-2 border-primary"
                  >
                    {goal}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
