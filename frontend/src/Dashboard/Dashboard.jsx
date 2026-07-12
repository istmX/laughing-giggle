import { useState, useMemo, useRef } from 'react'
import { useLocation, useOutlet } from 'react-router-dom'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'
import { AnimatePresence, motion } from 'framer-motion'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(SplitText)

const getPageName = (pathname) => {
  if (pathname === '/dashboard') return 'All Projects'
  if (pathname.includes('/recent')) return 'Recent Projects'
  if (pathname.includes('/favorites')) return 'Favorites'
  if (pathname.includes('/profile')) return 'Profile'
  if (pathname.includes('/playground')) return 'AI Playground'
  if (pathname.includes('/preferences')) return 'Preferences'
  return 'Loading...'
}

const EDGES = [
  { x: 0, y: '-100vh' },
  { x: 0, y: '100vh' },
  { x: '-100vw', y: 0 },
  { x: '100vw', y: 0 },
]

function PageOverlay({ pageName, edge }) {
  const textRef = useRef(null)

  useGSAP(() => {
    if (!textRef.current) return
    const split = new SplitText(textRef.current, { type: "chars, words" })
    const chars = split.chars
    
    if (!chars.length) return
    
    const tl = gsap.timeline()
    
    // Animate each character from a completely random position and rotation
    chars.forEach((char, i) => {
      const rx = (Math.random() - 0.5) * 600
      const ry = (Math.random() - 0.5) * 600
      const rrot = (Math.random() - 0.5) * 360
      
      tl.fromTo(char, 
        { opacity: 0, x: rx, y: ry, rotationZ: rrot, scale: 0.2, filter: "blur(8px)" },
        { opacity: 1, x: 0, y: 0, rotationZ: 0, scale: 1, filter: "blur(0px)", duration: 0.7, ease: "back.out(1.5)" },
        i * 0.03 // stagger start times
      )
    })

    // Fade and blur out all characters before the overlay slides away
    tl.to(chars, { 
      opacity: 0, 
      scale: 1.1, 
      filter: "blur(8px)", 
      stagger: 0.015, 
      duration: 0.4, 
      ease: "power2.in" 
    }, "+=0.2")

    return () => split.revert()
  }, [pageName])

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink pointer-events-none"
      initial={{ x: 0, y: 0 }}
      animate={{ 
        ...edge, 
        transition: { delay: 1.4, duration: 0.6, ease: [0.76, 0, 0.24, 1] } 
      }}
      exit={{ 
        x: 0, y: 0, 
        transition: { delay: 0, duration: 0.4, ease: [0.76, 0, 0.24, 1] } 
      }}
    >
      <motion.div 
        exit={{ opacity: 0, transition: { duration: 0 } }} 
        className="text-[3.5rem] sm:text-[6rem] md:text-[8rem] font-340 tracking-display-sm text-canvas flex flex-wrap justify-center perspective-[1000px] px-4"
      >
        <div ref={textRef}>{pageName}</div>
      </motion.div>
    </motion.div>
  )
}

export default function DashboardShell() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const element = useOutlet()

  const pageName = getPageName(location.pathname)
  // Pick a random edge for this specific mount
  const edge = useMemo(() => EDGES[Math.floor(Math.random() * EDGES.length)], [location.pathname])

  return (
    <div className="flex h-dvh w-full bg-background dashboard-bg overflow-hidden text-foreground font-sans" data-lenis-prevent="true">
      <Sidebar 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Header setIsMobileMenuOpen={setIsMobileMenuOpen} />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            className="flex-1 flex flex-col h-full overflow-hidden relative"
          >
            <PageOverlay pageName={pageName} edge={edge} />

            <motion.main
              className="flex-1 flex flex-col h-full overflow-hidden"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                transition: { delay: 1.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] } 
              }}
              exit={{ 
                opacity: 0, 
                scale: 0.98,
                transition: { duration: 0.3 }
              }}
            >
              {element}
            </motion.main>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
