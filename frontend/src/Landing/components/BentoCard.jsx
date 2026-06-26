import { ArrowUpRight, Check, Workflow, Users2 } from 'lucide-react'

const BentoCard = ({ title, text, variant }) => {
  return (
    <article className="group overflow-hidden rounded-[22px] border border-border bg-white p-5 transition-transform duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold tracking-[-0.03em]">{title}</h3>
          <p className="max-w-sm text-sm leading-6 text-muted-foreground">{text}</p>
        </div>
        <ArrowUpRight className="size-4 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
      </div>

      <div className="mt-6 border-t border-border pt-5">
        {variant === 'architecture' ? <ArchitectureVisual /> : null}
        {variant === 'agents' ? <AgentsVisual /> : null}
        {variant === 'missions' ? <MissionsVisual /> : null}
        {variant === 'docs' ? <DocsVisual /> : null}
        {variant === 'workflow' ? <WorkflowVisual /> : null}
        {variant === 'alignment' ? <AlignmentVisual /> : null}
      </div>
    </article>
  )
}

const ArchitectureVisual = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-3 gap-3 text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground">
      <div className="border border-border bg-[linear-gradient(135deg,rgba(97,168,255,0.18),rgba(97,168,255,0.04))] p-3 text-center">Web App</div>
      <div className="border border-border bg-[linear-gradient(135deg,rgba(255,114,55,0.16),rgba(255,114,55,0.04))] p-3 text-center">API</div>
      <div className="border border-border bg-[linear-gradient(135deg,rgba(36,203,113,0.16),rgba(36,203,113,0.04))] p-3 text-center">Auth</div>
    </div>
    <div className="grid grid-cols-3 gap-3">
      <div className="h-1 bg-doc-blue" />
      <div className="h-1 bg-doc-orange" />
      <div className="h-1 bg-doc-green" />
    </div>
    <div className="grid grid-cols-3 gap-3 text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground">
      <div className="border border-border p-3 text-center">Agents</div>
      <div className="border border-border bg-muted p-3 text-center">Store</div>
      <div className="border border-border p-3 text-center">Files</div>
    </div>
  </div>
)

const AgentsVisual = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground">
      <span>Planner</span>
      <span>Architect</span>
      <span>Tester</span>
    </div>
    <div className="relative grid place-items-center py-4">
      <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(139,124,255,0.18),transparent_62%)]" />
      <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border" />
      <div className="grid grid-cols-2 gap-6">
        {['P', 'A', 'C', 'T'].map((letter, index) => (
          <div
            key={letter}
            className={`flex size-11 items-center justify-center border border-border shadow-sm ${
              index % 2 === 0 ? 'bg-muted' : 'bg-white'
            } text-sm font-semibold`}
          >
            {letter}
          </div>
        ))}
      </div>
    </div>
  </div>
)

const MissionsVisual = () => (
  <div className="space-y-3">
    {['Objective', 'Deliverables', 'Validation'].map((label, index) => (
      <div key={label} className="flex items-center gap-3 border border-border p-3">
        <div className="flex size-8 items-center justify-center border border-border bg-muted text-xs font-semibold">
          0{index + 1}
        </div>
        <div className="flex-1">
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{label}</p>
          <div className="mt-2 h-1 bg-border">
            <div
              className={`h-full ${index === 0 ? 'w-4/5 bg-doc-green' : index === 1 ? 'w-3/5 bg-doc-blue' : 'w-1/2 bg-doc-orange'}`}
            />
          </div>
        </div>
      </div>
    ))}
  </div>
)

const DocsVisual = () => (
  <div className="grid gap-3">
    {[
      { title: 'agents.md', accent: 'bg-doc-blue' },
      { title: 'architecture.md', accent: 'bg-doc-orange' },
      { title: 'build-plan.md', accent: 'bg-doc-green' },
    ].map((doc, index) => (
      <div key={doc.title} className="border border-border bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(247,247,247,0.75))] p-3">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 ${doc.accent}`} />
          <p className="text-sm font-medium">{doc.title}</p>
        </div>
        <div className="mt-3 h-px bg-border" />
        <div className="mt-3 space-y-2">
          <div className="h-2 bg-border" />
          <div className="h-2 w-5/6 bg-border" />
          <div className="h-2 w-2/3 bg-border" />
        </div>
        {index === 1 ? (
          <div className="mt-3 grid grid-cols-3 gap-2 text-[0.6rem] uppercase tracking-[0.22em] text-muted-foreground">
            <div className="border border-border bg-white p-1.5 text-center">Web</div>
            <div className="border border-border bg-white p-1.5 text-center">API</div>
            <div className="border border-border bg-white p-1.5 text-center">DB</div>
          </div>
        ) : null}
      </div>
    ))}
  </div>
)

const WorkflowVisual = () => (
  <div className="space-y-4">
    <div className="grid gap-3 sm:grid-cols-4">
      {['Idea', 'Refine', 'Plan', 'Build'].map((label, index) => (
        <div key={label} className="flex items-center gap-3">
          <div className="flex-1 border border-border bg-[linear-gradient(135deg,rgba(255,255,255,0.95),rgba(245,245,245,0.85))] p-3 text-center text-xs uppercase tracking-[0.24em] text-muted-foreground">
            {label}
          </div>
          {index < 3 ? <Workflow className="size-4 shrink-0 text-muted-foreground" /> : null}
        </div>
      ))}
    </div>
    <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-muted-foreground">
      <span>Scope</span>
      <span>Context</span>
      <span>Execution</span>
    </div>
  </div>
)

const AlignmentVisual = () => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      {['Team', 'Docs', 'AI', 'Build'].map((label) => (
        <div key={label} className="flex flex-col items-center gap-2">
          <div className="flex size-11 items-center justify-center border border-border bg-[linear-gradient(135deg,rgba(240,240,255,0.9),white)]">
            <Users2 className="size-4" />
          </div>
          <span className="text-[0.65rem] uppercase tracking-[0.24em] text-muted-foreground">
            {label}
          </span>
        </div>
      ))}
    </div>
    <div className="grid grid-cols-3 gap-2">
      {['Aligned', 'Shared', 'Ready'].map((label) => (
        <div key={label} className="flex items-center gap-2 border border-border bg-muted p-3">
          <Check className="size-4 text-doc-green" />
          <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{label}</span>
        </div>
      ))}
    </div>
  </div>
)

export default BentoCard
