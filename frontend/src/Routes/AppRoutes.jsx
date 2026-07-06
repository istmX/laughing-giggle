import { Route, Routes } from 'react-router-dom'

import Home from '@/Pages/Home'
import Dashboard from '@/Pages/Dashboard'
import LoginPage from '@/Pages/Login'
import SignupPage from '@/Pages/Signup'

import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
      
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      <Route element={<PublicRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
