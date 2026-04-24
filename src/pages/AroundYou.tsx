import { useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { CalendarDays, MapPin, Users, Calendar } from 'lucide-react';
import { SectionHeader } from '@/components/feed/SectionHeader';
import { UserList } from '@/components/matchmaking/UserList';
import { UserCardSkeleton } from '@/components/matchmaking/UserCardSkeleton';
import { MatchmakingFilters } from '@/components/matchmaking/MatchmakingFilters';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { useMatchmakingStore, applyMatchmakingFilters } from '@/store/matchmakingStore';
import { useEventsStore } from '@/store/eventsStore';
import { useAuthStore } from '@/store/authStore';

export default function AroundYou() {
  const nearbyUsers = useMatchmakingStore((s) => s.nearbyUsers);
  const loadingNearby = useMatchmakingStore((s) => s.loadingNearby);
  const loadNearby = useMatchmakingStore((s) => s.loadNearby);
  const filters = useMatchmakingStore((s) => s.filters);
  const currentUser = useAuthStore((s) => s.currentUser);

  const localEvents = useEventsStore((s) => s.localEvents);
  const loadingEvents = useEventsStore((s) => s.loadingLocal);
  const loadLocal = useEventsStore((s) => s.loadLocal);

  useEffect(() => {
    if (nearbyUsers.length === 0) loadNearby();
    if (localEvents.length === 0) loadLocal();
  }, [nearbyUsers.length, localEvents.length, loadNearby, loadLocal]);

  const availableInterests = useMemo(() => {
    const set = new Set<string>();
    nearbyUsers.forEach((u) => u.interests.forEach((i) => set.add(i)));
    return Array.from(set).sort();
  }, [nearbyUsers]);

  const shownUsers = useMemo(
    () => applyMatchmakingFilters(nearbyUsers, filters, currentUser),
    [nearbyUsers, filters, currentUser],
  );

  return (
    <div className="px-[45px] pt-[55px] pb-10 flex flex-col gap-[25px]">
      <section className="flex flex-col gap-[10px]">
        <SectionHeader title="Nearby peers" />
        <MatchmakingFilters availableInterests={availableInterests} />
        {loadingNearby && nearbyUsers.length === 0 ? (
          <div className="flex gap-6 flex-wrap">
            {Array.from({ length: 6 }).map((_, i) => (
              <UserCardSkeleton key={i} />
            ))}
          </div>
        ) : shownUsers.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No peers match these filters"
            description="Try removing a filter to see more people."
          />
        ) : (
          <UserList users={shownUsers} layout="row" />
        )}
      </section>

      <section className="flex flex-col gap-[10px]">
        <SectionHeader title="Local events" />
        {loadingEvents && localEvents.length === 0 ? (
          <ul className="flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <li
                key={i}
                className="flex flex-col gap-2 p-4 border border-border-subtle rounded-2xl"
              >
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
              </li>
            ))}
          </ul>
        ) : localEvents.length === 0 ? (
          <EmptyState icon={Calendar} title="No local events yet" description="Events near you will appear here." />
        ) : (
          <ul className="flex flex-col gap-3">
            {localEvents.map((event) => (
              <li
                key={event.id}
                className="flex flex-col gap-1 p-4 border border-border-subtle rounded-2xl bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card"
              >
                <h3 className="font-inter font-bold text-lg text-foreground">{event.title}</h3>
                <div className="flex flex-wrap gap-x-4 gap-y-1 font-inter text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <CalendarDays size={14} strokeWidth={1.5} />
                    {format(new Date(event.date), 'EEE, MMM d · h:mm a')}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={14} strokeWidth={1.5} />
                    {event.location}
                  </span>
                </div>
                <p className="font-inter text-sm text-foreground/80 pt-0.5">{event.description}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
