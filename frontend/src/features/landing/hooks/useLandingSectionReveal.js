import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function useLandingSectionReveal(
  sectionRef,
  {
    cardSelector = '[data-reveal-card]',
    itemSelector = '[data-reveal-item]',
    lineSelector = '[data-reveal-line]',
    start = 'top 74%',
  } = {}
) {
  useGSAP(
    () => {
      const section = sectionRef.current

      if (!section) return

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const cards = section.querySelectorAll(cardSelector)
      const items = section.querySelectorAll(itemSelector)
      const lines = section.querySelectorAll(lineSelector)

      if (reduceMotion) {
        gsap.set([cards, items, lines], { clearProps: 'all' })
        return
      }

      const timeline = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: {
          trigger: section,
          start,
          once: true,
        },
      })

      if (cards.length) {
        timeline.from(cards, { y: 36, autoAlpha: 0, duration: 0.78, stagger: 0.12 })
      }

      if (items.length) {
        timeline.from(items, { y: 18, autoAlpha: 0, duration: 0.56, stagger: 0.07 }, '-=0.46')
      }

      if (lines.length) {
        timeline.from(
          lines,
          {
            scaleX: 0,
            transformOrigin: 'left center',
            duration: 0.72,
            stagger: 0.05,
          },
          '-=0.42'
        )
      }
    },
    { scope: sectionRef }
  )
}
