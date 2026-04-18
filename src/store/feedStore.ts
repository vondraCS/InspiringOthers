import { create } from 'zustand';
import { type PostWithAuthor } from '@/types';
import { getFeaturedPosts, getRecommendedPosts, getForYouPosts, getPost } from '@/lib/api/posts';
import { toast } from '@/components/ui/toast';

interface FeedState {
  featured: PostWithAuthor[];
  recommended: PostWithAuthor[];
  forYou: PostWithAuthor[];
  postsById: Record<string, PostWithAuthor>;
  loadingFeatured: boolean;
  loadingRecommended: boolean;
  loadingForYou: boolean;
  loadingPostById: Record<string, boolean>;
  errorFeatured: string | null;
  errorRecommended: string | null;
  errorForYou: string | null;
  errorPostById: Record<string, string | null>;
  loadFeatured: () => Promise<void>;
  loadRecommended: () => Promise<void>;
  loadForYou: () => Promise<void>;
  loadPost: (id: string) => Promise<void>;
}

export const useFeedStore = create<FeedState>((set, get) => ({
  featured: [],
  recommended: [],
  forYou: [],
  postsById: {},
  loadingFeatured: false,
  loadingRecommended: false,
  loadingForYou: false,
  loadingPostById: {},
  errorFeatured: null,
  errorRecommended: null,
  errorForYou: null,
  errorPostById: {},

  loadFeatured: async () => {
    set({ loadingFeatured: true, errorFeatured: null });
    try {
      const posts = await getFeaturedPosts();
      const byId = Object.fromEntries(posts.map((p) => [p.id, p]));
      set((s) => ({
        featured: posts,
        postsById: { ...s.postsById, ...byId },
        loadingFeatured: false,
      }));
    } catch (err) {
      const message = (err as Error).message;
      set({ errorFeatured: message, loadingFeatured: false });
      toast.error({ title: 'Could not load featured posts', description: message });
    }
  },

  loadRecommended: async () => {
    set({ loadingRecommended: true, errorRecommended: null });
    try {
      const posts = await getRecommendedPosts();
      const byId = Object.fromEntries(posts.map((p) => [p.id, p]));
      set((s) => ({
        recommended: posts,
        postsById: { ...s.postsById, ...byId },
        loadingRecommended: false,
      }));
    } catch (err) {
      const message = (err as Error).message;
      set({ errorRecommended: message, loadingRecommended: false });
      toast.error({ title: 'Could not load recommended posts', description: message });
    }
  },

  loadForYou: async () => {
    set({ loadingForYou: true, errorForYou: null });
    try {
      const posts = await getForYouPosts();
      const byId = Object.fromEntries(posts.map((p) => [p.id, p]));
      set((s) => ({
        forYou: posts,
        postsById: { ...s.postsById, ...byId },
        loadingForYou: false,
      }));
    } catch (err) {
      const message = (err as Error).message;
      set({ errorForYou: message, loadingForYou: false });
      toast.error({ title: 'Could not load posts for you', description: message });
    }
  },

  loadPost: async (id) => {
    if (get().postsById[id] || get().loadingPostById[id]) return;
    set((s) => ({
      loadingPostById: { ...s.loadingPostById, [id]: true },
      errorPostById: { ...s.errorPostById, [id]: null },
    }));
    try {
      const post = await getPost(id);
      set((s) => ({
        postsById: { ...s.postsById, [post.id]: post },
        loadingPostById: { ...s.loadingPostById, [id]: false },
      }));
    } catch (err) {
      const message = (err as Error).message;
      set((s) => ({
        loadingPostById: { ...s.loadingPostById, [id]: false },
        errorPostById: { ...s.errorPostById, [id]: message },
      }));
      toast.error({ title: 'Could not load post', description: message });
    }
  },
}));
