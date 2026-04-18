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
      className="flex items-end gap-2 p-2 border-t border-black/10"
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
        className="flex-1 resize-none border border-black/20 rounded-[10px] px-3 py-2 font-inter text-sm text-black focus:outline-none focus:border-black"
      />
      <button
        type="submit"
        disabled={sending || !value.trim()}
        aria-label="Send message"
        className="p-2 rounded-full bg-[#2ECB71] text-black disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
      >
        <Send size={18} strokeWidth={2} />
      </button>
    </form>
  );
}
