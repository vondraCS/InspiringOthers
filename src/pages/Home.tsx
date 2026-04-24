import { useEffect } from 'react';
import { Newspaper } from 'lucide-react';
import { Post } from '@/components/feed/Post';
import { PostSkeleton } from '@/components/feed/PostSkeleton';
import { SectionHeader } from '@/components/feed/SectionHeader';
import { EmptyState } from '@/components/ui/empty-state';
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {Array.from({ length: 3 }).map((_, i) => (
              <PostSkeleton key={i} variant="featured" />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <EmptyState icon={Newspaper} title="No featured posts yet" description="Check back soon." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featured.slice(0, 3).map((post) => (
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
        )}
      </section>

      <section className="flex flex-col gap-[10px]">
        <SectionHeader title="Recommended Posts" seeMoreHref="/for-you" />
        {loadingRecommended && recommended.length === 0 ? (
          <div className="flex gap-10 justify-center flex-wrap">
            {Array.from({ length: 4 }).map((_, i) => (
              <PostSkeleton key={i} variant="compact" />
            ))}
          </div>
        ) : recommended.length === 0 ? (
          <EmptyState icon={Newspaper} title="No recommended posts yet" />
        ) : (
          <div className="flex gap-10 justify-center flex-wrap">
            {recommended.slice(0, 4).map((post) => (
              <Post
                key={post.id}
                variant="compact"
                id={post.id}
                title={post.title}
                authorId={post.author.id}
                authorName={post.author.fullName}
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
