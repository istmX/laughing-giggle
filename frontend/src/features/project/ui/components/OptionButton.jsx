export function OptionButton({ label, description, badge, isSelected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`group w-full flex items-start gap-4 rounded-xl border p-4 text-left transition-all ${
        isSelected 
          ? 'border-ink bg-surface-soft shadow-sm' 
          : 'border-hairline bg-canvas hover:border-ink/30 hover:bg-surface-soft/50'
      }`}
    >
      <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
        isSelected ? 'border-ink bg-ink' : 'border-ink-muted group-hover:border-ink'
      }`}>
        {isSelected && <div className="h-2 w-2 rounded-full bg-canvas" />}
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className={`text-body-lg font-330 transition-colors ${
            isSelected ? 'text-ink font-480' : 'text-ink-muted group-hover:text-ink'
          }`}>
            {label}
          </span>
          {badge && (
            <span className="rounded-full bg-surface-elevated border border-hairline px-2 py-0.5 text-[10px] font-540 uppercase tracking-wider text-ink-muted">
              {badge}
            </span>
          )}
        </div>
        {description && (
          <span className="text-body-sm text-ink-muted font-320">
            {description}
          </span>
        )}
      </div>
    </button>
  )
}
