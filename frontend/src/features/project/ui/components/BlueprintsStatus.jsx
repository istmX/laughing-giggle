import { Lock, FileText } from 'lucide-react'

export function BlueprintsStatus() {
  const blueprints = [
    { file: 'agents.md', desc: 'Agent guidelines, rules & build phases' },
    { file: 'design.md', desc: 'Design tokens, layout & variables' },
    { file: 'architecture.md', desc: 'Folder structure & storage layers' },
    { file: 'project-overview.md', desc: 'Project vision, journeys & inventory' }
  ]

  return (
    <div className="rounded-2xl border border-hairline bg-surface-soft p-5">
      <div className="flex items-center gap-2 mb-4">
        <Lock className="h-4.5 w-4.5 text-ink-muted" strokeWidth={1.8} />
        <h5 className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">Blueprint Status (Locked)</h5>
      </div>

      <div className="flex flex-col gap-3">
        {blueprints.map((bp) => (
          <div key={bp.file} className="flex items-start gap-3 p-3 rounded-xl bg-canvas/40 border border-hairline/45">
            <div className="h-7 w-7 rounded bg-surface-soft flex items-center justify-center shrink-0 mt-0.5 border border-hairline/20">
              <FileText className="h-4 w-4 text-ink-muted" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[13px] font-medium text-ink-muted/80 block font-mono">{bp.file}</span>
              <span className="text-[11.5px] text-ink-muted/60 leading-normal block mt-0.5">{bp.desc}</span>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-[12px] text-ink-muted/65 leading-relaxed font-normal">
        These consolidated context documents will compile automatically once you describe your idea and complete the interview in Zenix AI Chat.
      </p>
    </div>
  )
}
