import { useEffect } from 'react'
import gsap from 'gsap'
import Lenis from 'lenis'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import AppRoutes from './Routes/AppRoutes'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from '@/features/preferences/ui/ThemeProvider'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

const App = () => {
  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduceMotion) return undefined

    const lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      syncTouch: true,
      touchMultiplier: 1.5,
      wheelMultiplier: 0.82,
    })
    window.lenis = lenis
    const raf = (time) => lenis.raf(time * 1000)

    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    // Lenis drives ScrollTrigger via the lenis.on('scroll') binding above.
    // normalizeScroll(true) is not needed and fights Lenis pin+scrub sections.

    return () => {
      gsap.ticker.remove(raf)
      window.lenis = null
      lenis.destroy()
    }
  }, [])

  return (
    <ThemeProvider>
      <Toaster 
        position="top-center" 
        toastOptions={{
          className: 'border border-hairline bg-surface-elevated text-ink font-sans text-body-sm shadow-md rounded-lg',
          duration: 3000,
        }} 
      />
      <AppRoutes />
    </ThemeProvider>
  )
}

export default App
