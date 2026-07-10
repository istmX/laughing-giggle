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
