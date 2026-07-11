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
    <section ref={sectionRef} className="px-6 py-section md:px-8">
      <div className="mx-auto grid max-w-[1360px] gap-6 lg:grid-cols-[0.34fr_0.66fr]">
        <div data-reveal-card className="landing-panel flex flex-col justify-between gap-8">
          <div>
            <p className="text-caption uppercase tracking-caption text-brand-indigo">
              Product flow
            </p>
            <h2 className="mt-5 max-w-[12ch] text-balance text-[clamp(2.5rem,4vw,4.5rem)] font-[540] leading-[0.98] tracking-[-0.03em]">
              One explanation.
              <span className="block text-brand-indigo">Four clear stages.</span>
            </h2>
            <p className="mt-6 max-w-[28rem] text-body-sm text-ink-muted">
              The landing should explain the product with the same clarity the product promises:
              one input, one system, one reusable context layer.
            </p>
          </div>
          <div className="rounded-lg bg-block-lime px-6 py-5">
            <p className="text-body-sm text-foreground">
              Zenix is not another chat box. It is a structured workspace that converts intent
              into build-ready context.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {steps.map((step) => {
            const Icon = step.icon

            return (
              <article key={step.title} data-reveal-card className="landing-panel-soft">
                <div className="flex items-start justify-between gap-4">
                  <div className="grid size-12 place-items-center rounded-full bg-background text-brand-indigo shadow-xs">
                    <Icon className="size-5" />
                  </div>
                  <ArrowRight className="size-4 text-ink-soft" />
                </div>
                <h3 className="mt-10 max-w-[16ch] text-headline font-[540] tracking-headline text-balance">
                  {step.title}
                </h3>
                <p className="mt-4 max-w-[28ch] text-body-sm text-ink-muted">{step.text}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
