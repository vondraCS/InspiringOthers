import { create } from 'zustand';
import { type User, type SkillLevel } from '@/types';
import { getCurrentUser } from '@/lib/api/users';
import { useUserStore } from './userStore';
import { toast } from '@/components/ui/toast';

export type ProfileUpdate = Partial<
  Pick<User, 'name' | 'avatar' | 'location' | 'interests' | 'goals'> & {
    skillLevel: SkillLevel;
  }
>;

interface AuthState {
  currentUser: User | null;
  isLoaded: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  updateProfile: (updates: ProfileUpdate) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  currentUser: null,
  isLoaded: false,
  error: null,
  initialize: async () => {
    try {
      const user = await getCurrentUser();
      useUserStore.getState().cacheUser(user);
      set({ currentUser: user, isLoaded: true });
    } catch (err) {
      const message = (err as Error).message;
      set({ error: message, isLoaded: true });
      toast.error({ title: 'Could not load profile', description: message });
    }
  },
  updateProfile: (updates) => {
    const current = get().currentUser;
    if (!current) return;
    const next: User = { ...current, ...updates };
    useUserStore.getState().cacheUser(next);
    set({ currentUser: next });
  },
  logout: () => {
    set({ currentUser: null, isLoaded: false, error: null });
  },
}));
