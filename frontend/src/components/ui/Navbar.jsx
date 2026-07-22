import { useState, useRef, useEffect } from 'react'
import { motion, useSpring } from 'framer-motion'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { usePreferencesStore } from '../../features/preferences/store/preferences.store'
import { Sun, Moon } from 'lucide-react'
import { RollingButton } from './RollingButton'

const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Templates', href: '/#templates' },
  { name: 'About', href: '/about' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Docs', href: '/docs' },
  { name: 'Sponsor', href: '/sponsor' },
]

export function Navbar() {
  const theme = usePreferencesStore((state) => state.theme)
  const setTheme = usePreferencesStore((state) => state.setTheme)
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light')

  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0 })
  const [showSpotlight, setShowSpotlight] = useState(false)

  const navX = useSpring(0, { stiffness: 220, damping: 26 })
  const navY = useSpring(0, { stiffness: 220, damping: 26 })
  const navScaleX = useSpring(1, { stiffness: 220, damping: 26 })

  const containerRef = useRef(null)
  const mobileMenuRef = useRef(null)
  const { contextSafe } = useGSAP({ scope: containerRef })

  const handleMouseMoveNav = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const deltaX = e.clientX - centerX
    const deltaY = e.clientY - centerY

    navX.set(Math.max(Math.min(deltaX * 0.02, 6), -6))
    navY.set(Math.max(Math.min(deltaY * 0.04, 4), -4))
    navScaleX.set(1.01)

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setSpotlightPos({ x, y })
    setShowSpotlight(true)
  }

  const handleMouseLeaveNav = () => {
    navX.set(0)
    navY.set(0)
    navScaleX.set(1)
    setShowSpotlight(false)
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const toggleMobileMenu = () => {
    contextSafe(() => {
      const tl = gsap.timeline()
      if (!isMobileMenuOpen) {
        setIsMobileMenuOpen(true)
        gsap.to(mobileMenuRef.current, { display: 'flex', opacity: 1, duration: 0.4, ease: 'power2.out' })
        gsap.fromTo('.mobile-link', 
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power3.out', delay: 0.1 }
        )
        gsap.to('.hamburger-top', { rotation: 45, y: 6, duration: 0.3 })
        gsap.to('.hamburger-mid', { opacity: 0, duration: 0.3 })
        gsap.to('.hamburger-bot', { rotation: -45, y: -6, duration: 0.3 })
      } else {
        tl.to('.mobile-link', { y: 20, opacity: 0, duration: 0.3, stagger: -0.05, ease: 'power2.in' })
          .to(mobileMenuRef.current, { opacity: 0, duration: 0.3, onComplete: () => setIsMobileMenuOpen(false) }, "-=0.1")
          .set(mobileMenuRef.current, { display: 'none' })

        gsap.to('.hamburger-top', { rotation: 0, y: 0, duration: 0.3 })
        gsap.to('.hamburger-mid', { opacity: 1, duration: 0.3 })
        gsap.to('.hamburger-bot', { rotation: 0, y: 0, duration: 0.3 })
      }
    })()
  }

  const scrolledClasses = isScrolled 
    ? 'top-3 h-12 max-w-4xl rounded-[24px] bg-white/80 dark:bg-[#0b0b0d]/85 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.08)] dark:shadow-[0_12px_40px_-12px_rgba(255,255,255,0.03)] border-zinc-200/80 dark:border-zinc-800/90 backdrop-blur-2xl'
    : 'top-6 h-14 max-w-5xl rounded-full bg-white/70 dark:bg-[#0b0b0d]/75 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_-8px_rgba(255,255,255,0.01)] border-zinc-200/60 dark:border-zinc-800/60 backdrop-blur-xl'

  return (
    <div ref={containerRef}>
      <motion.nav 
        onMouseMove={handleMouseMoveNav}
        onMouseLeave={handleMouseLeaveNav}
        style={{
          x: navX,
          y: navY,
          scaleX: navScaleX,
        }}
        className={`hero-nav fixed inset-x-0 mx-auto flex items-center justify-between px-4 sm:px-6 z-50 border w-[90%] sm:w-full transition-[width,height,top,border-radius,background-color,border-color,box-shadow] duration-300 ease-out ${scrolledClasses}`}
      >
        {showSpotlight && (
          <div 
            className="absolute inset-0 pointer-events-none rounded-full transition-opacity duration-300"
            style={{
              background: `radial-gradient(100px circle at ${spotlightPos.x}px ${spotlightPos.y}px, ${theme === 'light' ? 'rgba(0, 0, 0, 0.035)' : 'rgba(255, 255, 255, 0.08)'}, transparent 80%)`
            }}
          />
        )}

        <div className="flex items-center gap-3 px-2 group/logo cursor-pointer relative z-10">
          <span className="font-semibold tracking-tight text-[15px] text-zinc-900 dark:text-white">Zenix</span>
        </div>

        <div className="hidden md:flex items-center gap-1 relative z-10">
          {NAV_LINKS.map((link, idx) => (
            <a
              key={link.name}
              href={link.href}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative px-4 py-1.5 rounded-full text-[12px] font-medium text-zinc-550 dark:text-zinc-400 transition-all duration-200 hover:text-zinc-950 dark:hover:text-white hover:-translate-y-[1.5px] z-10"
            >
              {hoveredIndex === idx && (
                <motion.div
                  layoutId="nav-hover-indicator"
                  className="absolute inset-0 bg-zinc-150/60 dark:bg-zinc-800/40 rounded-full -z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{link.name}</span>
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3 px-2 relative z-10">
          <button
            type="button"
            onClick={toggleTheme}
            className="relative flex items-center w-12 h-7 rounded-full bg-zinc-150 dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700/60 cursor-pointer p-0.5 transition-colors duration-350 select-none"
            aria-label="Toggle theme"
          >
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="w-[22px] h-[22px] rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center shadow-[0_1px_3px_rgba(0,0,0,0.1)] dark:shadow-none z-10"
              style={{
                marginLeft: theme === 'light' ? '0px' : 'auto',
                marginRight: theme === 'light' ? 'auto' : '0px',
              }}
            >
              <motion.div
                key={theme}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {theme === 'light' ? (
                  <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-500/25" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-indigo-300 fill-indigo-300/10" />
                )}
              </motion.div>
            </motion.div>
          </button>
          
          <div className="hidden sm:flex items-center gap-1.5">
            <RollingButton 
              href="/login" 
              text="Log in"
              className="h-8 px-3 text-[12px] font-medium text-zinc-550 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white bg-transparent"
            />
            
            <RollingButton 
              href="/signup" 
              className="h-8 px-4 text-[12px] text-white dark:text-zinc-950 bg-zinc-950 dark:bg-white hover:bg-zinc-855 dark:hover:bg-zinc-100 hover:-translate-y-0.5 hover:scale-[1.015] shadow-xs hover:shadow-md dark:shadow-none dark:hover:shadow-[0_0_12px_rgba(255,255,255,0.15)] border border-transparent hover:border-zinc-800 dark:hover:border-zinc-200 transition-all duration-250 ease-out flex items-center gap-1 group/cta"
            >
              <span className="flex items-center gap-1 font-medium">
                <span>Get Started</span>
                <svg className="w-3 h-3 transform group-hover/cta:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </span>
            </RollingButton>
          </div>

          <button 
            onClick={toggleMobileMenu}
            className="md:hidden flex flex-col items-center justify-center w-8 h-8 gap-1 cursor-pointer"
            aria-label="Toggle menu"
          >
            <span className="hamburger-top w-4 h-[1.2px] bg-zinc-900 dark:bg-zinc-100 block origin-center transition-transform rounded-full"></span>
            <span className="hamburger-mid w-4 h-[1.2px] bg-zinc-900 dark:bg-zinc-100 block transition-opacity rounded-full"></span>
            <span className="hamburger-bot w-4 h-[1.2px] bg-zinc-900 dark:bg-zinc-100 block origin-center transition-transform rounded-full"></span>
          </button>
        </div>
      </motion.nav>

      <div 
        ref={mobileMenuRef}
        className="fixed inset-0 z-40 bg-white dark:bg-[#0b0b0d] pt-24 px-6 pb-6 hidden flex-col"
        style={{ display: 'none', opacity: 0 }}
      >
        <div className="flex flex-col gap-6 text-2xl font-medium tracking-tight">
          {NAV_LINKS.map((link) => (
            <a key={link.name} href={link.href} className="mobile-link text-zinc-900 dark:text-zinc-100 hover:text-zinc-600 dark:hover:text-zinc-400 border-b border-zinc-100 dark:border-zinc-800 pb-4">
              {link.name}
            </a>
          ))}
        </div>
        <div className="mt-auto flex flex-col gap-4">
          <RollingButton href="/login" text="Log in" className="mobile-link flex h-12 w-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-medium" />
          <RollingButton href="/signup" text="Get Started" className="mobile-link flex h-12 w-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-medium" />
        </div>
      </div>
    </div>
  )
}
