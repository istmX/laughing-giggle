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
      if (!currentState.activeSessionId && Array.isArray(fetchedSessions) && fetchedSessions.length > 0) {
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
      state.setActiveSession(session)
      state.setActiveSessionId(sessionId)
    } catch (error) {
      console.error(error)
      toast.error('Failed to load session')
    } finally {
      usePlaygroundStore.getState().setIsLoadingSession(false)
    }
  }, [token])

  const createNewSession = useCallback(async (title = 'New Session') => {
    if (!token) return
    const state = usePlaygroundStore.getState()
    try {
      const res = await api.createSession(token, { title })
      const newSession = res?.data?.session || res?.session || res?.data || res
      state.setSessions([newSession, ...state.sessions])
      state.setActiveSessionId(newSession._id)
      state.setActiveSession(newSession)
      return newSession
    } catch (error) {
      console.error(error)
      toast.error('Failed to create session')
    }
  }, [token])

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
    if (!token || !state.activeSessionId) return
    
    const userMsg = { role: 'user', content }
    state.addMessageToActive(userMsg)
    state.setIsSendingMessage(true)

    try {
      await api.addMessage(token, state.activeSessionId, userMsg)
      // Call loadSession directly inside without using the dependent closure
      const res = await api.getSession(token, state.activeSessionId)
      const session = res?.data?.session || res?.session || res?.data || res
      usePlaygroundStore.getState().setActiveSession(session)
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
