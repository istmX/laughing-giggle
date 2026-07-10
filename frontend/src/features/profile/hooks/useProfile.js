import { useEffect } from 'react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useProfileStore } from '../store/profile.store'

export const useProfile = () => {
  const { token } = useAuth()
  const { profile, status, error, fetchProfile } = useProfileStore()

  useEffect(() => {
    if (token && !profile && status === 'idle') {
      fetchProfile(token)
    }
  }, [token, profile, status, fetchProfile])

  return { profile, status, error, fetchProfile }
}
