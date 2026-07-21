import { create } from 'zustand'

export const usePlaygroundStore = create((set) => ({
  sessions: [],
  activeSessionId: null,
  activeSession: null,
  isLoadingSessions: false,
  isLoadingSession: false,
  isSendingMessage: false,
  isDraft: false,

  setSessions: (sessions) => set({ sessions }),
  setActiveSessionId: (id) => set({ activeSessionId: id }),
  setActiveSession: (session) => set({ activeSession: session }),
  startDraft: () => set({
    activeSessionId: null,
    activeSession: { _id: null, title: 'New chat', chatHistory: [], tokens: {}, isDraft: true },
    isDraft: true,
    isSendingMessage: false,
  }),
  activateSession: (session) => set({
    activeSessionId: session?._id || null,
    activeSession: session || null,
    isDraft: false,
  }),
  setIsLoadingSessions: (isLoading) => set({ isLoadingSessions: isLoading }),
  setIsLoadingSession: (isLoading) => set({ isLoadingSession: isLoading }),
  setIsSendingMessage: (isSending) => set({ isSendingMessage: isSending }),

  updateActiveSessionTitle: (title) => set((state) => ({
    activeSession: state.activeSession ? { ...state.activeSession, title } : null,
    sessions: state.sessions.map((s) => s._id === state.activeSessionId ? { ...s, title } : s)
  })),

  addMessageToActive: (message) => set((state) => ({
    activeSession: state.activeSession ? {
      ...state.activeSession,
      chatHistory: [...(state.activeSession.chatHistory || []), message]
    } : null
  })),

  removeSession: (sessionId) => set((state) => ({
    sessions: state.sessions.filter((s) => s._id !== sessionId),
    activeSessionId: state.activeSessionId === sessionId ? null : state.activeSessionId,
    activeSession: state.activeSessionId === sessionId ? null : state.activeSession,
    isDraft: state.activeSessionId === sessionId ? false : state.isDraft,
  })),
}))
