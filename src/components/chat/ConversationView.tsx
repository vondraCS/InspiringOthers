import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useChatStore } from '@/store/chatStore';
import { useAuthStore } from '@/store/authStore';
import { type ChatMessage, type Conversation } from '@/types';
import { MessageInput } from './MessageInput';

const EMPTY_MESSAGES: ChatMessage[] = [];

export function ConversationView({ conversation }: { conversation: Conversation }) {
  const messages = useChatStore(
    (s) => s.messagesByConversation[conversation.id] ?? EMPTY_MESSAGES,
  );
  const loading = useChatStore((s) => s.loadingMessages);
  const loadMessages = useChatStore((s) => s.loadMessages);
  const currentUserId = useAuthStore((s) => s.currentUser?.id);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0) loadMessages(conversation.id);
  }, [conversation.id, messages.length, loadMessages]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, conversation.id]);

  return (
    <>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
        {loading && messages.length === 0 ? (
          <p className="font-inter text-sm text-black">Loading...</p>
        ) : messages.length === 0 ? (
          <p className="font-inter text-sm text-black">No messages yet.</p>
        ) : (
          messages.map((m) => {
            const own = m.authorId === currentUserId;
            return (
              <div
                key={m.id}
                className={cn('max-w-[80%]', own ? 'self-end' : 'self-start')}
              >
                <div
                  className={cn(
                    'rounded-[12px] px-3 py-2 font-inter text-sm text-black whitespace-pre-wrap break-words',
                    own ? 'bg-[#2ECB71]' : 'bg-black/5',
                  )}
                >
                  {m.body}
                </div>
              </div>
            );
          })
        )}
      </div>
      <MessageInput conversationId={conversation.id} />
    </>
  );
}
