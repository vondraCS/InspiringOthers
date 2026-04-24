import { useEffect, useMemo, useState } from 'react';
import { Newspaper, Users } from 'lucide-react';
import { Post } from '@/components/feed/Post';
import { PostSkeleton } from '@/components/feed/PostSkeleton';
import { SectionHeader } from '@/components/feed/SectionHeader';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { UserList } from '@/components/matchmaking/UserList';
import { UserCardSkeleton } from '@/components/matchmaking/UserCardSkeleton';
import { MatchmakingFilters } from '@/components/matchmaking/MatchmakingFilters';
import { useFeedStore } from '@/store/feedStore';
import { useMatchmakingStore, applyMatchmakingFilters } from '@/store/matchmakingStore';
import { useAuthStore } from '@/store/authStore';

const PAGE_SIZE = 20;

export default function ForYou() {
  const forYou = useFeedStore((s) => s.forYou);
  const loadingForYou = useFeedStore((s) => s.loadingForYou);
  const loadForYou = useFeedStore((s) => s.loadForYou);

  const recommendedUsers = useMatchmakingStore((s) => s.recommendedUsers);
  const loadingRecommended = useMatchmakingStore((s) => s.loadingRecommended);
  const loadRecommended = useMatchmakingStore((s) => s.loadRecommended);
  const filters = useMatchmakingStore((s) => s.filters);
  const currentUser = useAuthStore((s) => s.currentUser);

  const [visible, setVisible] = useState(PAGE_SIZE);

  useEffect(() => {
    if (forYou.length === 0) loadForYou();
    if (recommendedUsers.length === 0) loadRecommended();
  }, [forYou.length, recommendedUsers.length, loadForYou, loadRecommended]);

  const availableInterests = useMemo(() => {
    const set = new Set<string>();
    recommendedUsers.forEach((u) => u.interests.forEach((i) => set.add(i)));
    return Array.from(set).sort();
  }, [recommendedUsers]);

  const shownUsers = useMemo(
    () => applyMatchmakingFilters(recommendedUsers, filters, currentUser),
    [recommendedUsers, filters, currentUser],
  );

  const shownPosts = forYou.slice(0, visible);
  const hasMore = forYou.length > visible;

  return (
    <div className="px-[45px] pt-[55px] pb-10 flex flex-col gap-[25px]">
      <section className="flex flex-col gap-[10px]">
        <SectionHeader title="People you might connect with" seeMoreHref="/people" />
        <MatchmakingFilters availableInterests={availableInterests} />
        {loadingRecommended && recommendedUsers.length === 0 ? (
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
          <UserList users={shownUsers.slice(0, 8)} layout="row" />
        )}
      </section>

      <section className="flex flex-col gap-[10px]">
        <SectionHeader title="Posts for you" />
        {loadingForYou && forYou.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {Array.from({ length: 6 }).map((_, i) => (
              <PostSkeleton key={i} variant="featured" />
            ))}
          </div>
        ) : forYou.length === 0 ? (
          <EmptyState icon={Newspaper} title="No posts yet" description="Your For You feed will populate as you follow more peers." />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {shownPosts.map((post) => (
                <Post
                  key={post.id}
                  variant="featured"
                  id={post.id}
                  title={post.title}
                  authorId={post.author.id}
                  authorName={post.author.fullName}
                  body={post.body}
                  imageUrl={post.coverImage}
                  tags={post.tags}
                />
              ))}
            </div>
            {hasMore && (
              <div className="flex justify-center pt-4">
                <Button variant="outline" size="lg" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                  Load More
                </Button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
