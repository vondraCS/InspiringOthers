import { create } from 'zustand';
import { type LocalEvent } from '@/types';
import { getLocalEvents } from '@/lib/api/events';
import { toast } from '@/components/ui/toast';

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
      const message = (err as Error).message;
      set({ error: message, loadingLocal: false });
      toast.error({ title: 'Could not load local events', description: message });
    }
  },
}));
