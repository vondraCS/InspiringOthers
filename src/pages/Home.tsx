import { useEffect } from 'react';
import { PostCard } from '@/components/feed/PostCard';
import { CardPost } from '@/components/feed/CardPost';
import { SectionHeader } from '@/components/feed/SectionHeader';
import { useFeedStore } from '@/store/feedStore';

export default function Home() {
  const featured = useFeedStore((s) => s.featured);
  const recommended = useFeedStore((s) => s.recommended);
  const loadingFeatured = useFeedStore((s) => s.loadingFeatured);
  const loadingRecommended = useFeedStore((s) => s.loadingRecommended);
  const loadFeatured = useFeedStore((s) => s.loadFeatured);
  const loadRecommended = useFeedStore((s) => s.loadRecommended);

  useEffect(() => {
    if (featured.length === 0) loadFeatured();
    if (recommended.length === 0) loadRecommended();
  }, [featured.length, recommended.length, loadFeatured, loadRecommended]);

  return (
    <div className="px-[45px] pt-[55px] pb-10 flex flex-col gap-[25px]">
      <section className="flex flex-col gap-[10px]">
        <SectionHeader title="Featured Posts" />
        {loadingFeatured && featured.length === 0 ? (
          <p className="font-inter text-base text-black">Loading...</p>
        ) : featured.length === 0 ? (
          <p className="font-inter text-base text-black">No posts yet.</p>
        ) : (
          <div className="grid grid-cols-3 gap-10">
            {featured.slice(0, 3).map((post) => (
              <PostCard
                key={post.id}
                id={post.id}
                title={post.title}
                authorId={post.author.id}
                authorName={post.author.name}
                body={post.body}
                imageUrl={post.coverImage}
                tags={post.tags}
              />
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-[10px]">
        <SectionHeader title="Recommended Posts" seeMoreHref="/for-you" />
        {loadingRecommended && recommended.length === 0 ? (
          <p className="font-inter text-base text-black">Loading...</p>
        ) : recommended.length === 0 ? (
          <p className="font-inter text-base text-black">No posts yet.</p>
        ) : (
          <div className="flex gap-10 justify-center flex-wrap">
            {recommended.slice(0, 4).map((post) => (
              <CardPost
                key={post.id}
                id={post.id}
                title={post.title}
                authorId={post.author.id}
                authorName={post.author.name}
                body={post.body}
                imageUrl={post.coverImage}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
