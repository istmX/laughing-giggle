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
    store.setIsLoadingSessions(true)
    try {
      const res = await api.getSessions(token)
      store.setSessions(res?.data || res || [])
    } catch (error) {
      console.error(error)
      toast.error('Failed to load sessions')
    } finally {
      store.setIsLoadingSessions(false)
    }
  }, [token, store])

  const loadSession = useCallback(async (sessionId) => {
    if (!token || !sessionId) return
    store.setIsLoadingSession(true)
    try {
      const res = await api.getSession(token, sessionId)
      store.setActiveSession(res?.data?.session || res?.session || res?.data || res)
      store.setActiveSessionId(sessionId)
    } catch (error) {
      console.error(error)
      toast.error('Failed to load session')
    } finally {
      store.setIsLoadingSession(false)
    }
  }, [token, store])

  const createNewSession = useCallback(async (title = 'New Session') => {
    if (!token) return
    try {
      const res = await api.createSession(token, { title })
      const newSession = res?.data || res
      store.setSessions([newSession, ...store.sessions])
      store.setActiveSessionId(newSession._id)
      store.setActiveSession(newSession)
      return newSession
    } catch (error) {
      console.error(error)
      toast.error('Failed to create session')
    }
  }, [token, store])

  const deleteSession = useCallback(async (sessionId) => {
    if (!token) return
    try {
      await api.deleteSession(token, sessionId)
      store.removeSession(sessionId)
      toast.success('Session deleted')
    } catch (error) {
      console.error(error)
      toast.error('Failed to delete session')
    }
  }, [token, store])

  const sendMessage = useCallback(async (content) => {
    if (!token || !store.activeSessionId) return
    
    const userMsg = { role: 'user', content }
    store.addMessageToActive(userMsg)
    store.setIsSendingMessage(true)

    try {
      await api.addMessage(token, store.activeSessionId, userMsg)
      await loadSession(store.activeSessionId)
    } catch (error) {
      console.error(error)
      toast.error('Failed to send message')
    } finally {
      store.setIsSendingMessage(false)
    }
  }, [token, store, loadSession])

  return {
    ...store,
    loadSessions,
    loadSession,
    createNewSession,
    deleteSession,
    sendMessage
  }
}
