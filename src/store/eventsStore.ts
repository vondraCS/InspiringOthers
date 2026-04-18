import { create } from 'zustand';
import { type LocalEvent } from '@/types';
import { getLocalEvents } from '@/lib/api/events';

interface EventsState {
  localEvents: LocalEvent[];
  loadingLocal: boolean;
  error: string | null;
  loadLocal: () => Promise<void>;
}

export const useEventsStore = create<EventsState>((set) => ({
  localEvents: [],
  loadingLocal: false,
  error: null,

  loadLocal: async () => {
    set({ loadingLocal: true, error: null });
    try {
      const events = await getLocalEvents();
      set({ localEvents: events, loadingLocal: false });
    } catch (err) {
      set({ error: (err as Error).message, loadingLocal: false });
    }
  },
}));
