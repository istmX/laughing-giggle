import { useEffect } from 'react'
import Lenis from 'lenis'

import { gsap, ScrollTrigger } from './motion'

export function useSmoothScroll(enabled = true) {
  useEffect(() => {
    if (!enabled) {
      return undefined
    }

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      syncTouch: false,
    })

    const update = (time) => {
      lenis.raf(time * 1000)
    }

    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(update)
      lenis.destroy()
    }
  }, [enabled])
}
