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

          <label className="flex items-start gap-3 rounded-[16px] border border-white/10 bg-white/[0.02] px-4 py-4 text-[0.95rem] leading-6 text-white/58">
            <input
              type="checkbox"
              className="mt-1 size-4 rounded border-white/20 bg-transparent text-white focus:ring-white/30"
            />
            <span>I agree to the terms, privacy policy, and account creation flow for Zenix.</span>
          </label>

          <Button
            type="submit"
            disabled={status === 'loading'}
            size="lg"
            className="h-14 w-full rounded-[18px] bg-white text-[15px] font-medium text-black hover:bg-white/92 disabled:translate-y-0"
          >
            {status === 'loading' ? 'Creating account...' : 'Create account'}
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
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-white transition-colors hover:text-white/80">
            Sign in
          </Link>
        </p>
      </div>
    </AuthShell>
  )
}

export default Signup
