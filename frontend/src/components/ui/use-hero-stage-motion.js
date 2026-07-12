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

      const heroLines = Array.from(section.querySelectorAll('[data-hero-line]'))
      const heroCopy = section.querySelectorAll('[data-hero-copy]')
      const heroCtas = ctas.querySelectorAll('[data-slot="button"]')
      const heroCubes = section.querySelectorAll('[data-hero-cube]')
      const navItems = nav.querySelectorAll('[data-hero-nav-item]')
      const mediaQuery = gsap.matchMedia()

      mediaQuery.add(
        {
          desktop: '(min-width: 1024px)',
          reduceMotion: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          const { desktop, reduceMotion } = context.conditions

          if (reduceMotion) {
            gsap.set(
              [nav, navItems, badge, heroLines, summary, heroCtas, stageTrack, trust],
              { clearProps: 'all' }
            )
            return
          }

          gsap.set(stageTrack, { transformOrigin: 'center center' })

          const intro = gsap.timeline({
            defaults: { duration: 0.82, ease: 'power3.out' },
          })

          intro.from(navItems, {
            y: -20,
            autoAlpha: 0,
            stagger: 0.06,
            duration: 0.54,
          })
          intro.from(badge, { y: 18, autoAlpha: 0 }, '-=0.16')

          heroLines.forEach((line, index) => {
            const direction = line.getAttribute('data-hero-line-direction') === 'right' ? 88 : -88
            intro.from(
              line,
              {
                x: direction,
                y: 26,
                autoAlpha: 0,
                duration: 0.86,
              },
              index === 0 ? '-=0.12' : '-=0.56'
            )
          })

          intro
            .from(summary, { y: 24, autoAlpha: 0, duration: 0.72 }, '-=0.42')
            .from(heroCtas, { y: 18, autoAlpha: 0, stagger: 0.08, duration: 0.64 }, '-=0.42')
            .from(stageTrack, { y: 44, autoAlpha: 0, scale: 0.96, duration: 1.08 }, '-=0.34')
            .from(trust, { y: 20, autoAlpha: 0, duration: 0.66 }, '-=0.52')

          gsap.to(heroCubes, {
            duration: 6.2,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            x: (_, target) =>
              target.getBoundingClientRect().left > window.innerWidth / 2 ? -10 : 10,
            y: (_, target) =>
              target.getBoundingClientRect().top > window.innerHeight / 2 ? -14 : 14,
            stagger: 0.35,
          })

          if (!desktop) return

          const getStageMetrics = () => {
            const rect = stageTrack.getBoundingClientRect()

            return {
              x: window.innerWidth / 2 - (rect.left + rect.width / 2),
              y: window.innerHeight / 2 - (rect.top + rect.height / 2),
            }
          }

          gsap
            .timeline({
              defaults: { ease: 'none' },
              scrollTrigger: {
                trigger: section,
                start: 'top top',
                end: '+=170%',
                scrub: 1,
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
                x: () => getStageMetrics().x,
                y: () => getStageMetrics().y,
                width: () => window.innerWidth,
                height: () => window.innerHeight,
                maxWidth: () => window.innerWidth,
                ease: 'none',
              },
              0.08
            )
            .to(
              stageShell,
              {
                borderRadius: 0,
                boxShadow: '0 0 0 rgba(0,0,0,0)',
              },
              0.08
            )
            .to(
              trust,
              {
                autoAlpha: 0,
                yPercent: -18,
              },
              0.04
            )
        }
      )

      return () => mediaQuery.revert()
    },
    { scope: sectionRef }
  )
}
