import { authFetch } from '@/features/auth/api/auth.api'

export const createIdea = async (token, ideaData) => {
  return authFetch('/ideas', {
    method: 'POST',
    token,
    body: JSON.stringify(ideaData),
  })
}
