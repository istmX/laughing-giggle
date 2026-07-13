import { Route, Routes } from 'react-router-dom'

import Home from '@/Pages/Home'
import Dashboard from '@/Pages/Dashboard'
import LoginPage from '@/Pages/Login'
import SignupPage from '@/Pages/Signup'
import ProfilePage from '@/Pages/ProfilePage'
import PublicProfilePage from '@/Pages/PublicProfilePage'
import PreferencesPage from '@/Pages/Preferences'
import NotFound from '@/Pages/NotFound'
import { Overview } from '@/Dashboard/components/Overview'
import { PlaygroundPage } from '@/Dashboard/components/PlaygroundPage'
import { Playground } from '@/features/playground/ui/Playground'
import { NewProjectPage } from '@/features/project/ui/NewProjectPage'
import { ProjectWorkspace } from '@/features/project/ui/ProjectWorkspace'
import { FavoriteProjects } from '@/features/favorites/ui/FavoriteProjects'
import { RecentProjects } from '@/features/recent/ui/RecentProjects'
import { CommunityPage } from '@/features/explore/ui/CommunityPage'

import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'
import { AdminDashboard } from '@/features/admin/ui/AdminDashboard'
import { AdminUserForm } from '@/features/admin/ui/AdminUserForm'

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route path="/ary/8776/admin" element={<AdminDashboard />} />
        <Route path="/ary/8776/admin/users/new" element={<AdminUserForm />} />
        <Route path="/ary/8776/admin/users/:userId" element={<AdminUserForm />} />
        <Route path="/projects/:projectId" element={<NewProjectPage />} />
        <Route path="/projects/:projectId/chat" element={<ProjectWorkspace />} />
        <Route path="/playground" element={<Playground />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Overview />} />
          <Route path="favorites" element={<FavoriteProjects />} />
          <Route path="recent" element={<RecentProjects />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="community" element={<CommunityPage />} />
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
      
      {/* Publicly accessible profile, outside both Protected/Public layout wrappers if we want it completely standalone, 
          or we can put it in a separate layout. We'll leave it at the root level so it's fully accessible without redirecting logged-in users. */}
      <Route path="/u/:username" element={<PublicProfilePage />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes
