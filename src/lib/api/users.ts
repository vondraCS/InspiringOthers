import { type User } from '@/types';

export async function getRecommendedUsers(): Promise<User[]> {
  const res = await fetch('/api/users/recommended');
  if (!res.ok) throw new Error('Failed to fetch recommended users');
  return res.json();
}

export async function getNearbyUsers(): Promise<User[]> {
  const res = await fetch('/api/users/nearby');
  if (!res.ok) throw new Error('Failed to fetch nearby users');
  return res.json();
}

export async function getCurrentUser(): Promise<User> {
  const res = await fetch('/api/auth/me');
  if (!res.ok) throw new Error('Failed to fetch current user');
  return res.json();
}
