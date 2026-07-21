import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LockKeyhole, Mail, User, UserCircle2 } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'

import { useAuth } from '@/features/auth/hooks/useAuth'
import { useGoogleAuth } from '@/features/auth/hooks/useGoogleAuth'

import AuthShell from './AuthShell'
import AuthField from './AuthField'
import AuthSocialSection from './AuthSocialSection'
import { AuthSubmitButton } from './AuthSubmitButton'
import { Checkbox } from '@/components/ui/checkbox'
import { formatAuthError } from '../utils/error'
import { AuthErrorModal } from './AuthErrorModal'
import { useAuthStore } from '../store/auth.store'

const Signup = () => {
  const navigate = useNavigate()
  const { signup, googleLogin, status, error } = useAuth()
  const [formError, setFormError] = useState('')
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [dismissedError, setDismissedError] = useState('')
  const prefersReducedMotion = useReducedMotion()
  const { ready, loading: googleLoading, error: googleError, signInWithGoogle } = useGoogleAuth({
    onCredential: async (credential) => { await googleLogin({ credential }) },
  })

  const rawError = formError || error || googleError
  const errorKey = rawError ? String(rawError) : ''
  const modalOpen = Boolean(errorKey && errorKey !== dismissedError)
  const activeError = rawError ? formatAuthError(rawError) : ''

  const handleCloseModal = () => {
    setDismissedError(errorKey)
    setFormError('')
    useAuthStore.setState({ error: null })
  }

  const isLoading = status === 'loading'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    setDismissedError('')
    try {
      const auth = await signup({ name: name.trim(), username: username.trim(), email: email.trim(), password })
      const redirectUrl = new URLSearchParams(window.location.search).get('redirect') || '/dashboard'
      if (auth?.token) navigate(redirectUrl)
      else setFormError('Account created but sign-in failed. Please try logging in.')
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Unable to sign up')
    }
  }

  const handleGoogle = async () => {
    setFormError('')
    setDismissedError('')
    try {
      await signInWithGoogle()
      const redirectUrl = new URLSearchParams(window.location.search).get('redirect') || '/dashboard'
      navigate(redirectUrl)
    }
    catch (err) { setFormError(err instanceof Error ? err.message : 'Unable to sign up with Google') }
  }

  const fieldDelay = (i) => ({
    initial: prefersReducedMotion ? {} : { opacity: 0, y: 6 },
    animate: prefersReducedMotion ? {} : { opacity: 1, y: 0 },
    transition: { delay: 0.2 + i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  })

  const passwordScore = password.length >= 12 ? 'Strong' : password.length >= 8 ? 'Good' : password.length > 0 ? 'Weak' : ''

  return (
    <AuthShell panelTitle="Create your workspace" panelDescription="Start building with context that stays with you." accent="lilac">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <motion.div {...fieldDelay(0)} className="grid gap-6 sm:grid-cols-2">
          <AuthField label="Name" name="signup-name" type="text" placeholder="Jane Doe"
            value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" icon={UserCircle2} />
          <AuthField label="Username" name="signup-username" type="text" placeholder="janedoe"
            value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" icon={User} />
        </motion.div>

        <motion.div {...fieldDelay(1)}>
          <AuthField label="Email" name="signup-email" type="email" placeholder="you@example.com"
            value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" inputMode="email" icon={Mail} />
        </motion.div>

        <motion.div {...fieldDelay(2)}>
          <AuthField label="Password" name="signup-password" type="password" placeholder="Create a password"
            value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" icon={LockKeyhole} />
          {passwordScore && (
            <p className="mt-2 text-[12px] text-ink-muted" aria-live="polite">
              Password strength: <span className="font-[var(--font-weight-480)] text-ink">{passwordScore}</span>
            </p>
          )}
        </motion.div>

        <motion.label {...fieldDelay(3)}
          htmlFor="signup-terms"
          className="flex cursor-pointer items-start gap-[var(--spacing-sm)] text-[var(--text-body-sm)] leading-5 text-ink-muted">
          <Checkbox id="signup-terms" name="signup-terms" className="mt-0.5" />
          <span>I agree to the <Link to="/about" className="font-[var(--font-weight-480)] text-ink underline underline-offset-2 transition-colors hover:text-ink/70">terms</Link> and <Link to="/docs" className="font-[var(--font-weight-480)] text-ink underline underline-offset-2 transition-colors hover:text-ink/70">privacy policy</Link> for Zenix.</span>
        </motion.label>

        <motion.div {...fieldDelay(4)}>
          <AuthSubmitButton loading={isLoading} loadingLabel="Creating account...">Create account</AuthSubmitButton>
        </motion.div>
      </form>

      <div className="mt-[var(--spacing-lg)]">
        <AuthSocialSection onAction={handleGoogle} ready={ready} loading={googleLoading} disabled={isLoading} />
      </div>

      <motion.p initial={prefersReducedMotion ? {} : { opacity: 0 }} animate={prefersReducedMotion ? {} : { opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="mt-[var(--spacing-xl)] text-center text-[var(--text-body-sm)] font-[var(--font-weight-320)] text-ink-muted">
        Already have an account?{' '}
        <Link to="/login" className="font-[var(--font-weight-480)] text-ink transition-colors hover:text-ink/50">Sign in</Link>
      </motion.p>

      <AuthErrorModal isOpen={modalOpen} onClose={handleCloseModal} errorMessage={activeError} />
    </AuthShell>
  )
}

export default Signup
