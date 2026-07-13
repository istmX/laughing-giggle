import { Route, Routes } from 'react-router-dom'

import Home from '@/Pages/Home'
import Dashboard from '@/Pages/Dashboard'
import LoginPage from '@/Pages/Login'
import SignupPage from '@/Pages/Signup'
import ProfilePage from '@/Pages/ProfilePage'
import PreferencesPage from '@/Pages/Preferences'
import NotFound from '@/Pages/NotFound'
import { Overview } from '@/Dashboard/components/Overview'
import { PlaygroundPage } from '@/Dashboard/components/PlaygroundPage'
import { Playground } from '@/features/playground/ui/Playground'
import { NewProjectPage } from '@/features/project/ui/NewProjectPage'
import { ProjectWorkspace } from '@/features/project/ui/ProjectWorkspace'
import { FavoriteProjects } from '@/features/favorites/ui/FavoriteProjects'
import { RecentProjects } from '@/features/recent/ui/RecentProjects'

import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/projects/:projectId" element={<NewProjectPage />} />
        <Route path="/projects/:projectId/chat" element={<ProjectWorkspace />} />
        <Route path="/playground" element={<Playground />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Overview />} />
          <Route path="favorites" element={<FavoriteProjects />} />
          <Route path="recent" element={<RecentProjects />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="playground" element={<PlaygroundPage />} />
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
