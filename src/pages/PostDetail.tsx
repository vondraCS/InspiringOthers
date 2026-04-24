import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useFeedStore } from '@/store/feedStore';

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const post = useFeedStore((s) => (id ? s.postsById[id] : undefined));
  const loading = useFeedStore((s) => (id ? s.loadingPostById[id] : false));
  const error = useFeedStore((s) => (id ? s.errorPostById[id] : null));
  const loadPost = useFeedStore((s) => s.loadPost);

  useEffect(() => {
    if (id) loadPost(id);
  }, [id, loadPost]);

  const paragraphs = post ? post.body.split(/\n\s*\n/).filter((p) => p.trim().length > 0) : [];

  return (
    <div className="px-[45px] pt-[55px] pb-10 flex flex-col gap-6 max-w-4xl mx-auto w-full">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        className="self-start"
      >
        <ArrowLeft size={16} strokeWidth={1.75} />
        Back
      </Button>

      {loading && !post ? (
        <article className="flex flex-col gap-5">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-5 w-40" />
          <Skeleton className="aspect-[16/9] w-full rounded-2xl" />
          <div className="flex flex-col gap-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-5/6" />
          </div>
        </article>
      ) : error && !post ? (
        <p className="font-inter text-base text-foreground">Couldn't load this post.</p>
      ) : !post ? (
        <p className="font-inter text-base text-foreground">Post not found.</p>
      ) : (
        <article className="flex flex-col gap-5">
          <h1 className="font-raleway font-bold text-display text-foreground">
            {post.title}
          </h1>

          <div className="flex items-center gap-1 font-inter text-lg text-muted-foreground">
            <span>By</span>
            <Link to={`/users/${post.author.id}`} className="text-foreground hover:underline">
              {post.author.fullName}
            </Link>
          </div>

          <div className="w-full aspect-[16/9] bg-image-placeholder rounded-2xl overflow-hidden flex items-center justify-center">
            {post.coverImage ? (
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <ImageIcon size={64} className="text-muted-foreground" strokeWidth={1} />
            )}
          </div>

          <div className="max-w-prose flex flex-col gap-5 font-inter text-lg text-foreground leading-relaxed">
            {paragraphs.length > 0
              ? paragraphs.map((p, i) => (
                  <p key={i} className="whitespace-pre-wrap">
                    {p}
                  </p>
                ))
              : (
                  <p className="whitespace-pre-wrap">{post.body}</p>
                )}
          </div>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-inter text-sm text-muted-foreground bg-muted rounded-full px-3 py-1"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </article>
      )}
    </div>
  );
}
