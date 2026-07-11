import { authFetch } from '@/features/auth/api/auth.api'

// Placeholder context generation API
export const generateProjectContext = async (token, ideaId) => {
  return authFetch(`/ai/context/${ideaId}`, {
    method: 'POST',
    token,
  })
}
