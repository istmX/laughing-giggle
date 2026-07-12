import { create } from 'zustand';

export const useChatStore = create((set) => ({
  messages: [],
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  updateLastMessage: (updates) => set((state) => {
    const newMsgs = [...state.messages];
    if (newMsgs.length > 0) {
      newMsgs[newMsgs.length - 1] = { ...newMsgs[newMsgs.length - 1], ...updates };
    }
    return { messages: newMsgs };
  }),
  clearMessages: () => set({ messages: [] }),
}));
