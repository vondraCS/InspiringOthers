import { useEffect, useMemo, useState } from 'react';
import { PostCard } from '@/components/feed/PostCard';
import { SectionHeader } from '@/components/feed/SectionHeader';
import { UserList } from '@/components/matchmaking/UserList';
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
          <p className="font-inter text-base text-black">Loading...</p>
        ) : shownUsers.length === 0 ? (
          <p className="font-inter text-base text-black">No peers match these filters.</p>
        ) : (
          <UserList users={shownUsers.slice(0, 8)} layout="row" />
        )}
      </section>

      <section className="flex flex-col gap-[10px]">
        <SectionHeader title="Posts for you" />
        {loadingForYou && forYou.length === 0 ? (
          <p className="font-inter text-base text-black">Loading...</p>
        ) : forYou.length === 0 ? (
          <p className="font-inter text-base text-black">No posts yet.</p>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-10">
              {shownPosts.map((post) => (
                <PostCard
                  key={post.id}
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
                <button
                  type="button"
                  onClick={() => setVisible((v) => v + PAGE_SIZE)}
                  className="font-inter text-base text-black border border-black rounded-full px-5 py-2 hover:bg-black/5 cursor-pointer"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
