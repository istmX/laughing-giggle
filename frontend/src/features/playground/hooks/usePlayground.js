import { useCallback } from 'react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { usePlaygroundStore } from '../store/playground.store'
import * as api from '../api/playground.api'
import toast from 'react-hot-toast'

export const usePlayground = () => {
  const { token } = useAuth()
  const store = usePlaygroundStore()

  const loadSessions = useCallback(async () => {
    if (!token) return
    const state = usePlaygroundStore.getState()
    state.setIsLoadingSessions(true)
    try {
      const res = await api.getSessions(token)
      const fetchedSessions = res?.data?.sessions || res?.sessions || res?.data || res || []
      state.setSessions(Array.isArray(fetchedSessions) ? fetchedSessions : [])
      
      // Auto-select the first session if none is active
      const currentState = usePlaygroundStore.getState()
      if (!currentState.activeSessionId && !currentState.isDraft && Array.isArray(fetchedSessions) && fetchedSessions.length > 0) {
        currentState.setActiveSessionId(fetchedSessions[0]._id)
      }
    } catch (error) {
      console.error(error)
      toast.error('Failed to load sessions')
    } finally {
      usePlaygroundStore.getState().setIsLoadingSessions(false)
    }
  }, [token])

  const loadSession = useCallback(async (sessionId) => {
    if (!token || !sessionId) return
    const state = usePlaygroundStore.getState()
    state.setIsLoadingSession(true)
    try {
      const res = await api.getSession(token, sessionId)
      const session = res?.data?.session || res?.session || res?.data || res
      state.activateSession(session)
    } catch (error) {
      console.error(error)
      toast.error('Failed to load session')
    } finally {
      usePlaygroundStore.getState().setIsLoadingSession(false)
    }
  }, [token])

  const createNewSession = useCallback(() => {
    usePlaygroundStore.getState().startDraft()
  }, [])

  const deleteSession = useCallback(async (sessionId) => {
    if (!token) return
    const state = usePlaygroundStore.getState()
    try {
      await api.deleteSession(token, sessionId)
      state.removeSession(sessionId)
      toast.success('Session deleted')
    } catch (error) {
      console.error(error)
      toast.error('Failed to delete session')
    }
  }, [token])

  const sendMessage = useCallback(async (content) => {
    const state = usePlaygroundStore.getState()
    const message = typeof content === 'string' ? content.trim() : ''
    if (!token || !message || state.isSendingMessage) return

    let sessionId = state.activeSessionId

    if (!sessionId) {
      try {
        state.setIsSendingMessage(true)
        const createRes = await api.createSession(token, { title: message.slice(0, 48) })
        const newSession = createRes?.data?.session || createRes?.session || createRes?.data || createRes
        if (!newSession?._id) throw new Error('Session creation returned no id')

        sessionId = newSession._id
        const current = usePlaygroundStore.getState()
        current.setSessions([newSession, ...current.sessions])
        current.activateSession({ ...newSession, chatHistory: newSession.chatHistory || [] })
      } catch (error) {
        console.error(error)
        usePlaygroundStore.getState().setIsSendingMessage(false)
        toast.error('Failed to create session')
        return
      }
    }
    
    const userMsg = { role: 'user', content: message }
    usePlaygroundStore.getState().addMessageToActive(userMsg)

    try {
      await api.addMessage(token, sessionId, userMsg)
      // Call loadSession directly inside without using the dependent closure
      const res = await api.getSession(token, sessionId)
      const session = res?.data?.session || res?.session || res?.data || res
      usePlaygroundStore.getState().activateSession(session)
    } catch (error) {
      console.error(error)
      toast.error('Failed to send message')
    } finally {
      usePlaygroundStore.getState().setIsSendingMessage(false)
    }
  }, [token])

  const renameSession = useCallback(async (sessionId, title) => {
    if (!token) return
    const state = usePlaygroundStore.getState()
    try {
      await api.updateSessionTitle(token, sessionId, title)
      state.updateActiveSessionTitle(title)
      toast.success('Session renamed')
    } catch (error) {
      console.error(error)
      toast.error('Failed to rename session')
    }
  }, [token])

  return {
    ...store,
    loadSessions,
    loadSession,
    createNewSession,
    deleteSession,
    renameSession,
    sendMessage
  }
}
