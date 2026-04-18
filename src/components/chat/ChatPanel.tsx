import { useEffect } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { useChatStore } from '@/store/chatStore';
import { ConversationList } from './ConversationList';
import { ConversationView } from './ConversationView';

export function ChatPanel() {
  const chatOpen = useUIStore((s) => s.chatOpen);
  const setChatOpen = useUIStore((s) => s.setChatOpen);
  const conversations = useChatStore((s) => s.conversations);
  const activeId = useChatStore((s) => s.activeConversationId);
  const setActive = useChatStore((s) => s.setActiveConversation);
  const loadConversations = useChatStore((s) => s.loadConversations);

  useEffect(() => {
    if (chatOpen && conversations.length === 0) loadConversations();
  }, [chatOpen, conversations.length, loadConversations]);

  if (!chatOpen) return null;

  const active = activeId ? conversations.find((c) => c.id === activeId) : null;

  return (
    <div
      role="dialog"
      aria-label="InspireChat"
      className="fixed bottom-24 right-6 z-40 w-[360px] h-[520px] bg-white border border-black rounded-[15px] shadow-lg flex flex-col overflow-hidden"
    >
      <div className="flex items-center gap-2 p-3 border-b border-black/10">
        {active ? (
          <button
            type="button"
            aria-label="Back to conversations"
            onClick={() => setActive(null)}
            className="p-1 rounded hover:bg-black/5 cursor-pointer"
          >
            <ArrowLeft size={18} strokeWidth={1.75} />
          </button>
        ) : null}
        <h2 className="flex-1 font-inter font-semibold text-base text-black truncate">
          {active ? active.name : 'InspireChat'}
        </h2>
        <button
          type="button"
          aria-label="Close chat"
          onClick={() => setChatOpen(false)}
          className="p-1 rounded hover:bg-black/5 cursor-pointer"
        >
          <X size={18} strokeWidth={1.75} />
        </button>
      </div>
      <div className="flex-1 min-h-0 flex flex-col">
        {active ? <ConversationView conversation={active} /> : <ConversationList />}
      </div>
    </div>
  );
}
