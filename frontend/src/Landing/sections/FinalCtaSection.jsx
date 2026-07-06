import { ArrowRight } from '@phosphor-icons/react'

import { Button } from '@/components/ui/button'

export function FinalCtaSection() {
  return (
    <section className="px-4 py-24 sm:px-6" id="pricing">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] px-6 py-16 text-center sm:px-10">
        <div className="absolute inset-x-10 bottom-8 h-24 rounded-[100%] border border-white/10" />
        <div className="relative z-10 mx-auto max-w-3xl">
          <p className="text-[clamp(2.5rem,5vw,4.6rem)] leading-[1] tracking-[-0.05em] text-white">
            Stop explaining your project to AI.
            <br />
            <span className="text-white/58">Start building.</span>
          </p>
          <Button className="mt-10 h-14 rounded-2xl bg-white px-6 text-base text-black hover:bg-white/94">
            Get started for free
            <ArrowRight weight="bold" />
          </Button>
        </div>
      </div>
    </section>
  )
}
