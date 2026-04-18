import { useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { ChatLauncher } from '@/components/chat/ChatLauncher';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { SettingsDialog } from '@/components/settings/SettingsDialog';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { useMockRealtime } from '@/features/chat/mockRealtime';

export function Shell({ children }: { children: React.ReactNode }) {
  const isLoaded = useAuthStore((s) => s.isLoaded);
  const initialize = useAuthStore((s) => s.initialize);
  const settingsOpen = useUIStore((s) => s.settingsOpen);
  const setSettingsOpen = useUIStore((s) => s.setSettingsOpen);

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
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}
