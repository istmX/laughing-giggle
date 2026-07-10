import { authFetch } from '@/features/auth/api/auth.api'

export const createBrief = async (token, ideaId) => {
  return authFetch('/brief', {
    method: 'POST',
    token,
    body: JSON.stringify({ idea: ideaId }),
  })
}

export const updateBrief = async (token, briefId, answers) => {
  return authFetch(`/brief/${briefId}`, {
    method: 'PATCH',
    token,
    body: JSON.stringify({ answers }),
  })
}
