import { create } from 'zustand';
import { type Conversation, type ChatMessage } from '@/types';
import { getConversations, getChatMessages, sendMessage as apiSendMessage } from '@/lib/api/chat';

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
      set({ error: (err as Error).message, loadingConversations: false });
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
      set({ error: (err as Error).message, loadingMessages: false });
    }
  },

  sendMessage: async (conversationId, body) => {
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
  },

  setActiveConversation: (id) => {
    set({ activeConversationId: id });
    if (id && !get().messagesByConversation[id]) {
      get().loadMessages(id);
    }
  },
}));
