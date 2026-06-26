import { Eye, LockKeyhole, Mail, User, UserCircle2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import AuthShell from './AuthShell'

const Signup = () => {
  return (
    <AuthShell
      headline="Create your account and start"
      headlineAccent="building."
      description="Set up your workspace, keep your context organized, and move from idea to implementation with a cleaner starting point."
      topActionPrefix="Already have an account?"
      topActionLabel="Sign in"
      topActionHref="/login"
    >
      <div className="space-y-5 max-[860px]:space-y-4">
        <div className="space-y-2">
          <h2 className="text-3xl tracking-[-0.05em] max-[860px]:text-2xl sm:text-4xl">
            Create your account
          </h2>
          <p className="max-w-lg text-base leading-7 text-black/62">
            Add your details below to get started with Zenix.
          </p>
        </div>

        <form className="space-y-4 max-[860px]:space-y-3">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-1">
              <label className="text-sm font-medium text-black/82" htmlFor="signup-name">
                Name
              </label>
              <div className="relative">
                <UserCircle2 className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-black/30" />
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="Jane Doe"
                  className="h-12 rounded-2xl border-black/12 bg-white/80 pl-11 pr-4 text-base shadow-[0_18px_45px_rgba(0,0,0,0.03)] placeholder:text-black/30 max-[860px]:h-11"
                />
              </div>
            </div>

            <div className="space-y-2 sm:col-span-1">
              <label className="text-sm font-medium text-black/82" htmlFor="signup-username">
                Username
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-black/30" />
                <Input
                  id="signup-username"
                  type="text"
                  placeholder="janedoe"
                  className="h-12 rounded-2xl border-black/12 bg-white/80 pl-11 pr-4 text-base shadow-[0_18px_45px_rgba(0,0,0,0.03)] placeholder:text-black/30 max-[860px]:h-11"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-black/82" htmlFor="signup-email">
              Email
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-black/30" />
              <Input
                id="signup-email"
                type="email"
                placeholder="you@example.com"
                className="h-12 rounded-2xl border-black/12 bg-white/80 pl-11 pr-4 text-base shadow-[0_18px_45px_rgba(0,0,0,0.03)] placeholder:text-black/30 max-[860px]:h-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-black/82" htmlFor="signup-password">
              Password
            </label>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-black/30" />
              <Input
                id="signup-password"
                type="password"
                placeholder="Create a password"
                className="h-12 rounded-2xl border-black/12 bg-white/80 pl-11 pr-14 text-base shadow-[0_18px_45px_rgba(0,0,0,0.03)] placeholder:text-black/30 max-[860px]:h-11"
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-black/35 transition-colors hover:text-black/70"
                aria-label="Preview password"
              >
                <Eye className="size-5" />
              </button>
            </div>
          </div>

          <label className="flex items-start gap-3 rounded-2xl border border-black/10 bg-white/55 px-4 py-4 text-sm leading-6 text-black/68 shadow-[0_14px_40px_rgba(0,0,0,0.03)]">
            <input
              type="checkbox"
              className="mt-1 size-4 rounded border-black/20 text-[#4d49fc] focus:ring-[#4d49fc]"
            />
            <span>
              I agree to the terms, privacy policy, and account creation flow for Zenix.
            </span>
          </label>

          <Button
            type="submit"
            className="h-12 w-full rounded-full bg-black text-base text-white shadow-[0_20px_50px_rgba(0,0,0,0.18)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-black/90 max-[860px]:h-11"
          >
            Create account
            <span className="ml-3 text-xl leading-none">→</span>
          </Button>
        </form>

        <div className="flex items-center gap-4 max-[860px]:hidden">
          <span className="h-px flex-1 bg-black/10" />
          <span className="text-sm text-black/45">or</span>
          <span className="h-px flex-1 bg-black/10" />
        </div>

        <Button
          type="button"
          variant="outline"
          className="h-12 w-full rounded-full border-black/15 bg-white/80 text-base text-black shadow-[0_16px_40px_rgba(0,0,0,0.04)] hover:bg-black/5 max-[860px]:hidden"
        >
          <span className="flex items-center gap-4">
            <span className="grid size-7 place-items-center rounded-full bg-white text-lg font-semibold shadow-sm">
              <span className="bg-[linear-gradient(90deg,#4285F4_0%,#EA4335_25%,#FBBC05_50%,#34A853_75%,#4285F4_100%)] bg-clip-text text-transparent">
                G
              </span>
            </span>
            Continue with Google
          </span>
        </Button>
      </div>
    </AuthShell>
  )
}

export default Signup
