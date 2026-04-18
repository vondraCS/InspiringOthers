import { useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { ChatLauncher } from '@/components/chat/ChatLauncher';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { useAuthStore } from '@/store/authStore';
import { useMockRealtime } from '@/features/chat/mockRealtime';

export function Shell({ children }: { children: React.ReactNode }) {
  const isLoaded = useAuthStore((s) => s.isLoaded);
  const initialize = useAuthStore((s) => s.initialize);

  useEffect(() => {
    if (!isLoaded) initialize();
  }, [isLoaded, initialize]);

  useMockRealtime();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
      <ChatPanel />
      <ChatLauncher />
    </div>
  );
}
