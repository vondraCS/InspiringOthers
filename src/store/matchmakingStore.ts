import { create } from 'zustand';
import { type User } from '@/types';
import { getRecommendedUsers, getNearbyUsers } from '@/lib/api/users';
import { useAuthStore } from './authStore';
import { toast } from '@/components/ui/toast';

interface MatchmakingFilters {
  interests: string[];
  nearbyOnly: boolean;
}

interface MatchmakingState {
  recommendedUsers: User[];
  nearbyUsers: User[];
  filters: MatchmakingFilters;
  loadingRecommended: boolean;
  loadingNearby: boolean;
  error: string | null;
  loadRecommended: () => Promise<void>;
  loadNearby: () => Promise<void>;
  setFilters: (filters: Partial<MatchmakingFilters>) => void;
  filteredRecommended: () => User[];
  filteredNearby: () => User[];
}

function cityOf(location: string): string {
  return location.split(',')[0].trim().toLowerCase();
}

export function applyMatchmakingFilters(
  users: User[],
  filters: MatchmakingFilters,
  currentUser: User | null,
): User[] {
  const currentUserCity = currentUser ? cityOf(currentUser.location) : null;
  return applyFilters(users, filters, currentUserCity);
}

function applyFilters(
  users: User[],
  filters: MatchmakingFilters,
  currentUserCity: string | null,
): User[] {
  return users.filter((u) => {
    if (
      filters.interests.length > 0 &&
      !filters.interests.some((i) => u.interests.includes(i))
    ) {
      return false;
    }
    if (filters.nearbyOnly && currentUserCity && cityOf(u.location) !== currentUserCity) {
      return false;
    }
    return true;
  });
}

export const useMatchmakingStore = create<MatchmakingState>((set, get) => ({
  recommendedUsers: [],
  nearbyUsers: [],
  filters: { interests: [], nearbyOnly: false },
  loadingRecommended: false,
  loadingNearby: false,
  error: null,

  loadRecommended: async () => {
    set({ loadingRecommended: true, error: null });
    try {
      const users = await getRecommendedUsers();
      set({ recommendedUsers: users, loadingRecommended: false });
    } catch (err) {
      const message = (err as Error).message;
      set({ error: message, loadingRecommended: false });
      toast.error({ title: 'Could not load recommended peers', description: message });
    }
  },

  loadNearby: async () => {
    set({ loadingNearby: true, error: null });
    try {
      const users = await getNearbyUsers();
      set({ nearbyUsers: users, loadingNearby: false });
    } catch (err) {
      const message = (err as Error).message;
      set({ error: message, loadingNearby: false });
      toast.error({ title: 'Could not load nearby peers', description: message });
    }
  },

  setFilters: (partial) =>
    set((s) => ({ filters: { ...s.filters, ...partial } })),

  filteredRecommended: () => {
    const currentUser = useAuthStore.getState().currentUser;
    const city = currentUser ? cityOf(currentUser.location) : null;
    return applyFilters(get().recommendedUsers, get().filters, city);
  },
  filteredNearby: () => {
    const currentUser = useAuthStore.getState().currentUser;
    const city = currentUser ? cityOf(currentUser.location) : null;
    return applyFilters(get().nearbyUsers, get().filters, city);
  },
}));
