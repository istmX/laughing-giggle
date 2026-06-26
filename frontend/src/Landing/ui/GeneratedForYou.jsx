import ArtifactPreview from '@/Landing/components/ArtifactPreview'
import { generatedArtifacts } from '@/Landing/data'
import { ArrowLeft, ArrowRight } from 'lucide-react'

const GeneratedForYou = () => {
  return (
    <section id="generated" className="py-20 lg:py-28">
      <div className="rounded-[24px] border border-black bg-black p-5 text-white lg:p-6">
        <div className="grid gap-6 lg:grid-cols-[0.24fr_0.76fr]">
          <div className="space-y-8 p-2 lg:p-4">
            <div className="space-y-4">
              <p className="text-[0.7rem] uppercase tracking-[0.32em] text-white/45">
                Generated for you
              </p>
              <h2 className="max-w-[10ch] text-[clamp(2.2rem,3.4vw,3.3rem)] leading-[0.94] tracking-[-0.05em]">
                Everything your AI agent needs.
                <br />
                Before a single line of code.
              </h2>
            </div>
            <div className="hidden items-center gap-2 lg:flex">
              <button className="flex size-9 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/75">
                <ArrowLeft className="size-4" />
              </button>
              <button className="flex size-9 items-center justify-center rounded-full border border-white/15 bg-white text-black">
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto pb-2">
            <div className="flex min-w-max gap-4">
              {generatedArtifacts.map((artifact) => (
                <div key={artifact.title} className="w-[14.75rem] shrink-0">
                  <ArtifactPreview
                    title={artifact.title}
                    label={artifact.label}
                    summary=""
                    accent={artifact.accent}
                    tone={artifact.tone || 'light'}
                    lines={[]}
                    className="h-[23rem]"
                  >
                    {artifact.variant === 'agents' ? <AgentsCard /> : null}
                    {artifact.variant === 'architecture' ? <ArchitectureCard /> : null}
                    {artifact.variant === 'plan' ? <PlanCard /> : null}
                    {artifact.variant === 'ui' ? <UiCard /> : null}
                    {artifact.variant === 'mission' ? <MissionCard /> : null}
                  </ArtifactPreview>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const AgentsCard = () => (
  <div className="space-y-6">
    <div className="relative mx-auto h-28 w-28">
      <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border bg-white shadow-sm" />
      {[
        ['left-1 top-2', 'bg-[#a78bfa]'],
        ['right-0 top-5', 'bg-[#60a5fa]'],
        ['left-8 bottom-0', 'bg-[#f472b6]'],
      ].map(([pos, color]) => (
        <span key={pos} className={`absolute ${pos} h-10 w-10 rounded-full ${color} shadow-[0_8px_18px_rgba(0,0,0,0.1)]`} />
      ))}
      <div className="absolute left-1/2 top-1/2 h-[1px] w-20 -translate-x-1/2 -translate-y-1/2 bg-border" />
      <div className="absolute left-1/2 top-1/2 h-20 w-[1px] -translate-x-1/2 -translate-y-1/2 bg-border" />
    </div>
    <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">5 agents • 12 workflows</p>
  </div>
)

const ArchitectureCard = () => (
  <div className="space-y-4">
    <div className="grid grid-cols-3 gap-2 text-[0.58rem] uppercase tracking-[0.2em] text-muted-foreground">
      {['Web App', 'API Gateway', 'Auth Service', 'AI Agents', 'Data Store', 'File Storage'].map((item) => (
        <div key={item} className="rounded-[8px] border border-border bg-white px-2 py-3 text-center shadow-[0_4px_12px_rgba(0,0,0,0.04)]">
          {item}
        </div>
      ))}
    </div>
    <div className="space-y-2 pt-1 text-xs text-muted-foreground">
      <p className="font-medium text-black">Tech Stack</p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        <span>- Next.js</span>
        <span>- Node.js</span>
        <span>- PostgreSQL</span>
        <span>- Redis</span>
        <span>- Docker</span>
      </div>
    </div>
  </div>
)

const PlanCard = () => (
  <div className="space-y-5 pt-1">
    {[
      ['Phase 1 - Foundation', '100%', 'w-full bg-doc-green'],
      ['Phase 2 - Core Features', '70%', 'w-4/5 bg-doc-orange'],
      ['Phase 3 - Advanced', '30%', 'w-3/10 bg-doc-purple'],
      ['Phase 4 - Polish & Ship', '0%', 'w-0 bg-border'],
    ].map(([label, value, fill]) => (
      <div key={label} className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{label}</span>
          <span>{value}</span>
        </div>
        <div className="h-1.5 rounded-full bg-border">
          <div className={`h-full rounded-full ${fill}`} />
        </div>
      </div>
    ))}
    <p className="pt-1 text-xs uppercase tracking-[0.22em] text-muted-foreground">4 phases • 24 tasks</p>
  </div>
)

const UiCard = () => (
  <div className="space-y-4 pt-1">
    <div className="space-y-2">
      <p className="text-xs font-medium text-black">Design Principles</p>
      <ul className="space-y-1 text-sm text-muted-foreground">
        <li>• Clarity</li>
        <li>• Consistency</li>
        <li>• Accessibility</li>
        <li>• Minimalism</li>
      </ul>
    </div>
    <div className="space-y-3">
      <p className="text-xs font-medium text-black">Color Palette</p>
      <div className="flex items-end gap-2">
        <span className="h-8 w-5 rounded-sm bg-[#111827]" />
        <span className="h-9 w-5 rounded-sm bg-[#3b82f6]" />
        <span className="h-10 w-5 rounded-sm bg-[#8b5cf6]" />
        <span className="h-9 w-5 rounded-sm bg-[#f97316]" />
        <span className="h-8 w-5 rounded-sm bg-[#fbbf24]" />
      </div>
    </div>
  </div>
)

const MissionCard = () => (
  <div className="space-y-5 pt-1">
    <div className="space-y-1">
      <p className="text-xs uppercase tracking-[0.24em] text-white/55">## Objective</p>
      <p className="text-sm leading-6 text-white/80">
        Secure authentication system with registration, login and JWT support.
      </p>
    </div>
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-[0.24em] text-white/55">## Deliverables</p>
      <ul className="space-y-1 text-sm text-white/80">
        <li>• auth.controller.ts</li>
        <li>• auth.service.ts</li>
        <li>• auth.routes.ts</li>
        <li>• auth.middleware.ts</li>
      </ul>
    </div>
    <p className="text-xs uppercase tracking-[0.24em] text-white/55">+ 6 more deliverables</p>
  </div>
)

export default GeneratedForYou
