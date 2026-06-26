import { Eye, LockKeyhole, Mail } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import AuthShell from './AuthShell'

const Login = () => {
  return (
    <AuthShell
      headline="Your ideas. Structured. Ready to"
      headlineAccent="build."
      description="Zenix turns your ideas into implementation-ready context for teams that want to move quickly without losing clarity."
      topActionPrefix="Don’t have an account?"
      topActionLabel="Sign up"
      topActionHref="/signup"
    >
      <div className="space-y-5 max-[820px]:space-y-4">
        <div className="space-y-2">
          <h2 className="text-3xl tracking-[-0.05em] max-[820px]:text-2xl sm:text-4xl">
            Welcome back
          </h2>
          <p className="max-w-lg text-base leading-7 text-black/62">
            Sign in to continue building with Zenix.
          </p>
        </div>

        <form className="space-y-4 max-[820px]:space-y-3">
          <div className="space-y-3">
            <label className="text-sm font-medium text-black/82" htmlFor="login-email">
              Email
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-black/30" />
              <Input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                className="h-12 rounded-2xl border-black/12 bg-white/80 pl-11 pr-4 text-base shadow-[0_18px_45px_rgba(0,0,0,0.03)] placeholder:text-black/30 max-[820px]:h-11"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-black/82" htmlFor="login-password">
              Password
            </label>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-black/30" />
              <Input
                id="login-password"
                type="password"
                placeholder="••••••••••••"
                className="h-12 rounded-2xl border-black/12 bg-white/80 pl-11 pr-14 text-base shadow-[0_18px_45px_rgba(0,0,0,0.03)] placeholder:text-black/30 max-[820px]:h-11"
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

          <div className="flex items-center justify-between gap-4">
            <label className="flex items-center gap-3 text-sm text-black/70">
              <input
                type="checkbox"
                className="size-4 rounded border-black/20 text-[#4d49fc] focus:ring-[#4d49fc]"
              />
              Remember me
            </label>
            <button type="button" className="text-sm font-medium text-[#4d49fc]">
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            className="h-12 w-full rounded-full bg-black text-base text-white shadow-[0_20px_50px_rgba(0,0,0,0.18)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-black/90 max-[820px]:h-11"
          >
            Sign in
            <span className="ml-3 text-xl leading-none">→</span>
          </Button>
        </form>

        <div className="flex items-center gap-4 max-[820px]:hidden">
          <span className="h-px flex-1 bg-black/10" />
          <span className="text-sm text-black/45">or</span>
          <span className="h-px flex-1 bg-black/10" />
        </div>

        <Button
          type="button"
          variant="outline"
          className="h-12 w-full rounded-full border-black/15 bg-white/80 text-base text-black shadow-[0_16px_40px_rgba(0,0,0,0.04)] hover:bg-black/5 max-[820px]:hidden"
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

        <div className="rounded-3xl border border-black/10 bg-white/75 px-5 py-4 text-sm leading-6 text-black/68 shadow-[0_16px_45px_rgba(0,0,0,0.04)] backdrop-blur max-[820px]:hidden">
          <div className="flex items-start gap-3">
            <LockKeyhole className="mt-0.5 size-4 shrink-0 text-black/45" />
            <p>
              Your data is encrypted and secure. By continuing, you agree to our{' '}
              <button type="button" className="font-medium text-[#4d49fc]">
                Terms
              </button>{' '}
              and{' '}
              <button type="button" className="font-medium text-[#4d49fc]">
                Privacy Policy
              </button>
              .
            </p>
          </div>
        </div>
      </div>
    </AuthShell>
  )
}

export default Login
