import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from '@/features/auth/hooks/useAuth'

const ProtectedRoute = () => {
  const { hasHydrated, isAuthenticated } = useAuth()

  if (!hasHydrated) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
