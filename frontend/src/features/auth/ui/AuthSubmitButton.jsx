import { ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function AuthSubmitButton({ children, loading, disabled }) {
  return (
    <Button
      type="submit"
      size="lg"
      disabled={loading || disabled}
      className="h-[var(--spacing-xl)] w-full gap-[var(--spacing-xs)] bg-ink text-canvas hover:bg-ink/90 text-[var(--text-button)] font-[var(--font-weight-480)] tracking-[var(--tracking-button)]"
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <>
          <span>{children}</span>
          <ArrowRight className="size-4 transition-transform duration-200 group-hover/button:translate-x-0.5" />
        </>
      )}
    </Button>
  )
}
