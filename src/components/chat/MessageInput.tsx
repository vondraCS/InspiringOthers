import { useState } from 'react';
import { Send } from 'lucide-react';
import { useChatStore } from '@/store/chatStore';

export function MessageInput({ conversationId }: { conversationId: string }) {
  const [value, setValue] = useState('');
  const [sending, setSending] = useState(false);
  const sendMessage = useChatStore((s) => s.sendMessage);

  const submit = async () => {
    const body = value.trim();
    if (!body || sending) return;
    setSending(true);
    try {
      await sendMessage(conversationId, body);
      setValue('');
    } finally {
      setSending(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="flex items-end gap-2 p-2 border-t border-border"
    >
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
        placeholder="Write a message..."
        rows={1}
        className="flex-1 resize-none border border-border-subtle rounded-xl px-3 py-2 font-inter text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:border-ring"
      />
      <button
        type="submit"
        disabled={sending || !value.trim()}
        aria-label="Send message"
        className="p-2 rounded-full bg-primary text-primary-foreground disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-1"
      >
        <Send size={18} strokeWidth={2} />
      </button>
    </form>
  );
}
