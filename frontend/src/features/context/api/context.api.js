import { getBaseUrl } from '@/features/auth/api/auth.api'

// Stream context generation API
export const generateProjectContext = async (token, ideaId, signal) => {
  const url = `${getBaseUrl()}/ai/context/${ideaId}`
  return fetch(url, {
    method: 'POST',
    signal,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })
}
