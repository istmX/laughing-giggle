import { useNavigate } from 'react-router-dom'
import { LogOut, LayoutDashboard, ShieldCheck, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/hooks/useAuth'

const Dashboard = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#ffffff_0%,#f8f8ff_100%)] px-5 py-6 text-black sm:px-8 lg:px-10">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl flex-col justify-between gap-8 rounded-[2rem] border border-black/10 bg-white/75 p-6 shadow-[0_28px_90px_rgba(0,0,0,0.05)] backdrop-blur-sm sm:p-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3 text-sm font-medium text-black/55">
              <LayoutDashboard className="size-4 text-[#4d49fc]" />
              Dashboard
            </div>
            <h1 className="mt-3 text-4xl tracking-[-0.05em] sm:text-5xl">
              Welcome{user?.name ? `, ${user.name}` : ''}
            </h1>
            <p className="mt-2 max-w-2xl text-base leading-7 text-black/62">
              This is a dummy dashboard page for now. It confirms auth is working and gives us a
              clean landing spot after login.
            </p>
          </div>

          <Button
            type="button"
            onClick={handleLogout}
            className="h-11 rounded-full bg-black px-5 text-white hover:bg-black/90"
          >
            <LogOut className="mr-2 size-4" />
            Logout
          </Button>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.5rem] border border-black/10 bg-white px-5 py-5 shadow-[0_16px_45px_rgba(0,0,0,0.03)]">
            <ShieldCheck className="size-5 text-[#4d49fc]" />
            <h2 className="mt-4 text-lg font-medium">Authenticated session</h2>
            <p className="mt-2 text-sm leading-6 text-black/62">
              Your token and user state are stored in zustand and persisted locally.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-black/10 bg-white px-5 py-5 shadow-[0_16px_45px_rgba(0,0,0,0.03)]">
            <Sparkles className="size-5 text-[#4d49fc]" />
            <h2 className="mt-4 text-lg font-medium">Ready for app features</h2>
            <p className="mt-2 text-sm leading-6 text-black/62">
              We can now hang real projects, tasks, and settings off this route.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-black/10 bg-white px-5 py-5 shadow-[0_16px_45px_rgba(0,0,0,0.03)]">
            <LayoutDashboard className="size-5 text-[#4d49fc]" />
            <h2 className="mt-4 text-lg font-medium">Dummy surface</h2>
            <p className="mt-2 text-sm leading-6 text-black/62">
              This is intentionally lightweight until the real dashboard is ready.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}

export default Dashboard
