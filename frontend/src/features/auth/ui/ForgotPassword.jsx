import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'

import { requestPasswordReset } from '@/features/auth/api/auth.api'

import AuthShell from './AuthShell'
import AuthField from './AuthField'
import { AuthSubmitButton } from './AuthSubmitButton'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | sent | error
  const [formError, setFormError] = useState('')
  const prefersReducedMotion = useReducedMotion()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    setStatus('loading')
    try {
      await requestPasswordReset({ email: email.trim() })
      setStatus('sent')
    } catch (err) {
      setStatus('error')
      setFormError(err instanceof Error ? err.message : 'Unable to send reset link')
    }
  }

  const fieldDelay = (i) => ({
    initial: prefersReducedMotion ? {} : { opacity: 0, y: 6 },
    animate: prefersReducedMotion ? {} : { opacity: 1, y: 0 },
    transition: { delay: 0.2 + i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  })

  return (
    <AuthShell panelTitle="Reset your password" panelDescription="We'll email you a link to reset it.">
      {status === 'sent' ? (
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0, y: 8 }}
          animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <div className="mx-auto mb-[var(--spacing-md)] flex size-12 items-center justify-center rounded-full bg-surface-soft text-brand-indigo">
            <Mail className="size-5" strokeWidth={1.5} />
          </div>
          <p className="text-[var(--text-body)] font-[var(--font-weight-320)] leading-[1.5] text-ink-muted">
            If an account exists for <span className="font-[var(--font-weight-480)] text-ink">{email.trim()}</span>,
            a reset link is on its way. Check your inbox shortly.
          </p>
          <Link
            to="/login"
            className="mt-[var(--spacing-lg)] inline-block text-[var(--text-body-sm)] font-[var(--font-weight-480)] text-ink underline underline-offset-4 transition-colors hover:text-ink/60"
          >
            Back to sign in
          </Link>
        </motion.div>
      ) : (
        <form className="space-y-[var(--spacing-md)]" onSubmit={handleSubmit}>
          <motion.div {...fieldDelay(0)}>
            <AuthField label="Email" name="forgot-email" type="email" placeholder="you@example.com"
              value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" inputMode="email" icon={Mail} />
          </motion.div>

          {formError && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="rounded-[var(--radius-sm)] bg-destructive/5 px-[var(--spacing-sm)] py-[var(--spacing-xs)] text-[var(--text-body-sm)] text-destructive">
              {formError}
            </motion.p>
          )}

          <motion.div {...fieldDelay(1)}>
            <AuthSubmitButton loading={status === 'loading'}>Send reset link</AuthSubmitButton>
          </motion.div>
        </form>
      )}

      <motion.p initial={prefersReducedMotion ? {} : { opacity: 0 }} animate={prefersReducedMotion ? {} : { opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-[var(--spacing-xl)] text-center text-[var(--text-body-sm)] font-[var(--font-weight-320)] text-ink-muted">
        Remembered it?{' '}
        <Link to="/login" className="font-[var(--font-weight-480)] text-ink transition-colors hover:text-ink/50">Sign in</Link>
      </motion.p>
    </AuthShell>
  )
}

export default ForgotPassword
