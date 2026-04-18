import { create } from 'zustand';
import { type Conversation, type ChatMessage } from '@/types';
import { getConversations, getChatMessages, sendMessage as apiSendMessage } from '@/lib/api/chat';
import { toast } from '@/components/ui/toast';

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messagesByConversation: Record<string, ChatMessage[]>;
  loadingConversations: boolean;
  loadingMessages: boolean;
  error: string | null;
  loadConversations: () => Promise<void>;
  loadMessages: (conversationId: string) => Promise<void>;
  sendMessage: (conversationId: string, body: string) => Promise<void>;
  setActiveConversation: (id: string | null) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  activeConversationId: null,
  messagesByConversation: {},
  loadingConversations: false,
  loadingMessages: false,
  error: null,

  loadConversations: async () => {
    set({ loadingConversations: true, error: null });
    try {
      const conversations = await getConversations();
      set({ conversations, loadingConversations: false });
    } catch (err) {
      const message = (err as Error).message;
      set({ error: message, loadingConversations: false });
      toast.error({ title: 'Could not load conversations', description: message });
    }
  },

  loadMessages: async (conversationId) => {
    set({ loadingMessages: true });
    try {
      const messages = await getChatMessages(conversationId);
      set((s) => ({
        messagesByConversation: { ...s.messagesByConversation, [conversationId]: messages },
        loadingMessages: false,
      }));
    } catch (err) {
      const message = (err as Error).message;
      set({ error: message, loadingMessages: false });
      toast.error({ title: 'Could not load messages', description: message });
    }
  },

  sendMessage: async (conversationId, body) => {
    try {
      const message = await apiSendMessage(conversationId, body);
      set((s) => {
        const existing = s.messagesByConversation[conversationId] ?? [];
        return {
          messagesByConversation: {
            ...s.messagesByConversation,
            [conversationId]: [...existing, message],
          },
        };
      });
    } catch (err) {
      const message = (err as Error).message;
      set({ error: message });
      toast.error({ title: 'Could not send message', description: message });
    }
  },

  setActiveConversation: (id) => {
    set({ activeConversationId: id });
    if (id && !get().messagesByConversation[id]) {
      get().loadMessages(id);
    }
  },
}));
