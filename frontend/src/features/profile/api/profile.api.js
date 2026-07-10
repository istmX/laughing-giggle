import { authFetch } from '@/features/auth/api/auth.api'

export const getMe = async (token) => {
  return authFetch('/auth/me', {
    method: 'GET',
    token,
  })
}
