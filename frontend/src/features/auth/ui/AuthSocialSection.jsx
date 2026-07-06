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
        <span className="h-px flex-1 bg-white/10" />
        <span className="text-[0.95rem] text-white/48">or continue with</span>
        <span className="h-px flex-1 bg-white/10" />
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={onAction}
        disabled={!ready || loading || disabled}
        size="lg"
        className="h-14 w-full rounded-[18px] border-white/12 bg-white/[0.03] text-[15px] text-white hover:bg-white/[0.06]"
      >
        <span className="flex items-center gap-4">
          <span className="grid size-8 place-items-center rounded-full bg-white text-sm font-semibold text-black">
            G
          </span>
          {loading ? loadingLabel : actionLabel}
        </span>
      </Button>
    </div>
  )
}

export default AuthSocialSection
