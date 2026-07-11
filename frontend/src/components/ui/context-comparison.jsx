import { useRef } from 'react'
import { ArrowRight, Check, CircleDot, Sparkles } from 'lucide-react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const withoutPrompts = [
  'Explain the project...',
  'What tech stack?',
  'What about auth?',
  'Can you add payments?',
  'Now change the database',
  'Add error handling',
]

const withOutputs = [
  'Architecture',
  'Database schema',
  'API contracts',
  'UI / design system',
  'Coding standards',
  'Implementation plan',
  'AI agent instructions',
]

const benefits = ['One explanation', 'Complete understanding', 'Consistent across all agents', 'Build faster with confidence']

export function ContextComparison() {
  const sectionRef = useRef(null)

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const cards = sectionRef.current.querySelectorAll('[data-compare-card]')
      const nodes = sectionRef.current.querySelectorAll('[data-compare-node]')
      const lines = sectionRef.current.querySelectorAll('[data-compare-line]')

      if (reduceMotion) {
        gsap.set([cards, nodes, lines], { clearProps: 'all' })
        return
      }

      gsap
        .timeline({
          defaults: { ease: 'power3.out' },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 72%',
            once: true,
          },
        })
        .from(cards, { y: 42, autoAlpha: 0, duration: 0.82, stagger: 0.12 })
        .from(nodes, { scale: 0.88, autoAlpha: 0, duration: 0.62, stagger: 0.05 }, '-=0.44')
        .from(lines, { scaleX: 0, transformOrigin: 'left center', duration: 0.9, stagger: 0.04 }, '-=0.58')
    },
    { scope: sectionRef }
  )

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-background px-6 py-section md:px-8">
      <div className="landing-section-ambient absolute inset-0" />
      <div className="relative mx-auto grid max-w-[1360px] gap-6 lg:grid-cols-[0.26fr_0.39fr_0.35fr]">
        <aside data-compare-card className="landing-panel">
          <p className="text-caption uppercase tracking-caption text-brand-indigo">Why Zenix</p>
          <h2 className="mt-5 text-[clamp(2.4rem,4vw,4rem)] font-[540] leading-[0.98] tracking-[-0.03em] text-balance">
            Stop repeating.
            <span className="block text-brand-indigo">Start building.</span>
          </h2>
          <p className="mt-6 text-body-sm text-ink-muted">
            Every time you start a project, you lose hours explaining the same things to different AI tools.
            Zenix makes that the last time.
          </p>
          <div className="mt-8 space-y-3">
            {benefits.map((item) => (
              <div key={item} className="flex items-center gap-3 text-body-sm text-ink-muted">
                <span className="grid size-5 place-items-center rounded-full bg-brand-indigo text-white">
                  <Check className="size-3" />
                </span>
                {item}
              </div>
            ))}
          </div>
          <a href="#generated" className="mt-8 inline-flex items-center gap-3 rounded-full border border-hairline px-5 py-3 text-body-sm font-[480]">
            Explore how it works
            <ArrowRight className="size-4" />
          </a>
        </aside>

        <div data-compare-card className="landing-panel relative overflow-hidden bg-surface-soft">
          <div className="grid h-full min-h-[30rem] grid-cols-[0.46fr_0.08fr_0.46fr] items-center gap-4">
            <div>
              <p className="text-body-sm font-[540]">Without Zenix</p>
              <p className="mt-1 text-caption uppercase tracking-caption text-ink-soft">Chaos and inconsistency</p>
              <div className="mt-8 space-y-3">
                {withoutPrompts.map((item, index) => (
                  <div key={item} data-compare-node className="relative rounded-md border border-hairline bg-white px-4 py-3 text-sm text-ink-muted shadow-xs">
                    <span className="absolute right-[-2.25rem] top-1/2 hidden h-px w-9 bg-hairline lg:block" data-compare-line />
                    {index + 1}. {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 mx-auto grid size-12 place-items-center rounded-full border border-hairline bg-white text-brand-indigo shadow-xs">
              vs
            </div>

            <div>
              <p className="text-body-sm font-[540] text-brand-indigo">With Zenix</p>
              <p className="mt-1 text-caption uppercase tracking-caption text-ink-soft">Clarity and consistency</p>
              <div className="relative mt-10 grid place-items-center">
                <div data-compare-node className="landing-engine-node relative z-10 grid size-36 place-items-center rounded-lg bg-white text-center">
                  <Sparkles className="mx-auto size-10 text-brand-indigo" />
                  <p className="mt-3 text-body-sm font-[540]">Zenix Context Engine</p>
                </div>
                <div className="landing-engine-halo absolute inset-0" />
              </div>
            </div>
          </div>
        </div>

        <aside data-compare-card className="landing-panel">
          <p className="text-body-sm font-[540] text-brand-indigo">What Zenix creates</p>
          <p className="mt-2 text-caption uppercase tracking-caption text-ink-soft">Everything an AI agent needs</p>
          <div className="mt-8 space-y-3">
            {withOutputs.map((item) => (
              <div key={item} data-compare-node className="flex items-center gap-3 rounded-md border border-hairline bg-background px-4 py-3 text-body-sm text-ink-muted">
                <CircleDot className="size-4 text-brand-indigo" />
                {item}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  )
}
