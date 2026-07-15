import { ArrowRight, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function AuthSubmitButton({ children, loading, disabled }) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className={cn(
        'group/btn relative flex h-[var(--spacing-xl)] w-full items-center justify-center gap-[var(--spacing-xs)] overflow-hidden',
        'rounded-[var(--radius-pill)] bg-ink px-[var(--spacing-lg)]',
        'text-[var(--text-button)] font-[var(--font-weight-480)] tracking-[var(--tracking-button)] text-canvas',
        'transition-all duration-300',
        'hover:shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:-translate-y-[1px]',
        'focus-visible:shadow-[0_0_0_3px_rgba(0,0,0,0.15),0_4px_20px_rgba(0,0,0,0.15)] focus-visible:outline-none',
        'active:translate-y-0 active:shadow-none',
        'disabled:pointer-events-none disabled:opacity-50',
      )}
    >
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 ease-out" />
      {loading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <>
          <span className="relative">{children}</span>
          <ArrowRight className="relative size-4 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
        </>
      )}
    </button>
  )
}
