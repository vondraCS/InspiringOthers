import { create } from 'zustand';
import { type User } from '@/types';
import { getUser } from '@/lib/api/users';
import { toast } from '@/components/ui/toast';

interface UserState {
  usersById: Record<string, User>;
  loadingById: Record<string, boolean>;
  errorById: Record<string, string | null>;
  cacheUser: (user: User) => void;
  cacheUsers: (users: User[]) => void;
  getUserById: (id: string) => User | undefined;
  loadUser: (id: string) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  usersById: {},
  loadingById: {},
  errorById: {},

  cacheUser: (user) =>
    set((s) => ({ usersById: { ...s.usersById, [user.id]: user } })),
  cacheUsers: (users) =>
    set((s) => ({
      usersById: {
        ...s.usersById,
        ...Object.fromEntries(users.map((u) => [u.id, u])),
      },
    })),
  getUserById: (id) => get().usersById[id],

  loadUser: async (id) => {
    if (get().usersById[id] || get().loadingById[id]) return;
    set((s) => ({
      loadingById: { ...s.loadingById, [id]: true },
      errorById: { ...s.errorById, [id]: null },
    }));
    try {
      const user = await getUser(id);
      set((s) => ({
        usersById: { ...s.usersById, [user.id]: user },
        loadingById: { ...s.loadingById, [id]: false },
      }));
    } catch (err) {
      const message = (err as Error).message;
      set((s) => ({
        loadingById: { ...s.loadingById, [id]: false },
        errorById: { ...s.errorById, [id]: message },
      }));
      toast.error({ title: 'Could not load user', description: message });
    }
  },
}));
