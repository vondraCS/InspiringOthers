import { type PostWithAuthor } from '@/types';

export async function getFeaturedPosts(): Promise<PostWithAuthor[]> {
  const res = await fetch('/api/posts/feed');
  if (!res.ok) throw new Error('Failed to fetch featured posts');
  return res.json();
}

export async function getRecommendedPosts(): Promise<PostWithAuthor[]> {
  const res = await fetch('/api/posts/recommended');
  if (!res.ok) throw new Error('Failed to fetch recommended posts');
  return res.json();
}

export async function getForYouPosts(): Promise<PostWithAuthor[]> {
  const res = await fetch('/api/posts/for-you');
  if (!res.ok) throw new Error('Failed to fetch for-you posts');
  return res.json();
}

export async function getPost(id: string): Promise<PostWithAuthor> {
  const res = await fetch(`/api/posts/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch post ${id}`);
  return res.json();
}
