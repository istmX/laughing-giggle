import { cn } from '@/lib/utils'

const GoogleIcon = () => (
  <svg className="size-[18px]" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
)

const AuthSocialSection = ({ actionLabel = 'Continue with Google', loadingLabel = 'Connecting...', onAction, ready = true, loading = false, disabled = false }) => (
  <div className="space-y-[var(--spacing-md)]">
    <div className="flex items-center gap-[var(--spacing-lg)]">
      <span className="h-px flex-1 bg-hairline/80" />
      <span className="text-[11px] font-mono uppercase tracking-[0.1em] text-ink/25">or</span>
      <span className="h-px flex-1 bg-hairline/80" />
    </div>

    <button type="button" onClick={onAction} disabled={!ready || loading || disabled}
      className={cn(
        'flex h-[var(--spacing-xl)] w-full items-center justify-center gap-[var(--spacing-sm)] rounded-[var(--radius-md)]',
        'border border-hairline bg-canvas',
        'text-[var(--text-body-sm)] font-[var(--font-weight-330)] tracking-[var(--tracking-body-sm)] text-ink/70',
        'transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]',
        'hover:border-ink/15 hover:bg-surface-soft hover:text-ink hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]',
        'focus:border-ink focus:shadow-[0_0_0_3px_rgba(0,0,0,0.04)] focus:ring-0 focus:outline-none',
        'disabled:pointer-events-none disabled:opacity-40 active:scale-[0.99]',
      )}>
      <GoogleIcon />
      {loading ? loadingLabel : actionLabel}
    </button>
  </div>
)

export default AuthSocialSection
