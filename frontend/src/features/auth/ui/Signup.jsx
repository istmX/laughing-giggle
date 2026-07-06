import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, LockKeyhole, Mail, User, UserCircle2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useGoogleAuth } from '@/features/auth/hooks/useGoogleAuth'
import AnimatedForm from '@/components/forgeui/animated-form'

import AuthShell from './AuthShell'

const Signup = () => {
  const navigate = useNavigate()
  const { signup, googleLogin, status, error } = useAuth()
  const [formError, setFormError] = useState('')
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
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
      await signup({ name: name.trim(), username: username.trim(), email: email.trim(), password })
      navigate('/dashboard')
    } catch (submitError) {
      setFormError(submitError instanceof Error ? submitError.message : 'Unable to sign up')
    }
  }

  const handleGoogleSignIn = async () => {
    setFormError('')

    try {
      await signInWithGoogle()
      navigate('/dashboard')
    } catch (submitError) {
      setFormError(submitError instanceof Error ? submitError.message : 'Unable to sign up with Google')
    }
  }

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
        <div className="flex justify-center max-[860px]:justify-start">
          <AnimatedForm name="Alex Morgan" delay={6200} />
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl tracking-[-0.05em] max-[860px]:text-2xl sm:text-4xl">
            Create your account
          </h2>
          <p className="max-w-lg text-base leading-7 text-muted-foreground">
            Add your details below to get started with Zenix.
          </p>
        </div>

        <form className="space-y-4 max-[860px]:space-y-3" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-1">
              <label className="text-sm font-medium text-foreground/80" htmlFor="signup-name">
                Name
              </label>
              <div className="relative">
                <UserCircle2 className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="signup-name"
                  name="name"
                  type="text"
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 rounded-xl border-border bg-card pl-11 pr-4 text-base shadow-sm placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div className="space-y-2 sm:col-span-1">
              <label className="text-sm font-medium text-foreground/80" htmlFor="signup-username">
                Username
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="signup-username"
                  name="username"
                  type="text"
                  placeholder="janedoe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-12 rounded-xl border-border bg-card pl-11 pr-4 text-base shadow-sm placeholder:text-muted-foreground"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80" htmlFor="signup-email">
              Email
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="signup-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-xl border-border bg-card pl-11 pr-4 text-base shadow-sm placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/80" htmlFor="signup-password">
              Password
            </label>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="signup-password"
                name="password"
                type="password"
                placeholder="Create a password"
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

          <label className="flex items-start gap-3 rounded-2xl border border-border bg-card px-4 py-4 text-sm leading-6 text-muted-foreground shadow-sm">
            <input
              type="checkbox"
              className="mt-1 size-4 rounded border-border text-primary focus:ring-primary"
            />
            <span>
              I agree to the terms, privacy policy, and account creation flow for Zenix.
            </span>
          </label>

          <Button
            type="submit"
            disabled={status === 'loading'}
            size="lg"
            className="h-12 w-full rounded-full max-[860px]:h-11 disabled:translate-y-0"
          >
            {status === 'loading' ? 'Creating account...' : 'Create account'}
            <span className="ml-3 text-xl leading-none">→</span>
          </Button>
        </form>

        {(formError || error || googleError) ? (
          <p className="text-sm text-destructive">{formError || error || googleError}</p>
        ) : null}

        <div className="flex items-center gap-4 max-[860px]:hidden">
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
          className="h-12 w-full rounded-full text-base max-[860px]:hidden"
        >
          <span className="flex items-center gap-4">
            <span className="grid size-7 place-items-center rounded-full bg-muted text-lg font-semibold text-foreground shadow-sm">
              G
            </span>
            {googleLoading ? 'Connecting...' : 'Continue with Google'}
          </span>
        </Button>
      </div>
    </AuthShell>
  )
}

export default Signup
