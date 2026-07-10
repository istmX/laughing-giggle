import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, LockKeyhole, Mail, User, UserCircle2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useGoogleAuth } from '@/features/auth/hooks/useGoogleAuth'

import AuthShell from './AuthShell'
import AuthField from './AuthField'
import AuthSocialSection from './AuthSocialSection'

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
      const auth = await signup({ name: name.trim(), username: username.trim(), email: email.trim(), password })

      if (auth?.token) {
        navigate('/dashboard')
      } else {
        setFormError('Account created but sign-in failed. Please try logging in.')
      }
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
      panelTitle="Create your account"
      panelDescription="Set up your workspace and start organizing your context."
    >
      <div className="space-y-6">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-5 sm:grid-cols-2">
            <AuthField
              label="Name"
              name="signup-name"
              type="text"
              placeholder="Jane Doe"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              icon={UserCircle2}
            />

            <AuthField
              label="Username"
              name="signup-username"
              type="text"
              placeholder="janedoe"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              icon={User}
            />
          </div>

          <AuthField
            label="Email"
            name="signup-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            inputMode="email"
            icon={Mail}
          />

          <AuthField
            label="Password"
            name="signup-password"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            icon={LockKeyhole}
          />

          <label className="flex items-start gap-3 rounded-lg border border-hairline bg-surface-soft px-4 py-4 text-body-sm leading-6 text-ink-muted">
            <input
              type="checkbox"
              className="mt-1 size-4 rounded border-border bg-background accent-primary focus:ring-primary/30"
            />
            <span>I agree to the terms, privacy policy, and account creation flow for Zenix.</span>
          </label>

          <Button
            type="submit"
            disabled={status === 'loading'}
            size="lg"
            className="h-14 w-full rounded-lg bg-primary text-body-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:translate-y-0"
          >
            {status === 'loading' ? 'Creating account...' : 'Create account'}
            <ArrowRight className="ml-3 size-5" />
          </Button>
        </form>

        {formError || error || googleError ? (
          <p className="text-sm text-destructive">{formError || error || googleError}</p>
        ) : null}

        <AuthSocialSection
          onAction={handleGoogleSignIn}
          ready={googleReady}
          loading={googleLoading}
          disabled={status === 'loading'}
        />

        <p className="text-center text-body-sm text-ink-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-foreground transition-colors hover:text-ink-soft">
            Sign in
          </Link>
        </p>
      </div>
    </AuthShell>
  )
}

export default Signup
