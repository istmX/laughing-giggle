import SectionHeading from '@/Landing/components/SectionHeading'
import {
  ArrowRight,
  Boxes,
  Check,
  Files,
  Users2,
  Workflow,
  BrainCircuit,
} from 'lucide-react'

const cards = [
  {
    title: 'AI Agents',
    text: 'Specialized agents work together to analyze, plan, and generate perfect context.',
    icon: BrainCircuit,
    variant: 'agents',
    span: 'lg:col-span-7',
  },
  {
    title: 'Architecture Design',
    text: 'System design, data flow, APIs, and infrastructure planned for scale.',
    icon: Boxes,
    variant: 'architecture',
    span: 'lg:col-span-5',
  },
  {
    title: 'Mission Generation',
    text: 'AI-ready tasks with clear inputs, outputs, and success criteria.',
    icon: Workflow,
    variant: 'missions',
    span: 'lg:col-span-4',
  },
  {
    title: 'Documentation',
    text: 'All your docs, standards, and guidelines ready for your team or AI.',
    icon: Files,
    variant: 'docs',
    span: 'lg:col-span-4',
  },
  {
    title: 'Team Workflow',
    text: 'Built for solo builders and teams. Stay aligned from day one.',
    icon: Users2,
    variant: 'team',
    span: 'lg:col-span-4',
  },
]

const Problem = () => {
  return (
    <section className="py-20 lg:py-28">
      <div className="grid gap-10 lg:grid-cols-[0.28fr_0.72fr] lg:items-start">
        <SectionHeading
          eyebrow="More than docs."
          title="A system that thinks before code."
          description="Specialized agents work together to analyze, plan, and generate perfect context."
        />

        <div className="grid gap-4 lg:grid-cols-12">
          {cards.map((card, index) => (
            <article
              key={card.title}
              className={[
                'group overflow-hidden rounded-[20px] border border-border bg-white p-4 transition-transform duration-300 hover:-translate-y-1',
                card.span,
                index === 0 ? 'lg:col-span-7' : '',
                index === 1 ? 'lg:col-span-5' : '',
                index >= 2 ? 'lg:col-span-4' : '',
              ].join(' ')}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-medium tracking-[-0.04em]">{card.title}</h3>
                  <p className="max-w-sm text-sm leading-6 text-muted-foreground">{card.text}</p>
                </div>
                <div className="flex size-10 items-center justify-center rounded-full border border-border bg-white">
                  <ArrowRight className="size-4 text-muted-foreground" />
                </div>
              </div>
              <div className="mt-5 min-h-[8.5rem] border-t border-border pt-5">
                {card.variant === 'agents' ? <AgentsVisual /> : null}
                {card.variant === 'architecture' ? <ArchitectureVisual /> : null}
                {card.variant === 'missions' ? <MissionsVisual /> : null}
                {card.variant === 'docs' ? <DocsVisual /> : null}
                {card.variant === 'team' ? <TeamVisual /> : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

const AgentsVisual = () => (
  <div className="grid grid-cols-12 items-center gap-3">
    <div className="col-span-4 space-y-2">
      <div className="h-16 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(168,85,247,0.9),rgba(168,85,247,0.15)_68%)] shadow-[0_14px_30px_rgba(168,85,247,0.25)]" />
      <div className="mx-auto h-8 w-8 rounded-full border border-border bg-white shadow-sm" />
    </div>
    <div className="col-span-4 space-y-2">
      <div className="h-20 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(96,165,250,0.95),rgba(96,165,250,0.12)_68%)] shadow-[0_14px_30px_rgba(96,165,250,0.18)]" />
      <div className="mx-auto h-8 w-8 rounded-full border border-border bg-white shadow-sm" />
    </div>
    <div className="col-span-4 space-y-2">
      <div className="h-16 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(196,181,253,0.95),rgba(196,181,253,0.14)_68%)] shadow-[0_14px_30px_rgba(196,181,253,0.2)]" />
      <div className="mx-auto h-8 w-8 rounded-full border border-border bg-white shadow-sm" />
    </div>
  </div>
)

const ArchitectureVisual = () => (
  <div className="relative min-h-[8.5rem] overflow-hidden">
    <svg viewBox="0 0 420 220" className="h-full w-full">
      <defs>
        <linearGradient id="cubeBlue" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#61a8ff" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#d9f0ff" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="cubeOrange" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#ff7237" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#ffd4bf" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="cubeGreen" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#24cb71" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#caf8df" stopOpacity="0.85" />
        </linearGradient>
      </defs>
      <g transform="translate(14 20)">
        <Cube x="0" y="80" fill="url(#cubeBlue)" />
        <Cube x="76" y="60" fill="url(#cubeOrange)" />
        <Cube x="154" y="92" fill="url(#cubeBlue)" />
        <Cube x="232" y="34" fill="url(#cubeGreen)" />
        <Cube x="310" y="72" fill="url(#cubeBlue)" />
      </g>
    </svg>
  </div>
)

const Cube = ({ x, y, fill }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M30 0 L60 15 L30 30 L0 15 Z" fill={fill} />
    <path d="M0 15 L30 30 L30 64 L0 49 Z" fill="rgba(33,37,41,0.08)" />
    <path d="M60 15 L30 30 L30 64 L60 49 Z" fill="rgba(255,255,255,0.55)" />
    <path d="M0 15 L30 0 L60 15 L30 30 Z" fill="rgba(255,255,255,0.35)" />
  </g>
)

const MissionsVisual = () => (
  <div className="space-y-3">
    {['Objective', 'Deliverables', 'Validation'].map((label, index) => (
      <div key={label} className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-full border border-border bg-white">
          <Check className="size-4 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{label}</p>
          <div className="mt-2 h-1.5 rounded-full bg-border">
            <div
              className={`h-full rounded-full ${
                index === 0 ? 'w-4/5 bg-doc-green' : index === 1 ? 'w-3/5 bg-doc-blue' : 'w-1/2 bg-doc-orange'
              }`}
            />
          </div>
        </div>
      </div>
    ))}
  </div>
)

const DocsVisual = () => (
  <div className="space-y-3">
    {['agents.md', 'architecture.md', 'build-plan.md'].map((doc, index) => (
      <div key={doc} className="rounded-[12px] border border-border bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,247,247,0.86))] p-3">
        <div className="flex items-center gap-2">
          <div className={`size-2.5 rounded-full ${index === 0 ? 'bg-doc-blue' : index === 1 ? 'bg-doc-orange' : 'bg-doc-green'}`} />
          <p className="text-sm font-medium">{doc}</p>
        </div>
        <div className="mt-3 space-y-2">
          <div className="h-2 rounded-full bg-border" />
          <div className="h-2 w-5/6 rounded-full bg-border" />
          <div className="h-2 w-2/3 rounded-full bg-border" />
        </div>
      </div>
    ))}
  </div>
)

const TeamVisual = () => (
  <div className="grid grid-cols-3 gap-3">
    {['S', 'A', 'T'].map((letter, index) => (
      <div key={letter} className="space-y-3 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-border bg-white shadow-sm">
          {letter}
        </div>
        <div className={`mx-auto h-3 w-3 rounded-full ${index === 0 ? 'bg-doc-blue' : index === 1 ? 'bg-doc-orange' : 'bg-doc-purple'}`} />
      </div>
    ))}
  </div>
)

export default Problem
