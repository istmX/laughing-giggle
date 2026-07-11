import { ArrowRight, Sparkles } from 'lucide-react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { useHeroStageMotion } from '@/components/ui/use-hero-stage-motion'

const HERO_VIDEO_SRC =
  'https://ik.imagekit.io/urb829e4h/VID_20260710_140339.mp4?tr=orig&updatedAt=1783672813679'

const TRUSTED_LOGOS = ['Razorpay', 'Waiturn', 'BuildShip', 'Relevance AI', 'Attio', 'Peerlist']

const EDGE_CUBES = [
  'left-[-2.5rem] top-[13rem] h-24 w-24',
  'right-[-1.25rem] top-[16rem] h-20 w-20',
  'left-[2rem] bottom-[14rem] h-16 w-16',
  'right-[3rem] bottom-[12rem] h-24 w-24',
  'left-[12%] top-[4rem] h-14 w-14',
  'right-[16%] bottom-[4rem] h-14 w-14',
]

export function HeroSection03() {
  const sectionRef = useRef(null)
  const navRef = useRef(null)
  const badgeRef = useRef(null)
  const summaryRef = useRef(null)
  const ctasRef = useRef(null)
  const stageTrackRef = useRef(null)
  const stageShellRef = useRef(null)
  const trustRef = useRef(null)

  useHeroStageMotion({
    badgeRef,
    ctasRef,
    navRef,
    sectionRef,
    stageShellRef,
    stageTrackRef,
    summaryRef,
    trustRef,
  })

  return (
    <section ref={sectionRef} className="relative border-b border-hairline bg-background text-foreground">
      <div className="landing-hero-ambient absolute inset-0" />
      <div className="landing-hero-grid absolute inset-0" />
      <div className="landing-hero-fade absolute inset-x-0 bottom-0 h-[28rem]" />
      <div className="landing-hero-divider pointer-events-none absolute inset-x-0 bottom-[7rem] h-px" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {EDGE_CUBES.map((cube) => (
          <span
            key={cube}
            data-hero-cube
            className={`landing-glow-cube absolute ${cube} rounded-xl`}
          />
        ))}
      </div>

      <header
        ref={navRef}
        className="relative z-20 mx-auto flex max-w-[1360px] items-center justify-between px-6 pt-6 md:px-8"
      >
        <div className="text-[2.25rem] font-[540] tracking-[-0.06em]">
          zenix<span className="align-top text-brand-indigo">*</span>
        </div>
        <nav className="hidden items-center gap-8 text-body-sm text-ink-muted lg:flex">
          {['Product', 'How it works', 'Templates', 'Use cases', 'Pricing', 'Docs', 'Changelog'].map((item) => (
            <a key={item} href="#product" className="transition-colors hover:text-foreground">
              {item}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" className="h-11 rounded-full px-5 text-body-sm">
            <Link to="/login">Log in</Link>
          </Button>
          <Button
            asChild
            className="h-11 rounded-full bg-brand-indigo px-5 text-body-sm text-white shadow-sm hover:bg-brand-indigo/90"
          >
            <Link to="/signup">
              Get started free
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-[1360px] px-6 pb-20 pt-8 md:px-8 md:pb-24 md:pt-10" id="product">
        <div className="mx-auto max-w-[58rem] text-center">
          <div ref={badgeRef} className="inline-flex items-center gap-3 rounded-full border border-hairline bg-white px-4 py-2 text-body-sm text-ink-muted shadow-xs">
            <span className="inline-flex size-2 rounded-full bg-brand-indigo" />
            v1.0 is now live
            <span className="text-foreground">Explore what&apos;s new</span>
            <ArrowRight className="size-3.5" />
          </div>

          <h1 className="mt-8 text-balance text-[clamp(3.5rem,8vw,6rem)] font-[540] leading-[0.94] tracking-[-0.03em]">
            <span data-hero-line className="block">
              Turn ideas into
            </span>
            <span data-hero-line className="mt-2 block">
              implementation-ready
            </span>
            <span data-hero-line className="mt-2 flex flex-wrap items-center justify-center gap-4">
              <span className="text-brand-indigo">context</span>
              <span className="landing-inline-video relative inline-flex h-16 w-28 overflow-hidden rounded-md">
                <video
                  className="h-full w-full object-cover"
                  src={HERO_VIDEO_SRC}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-hidden="true"
                />
                <span className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgb(11_13_18/0.18))]" />
              </span>
              <span>for AI coding agents</span>
            </span>
          </h1>

          <p
            ref={summaryRef}
            className="mx-auto mt-8 max-w-[42rem] text-body-lg text-ink-muted"
            data-hero-copy
          >
            Zenix understands your project, asks the right questions, and generates everything your AI agents need to build with clarity and consistency.
          </p>

          <div ref={ctasRef} className="mt-8 flex flex-wrap items-center justify-center gap-4" data-hero-copy>
            <Button
              asChild
              className="h-13 rounded-full bg-brand-indigo px-6 text-body-sm text-white shadow-sm hover:bg-brand-indigo/90"
            >
              <Link to="/signup">
                Get started for free
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button variant="outline" className="h-13 rounded-full px-6 text-body-sm">
              See how it works
              <span className="grid size-6 place-items-center rounded-full border border-hairline">
                <Sparkles className="size-3.5" />
              </span>
            </Button>
          </div>
        </div>

        <div ref={stageTrackRef} className="relative z-20 mx-auto mt-14 h-[clamp(22rem,48vw,42rem)] w-full max-w-[1170px] will-change-transform lg:mt-18">
          <div
            ref={stageShellRef}
            className="landing-video-shell relative h-full overflow-hidden rounded-xl"
          >
            <video
              className="absolute inset-0 h-full w-full object-cover"
              src={HERO_VIDEO_SRC}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
            <div className="landing-video-overlay absolute inset-0" />
            <div className="landing-video-toplight absolute inset-x-0 top-0 h-28" />
          </div>
        </div>

        <div ref={trustRef} className="mx-auto mt-8 max-w-[1180px] text-center" data-hero-copy>
          <p className="text-caption uppercase tracking-caption text-ink-soft">Trusted by developers and teams at</p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-body-sm text-ink-muted">
            {TRUSTED_LOGOS.map((logo) => (
              <span key={logo}>{logo}</span>
            ))}
          </div>
        </div>

        <div className="pointer-events-none mx-auto mt-10 max-w-[1170px]">
          <div className="landing-hero-divider h-px" />
          <div className="mt-6 grid grid-cols-3 gap-4 opacity-80 md:grid-cols-6">
            {['Architecture', 'Schemas', 'Contracts', 'Rules', 'Plan', 'Ship'].map((item) => (
              <div
                key={item}
                className="rounded-lg border border-hairline bg-white px-4 py-4 text-left text-sm text-ink-muted shadow-xs"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </main>
    </section>
  )
}
