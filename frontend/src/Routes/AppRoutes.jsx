import { Route, Routes } from 'react-router-dom'

import Home from '@/Pages/Home'
import LoginPage from '@/Pages/Login'
import SignupPage from '@/Pages/Signup'

import ProtectedRoute from './ProtectedRoute'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
