import { useRef } from 'react'
import { ArrowRight, Blocks, FolderKanban, MessageSquareMore, Sparkles } from 'lucide-react'

import { useLandingSectionReveal } from '@/features/landing/hooks/useLandingSectionReveal'

const steps = [
  {
    icon: MessageSquareMore,
    title: 'Describe the product once',
    text: 'Start with a rough idea, product goal, or feature request. Zenix turns that into structured project understanding.',
  },
  {
    icon: Sparkles,
    title: 'Complete the missing context',
    text: 'It asks for the gaps that matter so requirements, scope, and constraints stop getting reinvented later.',
  },
  {
    icon: Blocks,
    title: 'Generate the working system',
    text: 'Architecture, UI rules, schemas, contracts, and coding standards arrive as a coherent set instead of scattered notes.',
  },
  {
    icon: FolderKanban,
    title: 'Hand it to any coding agent',
    text: 'Every AI tool gets the same clean source of truth, so the implementation stays consistent as work expands.',
  },
]

export function LandingProcessSection() {
  const sectionRef = useRef(null)

  useLandingSectionReveal(sectionRef)

  return (
    <section id="how-it-works" ref={sectionRef} className="px-6 py-section md:px-8">
      <div className="mx-auto grid max-w-[1360px] gap-8 lg:grid-cols-[0.34fr_0.66fr] lg:items-start">
        <div data-reveal-card className="max-w-[32rem]">
          <div>
            <p className="text-caption uppercase tracking-caption text-brand-indigo">
              How it works
            </p>
            <h2 className="mt-5 max-w-[12ch] text-balance text-[clamp(2.5rem,4vw,4.5rem)] font-[540] leading-[0.98] tracking-[-0.03em]">
              Move from rough idea
              <span className="block text-brand-indigo">to ready-to-build.</span>
            </h2>
            <p className="mt-6 max-w-[28rem] text-body-sm text-ink-muted">
              Each step reduces a real source of delivery risk: missing requirements, drifting
              scope, inconsistent agent output, and weak handoffs across the team.
            </p>
          </div>
        </div>

        <div
          data-reveal-card
          className="rounded-xl border border-hairline bg-white px-6 py-8 shadow-sm"
        >
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {steps.map((step, index) => {
            const Icon = step.icon

            return (
              <article key={step.title} data-reveal-item className="relative">
                <div className="flex items-start justify-between gap-4">
                  <div className="grid size-12 place-items-center rounded-full bg-surface-soft text-brand-indigo shadow-xs">
                    <Icon className="size-5" />
                  </div>
                  {index < steps.length - 1 ? (
                    <ArrowRight className="hidden size-4 text-ink-soft xl:block" />
                  ) : null}
                </div>
                <h3 className="mt-8 max-w-[16ch] text-headline font-[540] tracking-headline text-balance">
                  {step.title}
                </h3>
                <p className="mt-4 max-w-[28ch] text-body-sm text-ink-muted">{step.text}</p>
              </article>
            )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
