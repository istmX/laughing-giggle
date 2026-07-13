import { create } from 'zustand'

export const usePlaygroundStore = create((set) => ({
  sessions: [],
  activeSessionId: null,
  activeSession: null,
  isLoadingSessions: false,
  isLoadingSession: false,
  isSendingMessage: false,

  setSessions: (sessions) => set({ sessions }),
  setActiveSessionId: (id) => set({ activeSessionId: id }),
  setActiveSession: (session) => set({ activeSession: session }),
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
    activeSession: state.activeSessionId === sessionId ? null : state.activeSession
  })),
}))
