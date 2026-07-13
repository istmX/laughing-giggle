import { authFetch } from '@/features/auth/api/auth.api.js'

export const getSessions = async (token) => {
  return authFetch('/playground', { token })
}

export const createSession = async (token, { title }) => {
  return authFetch('/playground', {
    method: 'POST',
    token,
    body: JSON.stringify({ title }),
  })
}

export const getSession = async (token, sessionId) => {
  return authFetch(`/playground/${sessionId}`, { token })
}

export const updateSessionTitle = async (token, sessionId, title) => {
  return authFetch(`/playground/${sessionId}/title`, {
    method: 'PUT',
    token,
    body: JSON.stringify({ title }),
  })
}

export const deleteSession = async (token, sessionId) => {
  return authFetch(`/playground/${sessionId}`, {
    method: 'DELETE',
    token,
  })
}

export const addMessage = async (token, sessionId, message) => {
  return authFetch(`/playground/${sessionId}/message`, {
    method: 'POST',
    token,
    body: JSON.stringify(message),
  })
}
