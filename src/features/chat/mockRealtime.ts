import { useEffect } from 'react';
import { useChatStore } from '@/store/chatStore';
import { useAuthStore } from '@/store/authStore';
import { type ChatMessage } from '@/types';

const REPLIES = [
  'Interesting take — mind sharing how you approached it?',
  'I ran into something similar last week. Happy to compare notes.',
  'Agreed. The trade-off you mentioned is exactly the part I keep wrestling with.',
  'Do you have a link to that? Would love to read more.',
  'Nice. I think this maps pretty closely to what we were discussing yesterday.',
  'That actually changes how I was thinking about it — thanks for writing it up.',
  'Makes sense. My only hesitation is the last part, but I can see why.',
  "Have you tried the other approach? Curious how it compared.",
  'Good point. I had not considered the second-order effects there.',
  'Saving this for later — really useful framing.',
];

const MIN_DELAY_MS = 30_000;
const MAX_DELAY_MS = 60_000;

function injectOnce() {
  const { conversations, messagesByConversation } = useChatStore.getState();
  const loaded = conversations.filter((c) => (messagesByConversation[c.id]?.length ?? 0) > 0);
  if (loaded.length === 0) return;

  const conv = loaded[Math.floor(Math.random() * loaded.length)];
  const currentUserId = useAuthStore.getState().currentUser?.id;
  const others = conv.participantIds.filter((id) => id !== currentUserId);
  if (others.length === 0) return;

  const authorId = others[Math.floor(Math.random() * others.length)];
  const body = REPLIES[Math.floor(Math.random() * REPLIES.length)];
  const message: ChatMessage = {
    id: `mock-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    conversationId: conv.id,
    authorId,
    body,
    createdAt: new Date().toISOString(),
  };

  useChatStore.setState((s) => ({
    messagesByConversation: {
      ...s.messagesByConversation,
      [conv.id]: [...(s.messagesByConversation[conv.id] ?? []), message],
    },
  }));
}

export function useMockRealtime() {
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const delay = MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS);
      timer = setTimeout(() => {
        injectOnce();
        schedule();
      }, delay);
    };
    schedule();
    return () => clearTimeout(timer);
  }, []);
}
