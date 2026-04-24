import { MessageSquare } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';

export function ChatLauncher() {
  const chatOpen = useUIStore((s) => s.chatOpen);
  const toggleChat = useUIStore((s) => s.toggleChat);

  return (
    <button
      type="button"
      onClick={toggleChat}
      aria-label={chatOpen ? 'Close chat' : 'Open chat'}
      aria-pressed={chatOpen}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-primary text-primary-foreground shadow-card-hover hover:bg-primary/90 cursor-pointer transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2"
    >
      <MessageSquare size={20} strokeWidth={2} />
      <span className="font-inter font-medium text-sm">Chat</span>
    </button>
  );
}
