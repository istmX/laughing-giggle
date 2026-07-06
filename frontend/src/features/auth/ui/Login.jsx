import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, LockKeyhole, Mail } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useGoogleAuth } from '@/features/auth/hooks/useGoogleAuth'
import AnimatedForm from '@/components/forgeui/animated-form'

import AuthShell from './AuthShell'

const Login = () => {
  const navigate = useNavigate()
  const { login, googleLogin, status, error } = useAuth()
  const [formError, setFormError] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { ready: googleReady, loading: googleLoading, error: googleError, signInWithGoogle } = useGoogleAuth({
    onCredential: async (credential) => {
      await googleLogin({ credential })
    },
  })

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormError('')

    try {
      await login({ email: email.trim(), password })
      navigate('/dashboard')
    } catch (submitError) {
      setFormError(submitError instanceof Error ? submitError.message : 'Unable to sign in')
    }
  }

  const handleGoogleSignIn = async () => {
    setFormError('')

    try {
      await signInWithGoogle()
      navigate('/dashboard')
    } catch (submitError) {
      setFormError(submitError instanceof Error ? submitError.message : 'Unable to sign in with Google')
    }
  }

  return (
    <AuthShell
      headline="Your ideas. Structured. Ready to"
      headlineAccent="build."
      description="Zenix turns your ideas into implementation-ready context for teams that want to move quickly without losing clarity."
      topActionPrefix="Don't have an account?"
      topActionLabel="Sign up"
      topActionHref="/signup"
    >
      <div className="space-y-5 max-[820px]:space-y-4">
        <div className="flex justify-center max-[820px]:justify-start">
          <AnimatedForm name="Alex Morgan" delay={5600} />
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl tracking-[-0.05em] max-[820px]:text-2xl sm:text-4xl">
            Welcome back
          </h2>
          <p className="max-w-lg text-base leading-7 text-muted-foreground">
            Sign in to continue building with Zenix.
          </p>
        </div>

        <form className="space-y-4 max-[820px]:space-y-3" onSubmit={handleSubmit}>
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground/80" htmlFor="login-email">
              Email
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="login-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-xl border-border bg-card pl-11 pr-4 text-base shadow-sm placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground/80" htmlFor="login-password">
              Password
            </label>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="login-password"
                name="password"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-xl border-border bg-card pl-11 pr-14 text-base shadow-sm placeholder:text-muted-foreground"
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Preview password"
              >
                <Eye className="size-5" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <label className="flex items-center gap-3 text-sm text-muted-foreground">
              <input
                type="checkbox"
                className="size-4 rounded border-border text-primary focus:ring-primary"
              />
              Remember me
            </label>
            <button type="button" className="text-sm font-medium text-primary">
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            disabled={status === 'loading'}
            size="lg"
            className="h-12 w-full rounded-full max-[820px]:h-11 disabled:translate-y-0"
          >
            {status === 'loading' ? 'Signing in...' : 'Sign in'}
            <span className="ml-3 text-xl leading-none">→</span>
          </Button>
        </form>

        {(formError || error || googleError) ? (
          <p className="text-sm text-destructive">{formError || error || googleError}</p>
        ) : null}

        <div className="flex items-center gap-4 max-[820px]:hidden">
          <span className="h-px flex-1 bg-border" />
          <span className="text-sm text-muted-foreground">or</span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignIn}
          disabled={!googleReady || googleLoading || status === 'loading'}
          size="lg"
          className="h-12 w-full rounded-full text-base max-[820px]:hidden"
        >
          <span className="flex items-center gap-4">
            <span className="grid size-7 place-items-center rounded-full bg-muted text-lg font-semibold text-foreground shadow-sm">
              G
            </span>
            {googleLoading ? 'Connecting...' : 'Continue with Google'}
          </span>
        </Button>

        <div className="rounded-2xl border border-border bg-card px-5 py-4 text-sm leading-6 text-muted-foreground shadow-sm max-[820px]:hidden">
          <div className="flex items-start gap-3">
            <LockKeyhole className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <p>
              Your data is encrypted and secure. By continuing, you agree to our{' '}
              <button type="button" className="font-medium text-primary">
                Terms
              </button>{' '}
              and{' '}
              <button type="button" className="font-medium text-primary">
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
