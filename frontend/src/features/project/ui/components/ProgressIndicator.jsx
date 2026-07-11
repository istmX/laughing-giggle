export function ProgressIndicator({ current, total }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-caption tracking-caption font-480 text-ink-muted uppercase">
        {total ? `Question ${current} / ${total}` : `Question ${current}`}
      </span>
    </div>
  )
}
