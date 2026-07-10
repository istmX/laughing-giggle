import { Button } from '@/components/ui/button'

const AuthSocialSection = ({
  actionLabel = 'Continue with Google',
  loadingLabel = 'Connecting...',
  onAction,
  ready = true,
  loading = false,
  disabled = false,
}) => {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <span className="h-px flex-1 bg-hairline" />
        <span className="text-body-sm text-ink-soft">or continue with</span>
        <span className="h-px flex-1 bg-hairline" />
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={onAction}
        disabled={!ready || loading || disabled}
        size="lg"
        className="h-14 w-full rounded-lg border-hairline bg-background text-body-sm text-foreground hover:bg-surface-soft"
      >
        <span className="flex items-center gap-4">
          <span className="grid size-8 place-items-center rounded-full bg-foreground text-sm font-semibold text-background">
            G
          </span>
          {loading ? loadingLabel : actionLabel}
        </span>
      </Button>
    </div>
  )
}

export default AuthSocialSection
