import { useProfile } from '../hooks/useProfile'
import { ProfileDetails } from './components/ProfileDetails'
import { Loader2 } from 'lucide-react'

export const Profile = () => {
  const { profile, status, error } = useProfile()

  if (status === 'loading' || status === 'idle') {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-ink-muted" />
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="flex h-[400px] items-center justify-center text-destructive">
        <p>{error || 'Failed to load profile.'}</p>
      </div>
    )
  }

  return <ProfileDetails profile={profile} />
}
