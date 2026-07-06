import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, LockKeyhole, Mail } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useGoogleAuth } from '@/features/auth/hooks/useGoogleAuth'

import AuthShell from './AuthShell'
import AuthField from './AuthField'
import AuthSocialSection from './AuthSocialSection'

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
      const auth = await login({ email: email.trim(), password })

      if (auth?.token) {
        navigate('/dashboard')
      }
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
      panelTitle="Welcome back"
      panelDescription="Sign in to continue to your workspace."
    >
      <div className="space-y-6">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <AuthField
            label="Email"
            name="login-email"
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
            name="login-password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            icon={LockKeyhole}
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <label className="flex items-center gap-3 text-[0.95rem] text-white/60">
              <input
                type="checkbox"
                className="size-4 rounded border-white/20 bg-transparent text-white focus:ring-white/30"
              />
              Remember me
            </label>
            <button type="button" className="text-[0.95rem] font-medium text-white transition-colors hover:text-white/80">
              Forgot password?
            </button>
          </div>

          <Button
            type="submit"
            disabled={status === 'loading'}
            size="lg"
            className="h-14 w-full rounded-[18px] bg-white text-[15px] font-medium text-black hover:bg-white/92 disabled:translate-y-0"
          >
            {status === 'loading' ? 'Signing in...' : 'Sign in'}
            <ArrowRight className="ml-3 size-5" />
          </Button>
        </form>

        {formError || error || googleError ? (
          <p className="text-sm text-[#ff7b7b]">{formError || error || googleError}</p>
        ) : null}

        <AuthSocialSection
          onAction={handleGoogleSignIn}
          ready={googleReady}
          loading={googleLoading}
          disabled={status === 'loading'}
        />

        <p className="text-center text-[0.95rem] text-white/52">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="font-medium text-white transition-colors hover:text-white/80">
            Sign up
          </Link>
        </p>
      </div>
    </AuthShell>
  )
}

export default Login
