import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  sidebarCollapsed: boolean;
  chatOpen: boolean;
  toggleSidebar: () => void;
  toggleChat: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setChatOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      chatOpen: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      toggleChat: () => set((s) => ({ chatOpen: !s.chatOpen })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setChatOpen: (open) => set({ chatOpen: open }),
    }),
    {
      name: 'ui-state',
      partialize: (s) => ({ sidebarCollapsed: s.sidebarCollapsed }),
    },
  ),
);
