export function ProgressIndicator({ current, total }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-caption tracking-caption font-480 text-ink-muted uppercase">
        Question {current} / {total}
      </span>
    </div>
  )
}
