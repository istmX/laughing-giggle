import { useRef } from 'react'

import { documentPanels } from '../constants'
import { gsap, useGSAP } from '../motion'
import { usePrefersReducedMotion } from '../usePrefersReducedMotion'

function PanelBody({ panel, index }) {
  if (index === 0) {
    return <div className="grid grid-cols-2 gap-3">{panel.lines.map((line) => <div key={line} className="rounded-xl border border-white/10 p-3 text-xs text-white/58">{line}</div>)}</div>
  }
  if (index === 1) {
    return <div className="space-y-4">{panel.lines.map((line) => <div key={line} className="flex items-center gap-3 text-sm text-white/70"><span className="size-2 rounded-full bg-white/70" />{line}</div>)}</div>
  }
  if (index === 2) {
    return <div className="space-y-3">{panel.lines.map((line) => <div key={line} className="h-10 rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/72">{line}</div>)}</div>
  }
  if (index === 3) {
    return <div className="flex h-full items-end gap-3">{panel.lines.map((line, itemIndex) => <div key={line} className="flex-1 rounded-t-[1.5rem] border border-white/10 bg-white/[0.04] p-3 text-xs text-white/70" style={{ height: `${46 + (itemIndex + 1) * 12}%` }}>{line}</div>)}</div>
  }
  if (index === 4) {
    return <div className="grid grid-cols-2 gap-3">{panel.lines.map((line, itemIndex) => <div key={line} className={`rounded-[1.25rem] border border-white/10 p-4 text-sm text-white/70 ${itemIndex === 0 ? 'col-span-2' : ''}`}>{line}</div>)}</div>
  }

  return <div className="space-y-4">{panel.lines.map((line) => <div key={line} className="rounded-2xl border border-dashed border-white/16 p-4 text-sm text-white/68">{line}</div>)}</div>
}

export function HorizontalDocumentsSection() {
  const rootRef = useRef(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useGSAP(() => {
    if (prefersReducedMotion) {
      return
    }

    const panels = gsap.utils.toArray('[data-doc-panel]')
    gsap.to(panels, {
      xPercent: -100 * (panels.length - 1),
      ease: 'none',
      scrollTrigger: {
        trigger: rootRef.current,
        pin: true,
        scrub: 1,
        start: 'top top',
        end: () => `+=${window.innerWidth * panels.length * 0.8}`,
      },
    })
  }, { scope: rootRef, dependencies: [prefersReducedMotion] })

  return (
    <section ref={rootRef} className="border-b border-white/8 bg-black" id="docs">
      <div className="flex h-screen w-[600vw]">
        {documentPanels.map((panel, index) => (
          <article key={panel.title} className="flex h-screen w-screen items-center px-4 py-14 sm:px-6 lg:px-10" data-doc-panel="">
            <div className="grid w-full gap-10 lg:grid-cols-[22rem_minmax(0,1fr)]">
              <div className="space-y-5">
                <p className="text-sm tracking-[0.28em] text-white/45 uppercase">{panel.eyebrow}</p>
                <h2 className="text-[clamp(2.8rem,6vw,5.6rem)] leading-[0.92] tracking-[-0.04em] text-white">
                  {panel.title}
                </h2>
                <p className="max-w-sm text-base leading-7 text-white/60">
                  Each exported artifact has its own job, its own layout, and its own level of instruction depth.
                </p>
              </div>
              <div className="min-h-[24rem] rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-6">
                <PanelBody index={index} panel={panel} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
