import { useAuthStore } from '@/features/auth/store/auth.store'

const useAuth = () => {
  const user = useAuthStore((state) => state.user)
  const token = useAuthStore((state) => state.token)
  const status = useAuthStore((state) => state.status)
  const error = useAuthStore((state) => state.error)
  const hasHydrated = useAuthStore((state) => state.hasHydrated)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated())
  const login = useAuthStore((state) => state.login)
  const signup = useAuthStore((state) => state.signup)
  const googleLogin = useAuthStore((state) => state.googleLogin)
  const logout = useAuthStore((state) => state.logout)
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const setAuth = useAuthStore((state) => state.setAuth)

  return {
    user,
    token,
    status,
    error,
    hasHydrated,
    isAuthenticated,
    login,
    signup,
    googleLogin,
    logout,
    clearAuth,
    setAuth,
  }
}

export { useAuth }
