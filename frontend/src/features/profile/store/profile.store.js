import { create } from 'zustand'
import { getProfile, updateProfile as apiUpdateProfile, updatePfp as apiUpdatePfp, deleteAccount as apiDeleteAccount } from '../api/profile.api'

export const useProfileStore = create((set, get) => ({
  profile: null,
  status: 'idle',
  error: null,
  clearProfile: () => set({ profile: null, status: 'idle', error: null }),
  fetchProfile: async () => {
    set({ status: 'loading', error: null })
    try {
      const response = await getProfile()
      set({ profile: response.user, status: 'success', error: null })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch profile'
      set({ status: 'error', error: message })
    }
  },
  updateProfile: async (data) => {
    try {
      const response = await apiUpdateProfile(data)
      set({ profile: response.user })
      return response.user
    } catch (err) {
      throw err
    }
  },
  updatePfp: async (pfpUrl) => {
    try {
      const response = await apiUpdatePfp(pfpUrl)
      set({ profile: response.user })
      return response.user
    } catch (err) {
      throw err
    }
  },
  deleteAccount: async () => {
    try {
      await apiDeleteAccount()
      set({ profile: null, status: 'idle' })
    } catch (err) {
      throw err
    }
  }
}))
