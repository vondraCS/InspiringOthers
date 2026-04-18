import { Hash, Users, MessageCircle } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';
import { type Conversation } from '@/types';

function iconFor(type: Conversation['type']) {
  if (type === 'channel') return Hash;
  if (type === 'group') return Users;
  return MessageCircle;
}

export function ConversationList() {
  const conversations = useChatStore((s) => s.conversations);
  const loading = useChatStore((s) => s.loadingConversations);
  const setActive = useChatStore((s) => s.setActiveConversation);

  if (loading && conversations.length === 0) {
    return <p className="p-4 font-inter text-sm text-black">Loading...</p>;
  }

  if (conversations.length === 0) {
    return <p className="p-4 font-inter text-sm text-black">No conversations yet.</p>;
  }

  return (
    <ul className="flex-1 overflow-y-auto">
      {conversations.map((c) => {
        const Icon = iconFor(c.type);
        return (
          <li key={c.id}>
            <button
              type="button"
              onClick={() => setActive(c.id)}
              className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-black/5 cursor-pointer border-b border-black/5"
            >
              <Icon size={18} strokeWidth={1.75} className="shrink-0" />
              <span className="flex-1 font-inter text-sm text-black truncate">{c.name}</span>
              <span className="font-inter text-[10px] uppercase tracking-wide text-black/60">
                {c.type}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
