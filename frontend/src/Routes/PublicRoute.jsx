import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from '@/features/auth/hooks/useAuth'


const PublicRoute = () => {
  const { hasHydrated, isAuthenticated } = useAuth()

  if (!hasHydrated) {
    return null
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <>
     
      <Outlet />
    </>
  )
}

export default PublicRoute
