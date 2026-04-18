import { create } from 'zustand';
import { type User } from '@/types';

interface UserState {
  usersById: Record<string, User>;
  cacheUser: (user: User) => void;
  cacheUsers: (users: User[]) => void;
  getUserById: (id: string) => User | undefined;
}

export const useUserStore = create<UserState>((set, get) => ({
  usersById: {},
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
}));
