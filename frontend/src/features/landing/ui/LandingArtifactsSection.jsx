import { useRef } from 'react'
import { Check, GitBranch, Network, PanelsTopLeft, ScrollText } from 'lucide-react'

import { useLandingSectionReveal } from '@/features/landing/hooks/useLandingSectionReveal'

const artifacts = [
  {
    icon: Network,
    title: 'architecture.md',
    tint: 'bg-block-lilac',
    bullets: ['Service map', 'Data boundaries', 'Dependency edges'],
  },
  {
    icon: GitBranch,
    title: 'build-plan.md',
    tint: 'bg-block-cream',
    bullets: ['Milestones', 'Task sequencing', 'Delivery phases'],
  },
  {
    icon: PanelsTopLeft,
    title: 'ui-rules.md',
    tint: 'bg-block-mint',
    bullets: ['Tokens', 'States', 'Interaction rules'],
  },
  {
    icon: ScrollText,
    title: 'missions',
    tint: 'bg-block-pink',
    bullets: ['Scoped tasks', 'Acceptance criteria', 'Implementation notes'],
  },
]

export function LandingArtifactsSection() {
  const sectionRef = useRef(null)

  useLandingSectionReveal(sectionRef)

  return (
    <section
      id="generated"
      ref={sectionRef}
      className="px-6 py-section md:px-8"
    >
      <div className="mx-auto max-w-[1360px] rounded-xl border border-hairline bg-surface-soft p-6 md:p-8">
        <div className="grid gap-6 lg:grid-cols-[0.32fr_0.68fr]">
          <div data-reveal-card className="flex flex-col justify-between gap-8">
            <div>
              <p className="text-caption uppercase tracking-caption text-brand-indigo">
                Generated outputs
              </p>
              <h2 className="mt-5 max-w-[11ch] text-balance text-[clamp(2.4rem,4vw,4.2rem)] font-[540] leading-[0.98] tracking-[-0.03em]">
                Real project context.
                <span className="block text-brand-indigo">Not loose prompts.</span>
              </h2>
              <p className="mt-6 max-w-[28rem] text-body-sm text-ink-muted">
                Instead of re-explaining the same project in fragments, Zenix builds the docs,
                rules, and instructions the team actually needs to ship.
              </p>
            </div>
            <div className="space-y-3">
              {['Reusable across tools', 'Consistent across agents', 'Structured for implementation'].map(
                (item) => (
                  <div
                    key={item}
                    data-reveal-item
                    className="flex items-center gap-3 text-body-sm text-ink-muted"
                  >
                    <span className="grid size-5 place-items-center rounded-full bg-brand-indigo text-white">
                      <Check className="size-3" />
                    </span>
                    {item}
                  </div>
                )
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {artifacts.map((artifact) => {
              const Icon = artifact.icon

              return (
                <article key={artifact.title} data-reveal-card className="landing-panel">
                  <div className={`rounded-lg ${artifact.tint} p-4`}>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-body-sm font-[540]">{artifact.title}</p>
                      <Icon className="size-5 text-foreground" />
                    </div>
                    <div className="mt-8 space-y-3">
                      {artifact.bullets.map((bullet) => (
                        <div
                          key={bullet}
                          data-reveal-item
                          className="rounded-md border border-hairline bg-background px-3 py-3 text-sm text-ink-muted"
                        >
                          {bullet}
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
