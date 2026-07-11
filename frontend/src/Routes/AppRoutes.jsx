import { Route, Routes } from 'react-router-dom'

import Home from '@/Pages/Home'
import Dashboard from '@/Pages/Dashboard'
import LoginPage from '@/Pages/Login'
import SignupPage from '@/Pages/Signup'
import ProfilePage from '@/Pages/ProfilePage'
import PreferencesPage from '@/Pages/Preferences'
import NotFound from '@/Pages/NotFound'
import { Overview } from '@/Dashboard/components/Overview'
import { NewProjectPage } from '@/features/project/ui/NewProjectPage'
import { ProjectChatPage } from '@/features/project/ui/ProjectChatPage'

import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/projects/:projectId" element={<NewProjectPage />} />
        <Route path="/projects/:projectId/chat" element={<ProjectChatPage />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Overview />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings/preferences" element={<PreferencesPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>

      <Route element={<PublicRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes
