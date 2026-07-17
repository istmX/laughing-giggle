import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LockKeyhole, Mail } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'

import { useAuth } from '@/features/auth/hooks/useAuth'
import { useAuthStore } from '@/features/auth/store/auth.store'
import { useGoogleAuth } from '@/features/auth/hooks/useGoogleAuth'

import AuthShell from './AuthShell'
import AuthField from './AuthField'
import AuthSocialSection from './AuthSocialSection'
import { AuthSubmitButton } from './AuthSubmitButton'

const Login = () => {
  const navigate = useNavigate()
  const { login, googleLogin, status, error } = useAuth()
  const [formError, setFormError] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const prefersReducedMotion = useReducedMotion()
  const { ready, loading: googleLoading, error: googleError, signInWithGoogle } = useGoogleAuth({
    onCredential: async (credential) => { await googleLogin({ credential }) },
  })

  const isLoading = status === 'loading'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    try {
      const auth = await login({ email: email.trim(), password })
      if (auth?.token) navigate('/dashboard')
      else setFormError('Sign-in did not return user data. Please try again.')
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Unable to sign in')
    }
  }

  const handleGoogle = async () => {
    setFormError('')
    try {
      await signInWithGoogle()
      if (useAuthStore.getState().token) navigate('/dashboard')
      else setFormError('Google sign-in did not return user data.')
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Unable to sign in with Google')
    }
  }

  const fieldDelay = (i) => ({
    initial: prefersReducedMotion ? {} : { opacity: 0, y: 6 },
    animate: prefersReducedMotion ? {} : { opacity: 1, y: 0 },
    transition: { delay: 0.2 + i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  })

  return (
    <AuthShell panelTitle="Welcome back" panelDescription="Sign in to your workspace.">
      <form className="space-y-[var(--spacing-md)]" onSubmit={handleSubmit}>
        <motion.div {...fieldDelay(0)}>
          <AuthField label="Email" name="login-email" type="email" placeholder="you@example.com"
            value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" inputMode="email" icon={Mail} />
        </motion.div>

        <motion.div {...fieldDelay(1)}>
          <AuthField label="Password" name="login-password" type="password" placeholder="Enter your password"
            value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" icon={LockKeyhole} />
        </motion.div>

        <motion.div {...fieldDelay(2)} className="flex items-center justify-end">
          <Link to="/forgot-password" className="text-[var(--text-body-sm)] font-[var(--font-weight-330)] text-ink-muted transition-colors hover:text-ink">
            Forgot password?
          </Link>
        </motion.div>

        {(formError || error || googleError) && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="rounded-[var(--radius-sm)] bg-destructive/5 px-[var(--spacing-sm)] py-[var(--spacing-xs)] text-[var(--text-body-sm)] text-destructive">
            {formError || error || googleError}
          </motion.p>
        )}

        <motion.div {...fieldDelay(3)}>
          <AuthSubmitButton loading={isLoading}>Sign in</AuthSubmitButton>
        </motion.div>
      </form>

      <div className="mt-[var(--spacing-lg)]">
        <AuthSocialSection onAction={handleGoogle} ready={ready} loading={googleLoading} disabled={isLoading} />
      </div>

      <motion.p initial={prefersReducedMotion ? {} : { opacity: 0 }} animate={prefersReducedMotion ? {} : { opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-[var(--spacing-xl)] text-center text-[var(--text-body-sm)] font-[var(--font-weight-320)] text-ink-muted">
        Don&apos;t have an account?{' '}
        <Link to="/signup" className="font-[var(--font-weight-480)] text-ink transition-colors hover:text-ink/50">Sign up</Link>
      </motion.p>
    </AuthShell>
  )
}

export default Login
