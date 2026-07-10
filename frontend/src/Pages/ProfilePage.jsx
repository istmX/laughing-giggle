import { Profile } from '@/features/profile/ui/Profile'

export default function ProfilePage() {
  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-10 lg:p-16 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <Profile />
    </div>
  )
}
