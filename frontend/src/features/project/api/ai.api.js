import { authFetch } from '@/features/auth/api/auth.api'

export const analyzeIdea = async (token, ideaId) => {
  return authFetch(`/ai/analyze/${ideaId}`, {
    method: 'POST',
    token,
  })
}

export const generateQuestions = async (token, ideaId) => {
  return authFetch(`/ai/questions/${ideaId}`, {
    method: 'POST',
    token,
  })
}

export const generateRefinement = async (token, ideaId, payload) => {
  return authFetch(`/ai/refine/${ideaId}`, {
    method: 'POST',
    token,
    body: JSON.stringify(payload)
  })
}

export const processConversation = async (token, ideaId, payload) => {
  return authFetch(`/ai/conversation/${ideaId}`, {
    method: 'POST',
    token,
    body: JSON.stringify(payload)
  })
}
