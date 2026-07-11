import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function useHeroStageMotion({
  badgeRef,
  ctasRef,
  navRef,
  sectionRef,
  stageShellRef,
  stageTrackRef,
  summaryRef,
  trustRef,
}) {
  useGSAP(
    () => {
      const section = sectionRef.current
      const stageTrack = stageTrackRef.current
      const stageShell = stageShellRef.current
      const nav = navRef.current
      const badge = badgeRef.current
      const summary = summaryRef.current
      const ctas = ctasRef.current
      const trust = trustRef.current

      if (!section || !stageTrack || !stageShell || !nav || !badge || !summary || !ctas || !trust) return

      const heroLines = section.querySelectorAll('[data-hero-line]')
      const heroCopy = section.querySelectorAll('[data-hero-copy]')
      const heroCtas = ctas.querySelectorAll('[data-slot="button"]')
      const heroCubes = section.querySelectorAll('[data-hero-cube]')
      const mediaQuery = gsap.matchMedia()

      mediaQuery.add(
        {
          desktop: '(min-width: 1024px)',
          reduceMotion: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          const { desktop, reduceMotion } = context.conditions

          if (reduceMotion) {
            gsap.set([nav, badge, heroLines, summary, heroCtas, stageTrack, trust], { clearProps: 'all' })
            return
          }

          gsap.set(stageTrack, { transformOrigin: 'center center' })

          gsap
            .timeline({ defaults: { duration: 0.82, ease: 'power3.out' } })
            .from(nav, { y: -24, autoAlpha: 0 })
            .from(badge, { y: 18, autoAlpha: 0 }, '-=0.45')
            .from(heroLines, { y: 54, autoAlpha: 0, stagger: 0.09, duration: 0.94 }, '-=0.42')
            .from(summary, { y: 24, autoAlpha: 0, duration: 0.72 }, '-=0.5')
            .from(heroCtas, { y: 18, autoAlpha: 0, stagger: 0.08, duration: 0.64 }, '-=0.45')
            .from(stageTrack, { y: 44, autoAlpha: 0, scale: 0.96, duration: 1.08 }, '-=0.4')
            .from(trust, { y: 20, autoAlpha: 0, duration: 0.66 }, '-=0.54')

          gsap.to(heroCubes, {
            duration: 6.2,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            x: (_, target) => (target.getBoundingClientRect().left > window.innerWidth / 2 ? -10 : 10),
            y: (_, target) => (target.getBoundingClientRect().top > window.innerHeight / 2 ? -14 : 14),
            stagger: 0.35,
          })

          if (!desktop) return

          gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: '+=140%',
              scrub: 1.25,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          })
            .to(
              heroCopy,
              {
                autoAlpha: 0.08,
                yPercent: -10,
                stagger: 0.04,
              },
              0.3
            )
            .to(
              heroLines,
              {
                autoAlpha: 0.32,
                yPercent: -8,
                stagger: 0.03,
              },
              0.26
            )
            .to(
              stageTrack,
              {
                x: () => {
                  const rect = stageTrack.getBoundingClientRect()
                  return window.innerWidth / 2 - (rect.left + rect.width / 2)
                },
                y: () => {
                  const rect = stageTrack.getBoundingClientRect()
                  return window.innerHeight / 2 - (rect.top + rect.height / 2)
                },
                scaleX: () => window.innerWidth / stageTrack.getBoundingClientRect().width,
                scaleY: () => window.innerHeight / stageTrack.getBoundingClientRect().height,
              },
              0.12
            )
            .to(
              stageShell,
              {
                borderRadius: 0,
                boxShadow: '0 0 0 rgba(0,0,0,0)',
              },
              0.12
            )
        }
      )

      return () => mediaQuery.revert()
    },
    { scope: sectionRef }
  )
}
