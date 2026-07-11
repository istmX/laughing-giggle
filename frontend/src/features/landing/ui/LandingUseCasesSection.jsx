import { useRef } from 'react'
import { ArrowRight, BriefcaseBusiness, Rocket, Workflow } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { useLandingSectionReveal } from '@/features/landing/hooks/useLandingSectionReveal'

const useCases = [
  {
    icon: Rocket,
    title: 'Founders shipping the first version',
    copy: 'Turn rough product intent into architecture, requirements, and scoped build missions quickly.',
  },
  {
    icon: Workflow,
    title: 'Teams coordinating across multiple agents',
    copy: 'Keep every coding assistant aligned on the same project truth instead of re-briefing each one.',
  },
  {
    icon: BriefcaseBusiness,
    title: 'Studios delivering custom software',
    copy: 'Move from client brief to implementation-ready context without losing decisions in the handoff.',
  },
]

export function LandingUseCasesSection() {
  const sectionRef = useRef(null)

  useLandingSectionReveal(sectionRef)

  return (
    <section ref={sectionRef} className="px-6 py-section md:px-8">
      <div className="mx-auto max-w-[1360px] rounded-xl border border-hairline bg-white p-6 shadow-sm md:p-8">
        <div className="grid gap-6 xl:grid-cols-[0.36fr_0.64fr]">
          <div data-reveal-card className="rounded-xl bg-block-coral px-6 py-8 text-foreground shadow-sm">
            <p className="text-caption uppercase tracking-caption text-ink-soft">Who it is for</p>
            <h2 className="mt-5 max-w-[10ch] text-balance text-[clamp(2.3rem,3.8vw,4rem)] font-[540] leading-[1] tracking-[-0.03em]">
              Built for people shipping real software.
            </h2>
            <p className="mt-6 max-w-[28rem] text-body-sm text-ink-muted">
              The marketing page stays light, but this closing moment can still carry weight. It
              frames the product around practical use instead of vague AI claims.
            </p>
            <Button
              asChild
              className="mt-8 h-12 rounded-full bg-primary px-6 text-body-sm text-primary-foreground hover:bg-primary/90"
            >
              <Link to="/signup">
                Start with your project idea
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {useCases.map((useCase) => {
              const Icon = useCase.icon

              return (
                <article key={useCase.title} data-reveal-card className="landing-panel-soft">
                  <div className="grid size-12 place-items-center rounded-full bg-background text-brand-indigo shadow-xs">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-12 max-w-[14ch] text-headline font-[540] tracking-headline text-balance">
                    {useCase.title}
                  </h3>
                  <p className="mt-4 text-body-sm text-ink-muted">{useCase.copy}</p>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
