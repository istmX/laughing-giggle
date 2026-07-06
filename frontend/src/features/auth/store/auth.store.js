import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { googleLogin as googleLoginRequest, loginUser, logoutUser, registerUser } from '@/features/auth/api/auth.api'

const normalizeAuthResponse = (data) => {
  const payload = data?.data ?? data

  return {
    token: payload?.token ?? null,
    user: payload?.user ?? payload?.account ?? payload?.profile ?? null,
    raw: data,
  }
}

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      status: 'idle',
      error: null,
      hasHydrated: false,

      isAuthenticated: () => Boolean(get().token),

      setAuth: ({ token, user }) =>
        set({
          token: token ?? null,
          user: user ?? null,
          error: null,
          status: 'success',
        }),

      clearAuth: () =>
        set({
          token: null,
          user: null,
          error: null,
          status: 'idle',
        }),

      setHasHydrated: (value) =>
        set({
          hasHydrated: value,
        }),

      login: async (credentials) => {
        set({ status: 'loading', error: null })

        try {
          const response = await loginUser(credentials)
          const auth = normalizeAuthResponse(response)

          set({
            token: auth.token,
            user: auth.user,
            status: 'success',
            error: null,
          })

          return auth
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Login failed'
          set({ status: 'error', error: message })
          throw error
        }
      },

      signup: async (payload) => {
        set({ status: 'loading', error: null })

        try {
          const response = await registerUser(payload)
          const auth = normalizeAuthResponse(response)

          set({
            token: auth.token,
            user: auth.user,
            status: 'success',
            error: null,
          })

          return auth
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Signup failed'
          set({ status: 'error', error: message })
          throw error
        }
      },

      googleLogin: async ({ credential }) => {
        set({ status: 'loading', error: null })

        try {
          const response = await googleLoginRequest({ credential })
          const auth = normalizeAuthResponse(response)

          set({
            token: auth.token,
            user: auth.user,
            status: 'success',
            error: null,
          })

          return auth
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Google sign-in failed'
          set({ status: 'error', error: message })
          throw error
        }
      },

      logout: async () => {
        try {
          await logoutUser()
        } finally {
          set({
            token: null,
            user: null,
            status: 'idle',
            error: null,
          })
        }
      },
    }),
    {
      name: 'zenix-auth',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    },
  ),
)

export { useAuthStore }
