import { create } from 'zustand';
import { type User } from '@/types';
import { getCurrentUser } from '@/lib/api/users';

interface AuthState {
  currentUser: User | null;
  isLoaded: boolean;
  error: string | null;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: null,
  isLoaded: false,
  error: null,
  initialize: async () => {
    try {
      const user = await getCurrentUser();
      set({ currentUser: user, isLoaded: true });
    } catch (err) {
      set({ error: (err as Error).message, isLoaded: true });
    }
  },
}));
