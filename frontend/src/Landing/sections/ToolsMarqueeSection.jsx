import { useRef } from 'react'

import { toolItems } from '../constants'
import { gsap, useGSAP } from '../motion'
import { usePrefersReducedMotion } from '../usePrefersReducedMotion'

function ToolGlyph({ label }) {
  const initials = label.split(' ').map((part) => part[0]).join('').slice(0, 2)

  return (
    <span className="flex size-11 items-center justify-center rounded-full border border-white/14 bg-white/[0.03] text-sm tracking-[0.2em] text-white/85">
      {initials}
    </span>
  )
}

export function ToolsMarqueeSection() {
  const rootRef = useRef(null)
  const prefersReducedMotion = usePrefersReducedMotion()
  const marqueeItems = [...toolItems, ...toolItems]

  useGSAP(() => {
    if (prefersReducedMotion) {
      return
    }

    const tween = gsap.to('[data-marquee-track]', {
      xPercent: -50,
      duration: 34,
      ease: 'none',
      repeat: -1,
    })

    const element = rootRef.current
    const pause = () => tween.pause()
    const resume = () => tween.resume()

    element?.addEventListener('mouseenter', pause)
    element?.addEventListener('mouseleave', resume)

    return () => {
      element?.removeEventListener('mouseenter', pause)
      element?.removeEventListener('mouseleave', resume)
    }
  }, { scope: rootRef, dependencies: [prefersReducedMotion] })

  return (
    <section ref={rootRef} className="border-b border-white/8 py-8" id="use-with">
      <p className="mb-6 text-center text-xs tracking-[0.34em] text-white/55 uppercase">
        Use Zenix with your favorite AI coding agent
      </p>
      <div className="overflow-hidden">
        <div className="flex min-w-max gap-4 px-4 sm:px-6" data-marquee-track="">
          {marqueeItems.map((tool, index) => (
            <article
              key={`${tool.name}-${index}`}
              className="group relative flex min-w-56 items-center gap-3 rounded-[1.4rem] border border-white/10 bg-white/[0.03] px-4 py-4 transition-transform duration-300 hover:scale-[1.03] hover:border-white/20"
            >
              <ToolGlyph label={tool.name} />
              <div>
                <p className="text-sm text-white">{tool.name}</p>
                <p className="text-xs text-white/45">{tool.hint}</p>
              </div>
              <div className="pointer-events-none absolute left-4 top-full mt-2 max-w-40 rounded-xl border border-white/12 bg-black/92 px-3 py-2 text-xs leading-5 text-white/70 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                {tool.hint}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
