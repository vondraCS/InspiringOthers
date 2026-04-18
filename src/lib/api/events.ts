import { type LocalEvent } from '@/types';

export async function getLocalEvents(): Promise<LocalEvent[]> {
  const res = await fetch('/api/events/local');
  if (!res.ok) throw new Error('Failed to fetch local events');
  return res.json();
}
