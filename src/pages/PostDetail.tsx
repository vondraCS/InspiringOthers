import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Image as ImageIcon } from 'lucide-react';
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

  return (
    <div className="px-[45px] pt-[55px] pb-10 flex flex-col gap-6 max-w-4xl">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 self-start font-inter text-base text-black hover:underline cursor-pointer"
      >
        <ArrowLeft size={20} strokeWidth={1.75} />
        <span>Back</span>
      </button>

      {loading && !post ? (
        <p className="font-inter text-base text-black">Loading...</p>
      ) : error && !post ? (
        <p className="font-inter text-base text-black">Couldn't load this post.</p>
      ) : !post ? (
        <p className="font-inter text-base text-black">Post not found.</p>
      ) : (
        <article className="flex flex-col gap-5">
          <h1 className="font-raleway font-bold text-[42px] text-black leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-1 font-inter text-lg text-black">
            <span>By</span>
            <Link to={`/users/${post.author.id}`} className="hover:underline">
              {post.author.name}
            </Link>
          </div>

          <div className="w-full aspect-[16/9] bg-[#d5d5d5] rounded-[15px] overflow-hidden flex items-center justify-center">
            {post.coverImage ? (
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <ImageIcon size={64} className="text-gray-400" strokeWidth={1} />
            )}
          </div>

          <div className="flex flex-col gap-4 font-inter text-base text-black leading-relaxed whitespace-pre-wrap">
            {post.body}
          </div>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-inter text-sm text-black border border-black rounded-full px-3 py-1"
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
