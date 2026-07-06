import { useRef } from 'react'

import { storySteps } from '../constants'
import { gsap, useGSAP } from '../motion'
import { usePrefersReducedMotion } from '../usePrefersReducedMotion'

export function StorySection() {
  const rootRef = useRef(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useGSAP(() => {
    if (prefersReducedMotion) {
      return
    }

    gsap.from('[data-story-copy]', {
      opacity: 0,
      y: 34,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.12,
      scrollTrigger: { trigger: rootRef.current, start: 'top 72%' },
    })

    gsap.fromTo('[data-story-node]', { opacity: 0.35, scale: 0.92 }, {
      opacity: 1,
      scale: 1,
      duration: 0.7,
      stagger: 0.16,
      ease: 'power3.out',
      scrollTrigger: { trigger: rootRef.current, start: 'top 64%' },
    })
  }, { scope: rootRef, dependencies: [prefersReducedMotion] })

  return (
    <section ref={rootRef} className="grid gap-12 border-b border-white/8 px-4 py-20 sm:px-6 lg:grid-cols-[minmax(0,22rem)_1fr]" id="how-it-works">
      <div className="space-y-5">
        <p className="text-[clamp(2.5rem,6vw,4.75rem)] leading-[0.96] tracking-[-0.04em] text-white" data-story-copy="">
          From idea to implementation-ready <span className="text-white/56">context.</span>
        </p>
        <p className="max-w-sm text-base leading-7 text-white/62" data-story-copy="">
          Answer a few smart questions. We handle the structure so your context becomes something AI can actually build with.
        </p>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.025] px-5 py-10 sm:px-8">
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <svg className="absolute inset-x-0 top-1/2 hidden -translate-y-1/2 lg:block" height="84" viewBox="0 0 820 84" fill="none">
            <path d="M8 42C108 42 110 8 210 8C310 8 312 76 412 76C512 76 514 18 614 18C714 18 716 42 812 42" stroke="rgba(255,255,255,0.28)" strokeWidth="1.2" />
          </svg>
          {storySteps.map((step, index) => (
            <div key={step} className="relative z-10 flex items-center gap-4 lg:flex-col lg:gap-3" data-story-node="">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-white/16 bg-white/[0.05] text-sm text-white">
                {index + 1}
              </span>
              <span className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm text-white/88">
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
