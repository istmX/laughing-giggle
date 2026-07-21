import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function AuthSubmitButton({ children, loading, loadingLabel = 'Working...', disabled }) {
  return (
    <Button
      type="submit"
      size="lg"
      disabled={loading || disabled}
      className="h-12 w-full gap-[var(--spacing-xs)] rounded-full bg-ink text-[15px] font-[var(--font-weight-480)] tracking-[var(--tracking-button)] text-canvas hover:bg-ink/85 focus-visible:ring-2 focus-visible:ring-ink/25"
    >
      {loading ? (
        <>
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          <span>{loadingLabel}</span>
        </>
      ) : (
        <span>{children}</span>
      )}
    </Button>
  )
}
