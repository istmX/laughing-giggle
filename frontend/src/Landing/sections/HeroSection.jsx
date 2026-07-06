import { ArrowRight, Play } from '@phosphor-icons/react'
import { useRef } from 'react'

import { Button } from '@/components/ui/button'

import { heroLines, heroMeta, navigationItems } from '../constants'
import { gsap, useGSAP } from '../motion'
import { usePrefersReducedMotion } from '../usePrefersReducedMotion'

function SplitLine({ text }) {
  return (
    <span className="block overflow-hidden">
      <span className="block" data-hero-line="">
        {text.split(' ').map((word, wordIndex) => (
          <span key={`${text}-${wordIndex}`} className="inline-block whitespace-nowrap" data-hero-word="">
            {word.split('').map((character, charIndex) => (
              <span key={`${word}-${charIndex}`} className="hero-char inline-block" data-hero-char="">
                {character}
              </span>
            ))}
            {wordIndex < text.split(' ').length - 1 ? <span className="inline-block w-[0.32em]" aria-hidden="true" /> : null}
          </span>
        ))}
      </span>
    </span>
  )
}

export function HeroSection() {
  const rootRef = useRef(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  useGSAP(() => {
    if (prefersReducedMotion) {
      return
    }

    gsap.set('[data-hero-char]', { opacity: 0, yPercent: 120, rotateX: -60, filter: 'blur(10px)' })
    gsap.set('[data-hero-copy]', { opacity: 0, y: 24, filter: 'blur(8px)' })
    gsap.set('[data-hero-nav]', { opacity: 0, y: -20 })
    gsap.set('[data-hero-orbit]', { opacity: 0, scale: 0.86 })

    const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })

    timeline
      .to('[data-hero-nav]', { opacity: 1, y: 0, duration: 0.7, stagger: 0.04 })
      .to('[data-hero-char]', { opacity: 1, yPercent: 0, rotateX: 0, filter: 'blur(0px)', duration: 0.9, stagger: 0.015 }, '-=0.3')
      .to('[data-hero-copy]', { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, stagger: 0.12 }, '-=0.45')
      .to('[data-hero-orbit]', { opacity: 1, scale: 1, duration: 0.9 }, '-=0.5')
  }, { scope: rootRef, dependencies: [prefersReducedMotion] })

  return (
    <section ref={rootRef} className="relative overflow-hidden border-b border-white/8 px-4 pb-16 pt-5 sm:px-6 lg:px-10" id="product">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_22%),radial-gradient(circle_at_75%_18%,rgba(255,255,255,0.08),transparent_18%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_40%)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.16),transparent_48%)]" />

      <header className="relative z-10 flex items-center justify-between gap-4">
        <a className="text-3xl font-semibold tracking-[-0.04em]" data-hero-nav="" href="/">zenix*</a>
        <nav className="hidden items-center gap-8 text-sm text-white/72 lg:flex">
          {navigationItems.map((item) => (
            <a key={item.label} className="transition-colors hover:text-white" data-hero-nav="" href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <Button className="h-12 rounded-full bg-white px-5 text-sm text-black hover:bg-white/92" data-hero-nav="">
          Get started
          <ArrowRight weight="bold" />
        </Button>
      </header>

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-6rem)] max-w-[92rem] items-center gap-10 pt-14 lg:grid-cols-[180px_minmax(0,1fr)_180px] lg:pt-10">
        <p className="max-w-[13rem] text-sm leading-6 text-white/62" data-hero-copy="">{heroMeta.left}</p>

        <div className="flex flex-col items-center text-center">
          <div className="space-y-2 text-[clamp(3.5rem,12vw,9rem)] leading-[0.88] font-light tracking-[-0.03em] text-white">
            {heroLines.map((line) => (
              <h1 key={line} className="text-balance">
                <SplitLine text={line} />
              </h1>
            ))}
          </div>

          <p className="mt-4 text-[0.7rem] tracking-[0.4em] text-white/38 uppercase" data-hero-copy="">
            {heroMeta.footer}
          </p>

          <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row" data-hero-copy="">
            <Button className="h-14 min-w-48 rounded-2xl bg-white px-6 text-base text-black shadow-[0_0_32px_rgba(255,255,255,0.12)] hover:bg-white/94">
              Get started for free
              <ArrowRight weight="bold" className="transition-transform duration-300 group-hover/button:translate-x-1" />
            </Button>
            <Button className="h-14 rounded-full border border-white/16 bg-white/4 px-6 text-base text-white hover:bg-white/10" variant="ghost">
              <Play weight="fill" />
              See how it works
            </Button>
          </div>
        </div>

        <p className="justify-self-end max-w-[13rem] text-sm leading-6 text-white/62" data-hero-copy="">{heroMeta.right}</p>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-52">
        <div className="absolute bottom-4 left-[-5%] h-40 w-[58%] rounded-[100%] border-t border-white/18" data-hero-orbit="" />
        <div className="absolute bottom-0 right-[-8%] h-48 w-[60%] rounded-[100%] border-t border-white/22" data-hero-orbit="" />
      </div>
    </section>
  )
}
