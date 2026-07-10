import { create } from 'zustand'
import { getMe } from '../api/profile.api'

export const useProfileStore = create((set) => ({
  profile: null,
  status: 'idle',
  error: null,
  clearProfile: () => set({ profile: null, status: 'idle', error: null }),
  fetchProfile: async (token) => {
    if (!token) return
    set({ status: 'loading', error: null, profile: null })
    try {
      const response = await getMe(token)
      set({ profile: response.user, status: 'success', error: null })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch profile'
      set({ status: 'error', error: message })
    }
  }
}))
