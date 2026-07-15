import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from '@/features/auth/hooks/useAuth'
import { Navbar } from '@/features/navbar/ui/Navbar'

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
      <Navbar />
      <Outlet />
    </>
  )
}

export default PublicRoute
