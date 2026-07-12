import { useRef } from 'react'
import { ArrowRight, Check, Sparkles } from 'lucide-react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const painPoints = [
  'Re-explaining the same project in every chat',
  'Requirements changing mid-build because nobody clarified them up front',
  'Different agents making different assumptions about the same product',
]

const outcomes = [
  'One source of truth for the whole build',
  'Clear requirements before implementation starts',
  'Consistent handoff between humans and agents',
]

export function ContextComparison() {
  const sectionRef = useRef(null)

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const blocks = sectionRef.current.querySelectorAll('[data-compare-block]')

      if (reduceMotion) {
        gsap.set(blocks, { clearProps: 'all' })
        return
      }

      gsap.from(blocks, {
        y: 36,
        autoAlpha: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 74%',
          once: true,
        },
      })
    },
    { scope: sectionRef }
  )

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-background px-6 py-section md:px-8">
      <div className="landing-section-ambient absolute inset-0" />
      <div className="relative mx-auto grid max-w-[1360px] gap-8 lg:grid-cols-[0.42fr_0.58fr]">
        <div data-compare-block className="max-w-[35rem]">
          <p className="text-caption uppercase tracking-caption text-brand-indigo">Why teams switch</p>
          <h2 className="mt-5 text-[clamp(2.8rem,4.7vw,5rem)] font-[540] leading-[0.96] tracking-[-0.04em] text-balance">
            Less repetition.
            <span className="block">More confidence.</span>
          </h2>
          <p className="mt-6 text-body-lg text-ink-muted">
            Teams want a faster path from rough idea to aligned implementation, without losing
            decisions between tools, agents, or teammates.
          </p>
          <a
            href="#proof"
            className="mt-8 inline-flex items-center gap-3 rounded-full border border-hairline bg-white px-5 py-3 text-body-sm font-[480] shadow-xs"
          >
            See the proof
            <ArrowRight className="size-4" />
          </a>
        </div>

        <div className="grid gap-4 lg:grid-cols-[0.44fr_0.12fr_0.44fr]">
          <article
            data-compare-block
            className="rounded-xl bg-block-pink p-6 shadow-sm"
          >
            <p className="text-caption uppercase tracking-caption text-ink-soft">Without Zenix</p>
            <div className="mt-6 space-y-3">
              {painPoints.map((item) => (
                <div key={item} className="rounded-lg border border-black/8 bg-white/70 px-4 py-4 text-body-sm text-foreground">
                  {item}
                </div>
              ))}
            </div>
          </article>

          <div data-compare-block className="hidden items-center justify-center lg:flex">
            <div className="grid size-14 place-items-center rounded-full border border-hairline bg-white text-body-sm text-brand-indigo shadow-xs">
              vs
            </div>
          </div>

          <article
            data-compare-block
            className="rounded-xl border border-hairline bg-[#111111] p-6 text-white shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-caption uppercase tracking-caption text-white/50">With Zenix</p>
                <h3 className="mt-3 text-headline font-[540] tracking-headline text-white">
                  The project gets clarified once, then reused everywhere.
                </h3>
              </div>
              <div className="grid size-12 place-items-center rounded-full bg-white text-black">
                <Sparkles className="size-5" />
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {outcomes.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-4 text-body-sm text-white/86"
                >
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-white text-black">
                    <Check className="size-3" />
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
