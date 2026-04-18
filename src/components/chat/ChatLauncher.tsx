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
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full border border-black bg-white text-black shadow hover:bg-black/5 cursor-pointer"
    >
      <MessageSquare size={20} strokeWidth={2} />
      <span className="font-inter text-sm">Chat</span>
    </button>
  );
}
