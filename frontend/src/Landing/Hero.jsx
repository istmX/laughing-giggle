import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';
import { usePreferencesStore } from '../features/preferences/store/preferences.store';
import { Sun, Moon } from 'lucide-react';
import { RollingButton } from '../components/ui/RollingButton';

const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'Templates', href: '/#templates' },
  { name: 'About', href: '/about' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Docs', href: '/docs' },
  { name: 'Sponsor', href: '/sponsor' },
];

export default function Hero() {
  const theme = usePreferencesStore((state) => state.theme);
  const setTheme = usePreferencesStore((state) => state.setTheme);
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const containerRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const { contextSafe } = useGSAP({ scope: containerRef });

  useGSAP(() => {
    // 1. Split the headline and subheadline text
    const headline = new SplitType('.split-headline', { types: 'words, chars' });
    const subhead = new SplitType('.split-subhead', { types: 'lines, words' });

    // 2. Animate the characters of the headline from the center
    gsap.from(headline.chars, {
      y: 60,
      opacity: 0,
      rotationX: -90,
      stagger: {
        amount: 0.8,
        from: 'center'
      },
      duration: 1.2,
      ease: 'expo.out',
      transformOrigin: '50% 50% -20px',
    });

    // 3. Animate the subheadline words
    gsap.from(subhead.words, {
      y: 20,
      opacity: 0,
      stagger: 0.015,
      duration: 1,
      ease: 'expo.out',
      delay: 0.3,
    });

    // 4. Fade in the CTAs
    gsap.from('.hero-ctas', {
      y: 20,
      opacity: 0,
      duration: 1,
      ease: 'expo.out',
      delay: 0.6,
    });



    // 5. Animate Nav Bar dropping in
    gsap.from('.hero-nav', {
      y: -100,
      opacity: 0,
      duration: 1.2,
      ease: 'expo.out',
      delay: 0.1,
    });
  }, { scope: containerRef });

  const toggleMobileMenu = () => {
    contextSafe(() => {
      const tl = gsap.timeline();
      if (!isMobileMenuOpen) {
        setIsMobileMenuOpen(true);
        gsap.to(mobileMenuRef.current, { display: 'flex', opacity: 1, duration: 0.4, ease: 'power2.out' });
        gsap.fromTo('.mobile-link', 
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power3.out', delay: 0.1 }
        );
        gsap.to('.hamburger-top', { rotation: 45, y: 6, duration: 0.3 });
        gsap.to('.hamburger-mid', { opacity: 0, duration: 0.3 });
        gsap.to('.hamburger-bot', { rotation: -45, y: -6, duration: 0.3 });
      } else {
        tl.to('.mobile-link', { y: 20, opacity: 0, duration: 0.3, stagger: -0.05, ease: 'power2.in' })
          .to(mobileMenuRef.current, { opacity: 0, duration: 0.3, onComplete: () => setIsMobileMenuOpen(false) }, "-=0.1")
          .set(mobileMenuRef.current, { display: 'none' });
        
        gsap.to('.hamburger-top', { rotation: 0, y: 0, duration: 0.3 });
        gsap.to('.hamburger-mid', { opacity: 1, duration: 0.3 });
        gsap.to('.hamburger-bot', { rotation: 0, y: 0, duration: 0.3 });
      }
    })();
  };

  return (
    <div ref={containerRef} className="relative w-full min-h-fit md:min-h-screen bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 font-sans selection:bg-zinc-200 dark:selection:bg-zinc-800 overflow-x-hidden flex flex-col transition-colors duration-300">
      {/* Navigation */}
      <nav className="hero-nav fixed top-6 inset-x-0 mx-auto max-w-5xl h-14 flex items-center justify-between px-4 sm:px-6 z-50 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-zinc-200/60 dark:border-zinc-800/60 rounded-full shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.4)] transition-all">
        
        {/* Left: Logo */}
        <div className="flex items-center gap-3 px-2">
          <img src="/logo.png" alt="Zenix Logo" className="w-5.5 h-5.5 object-contain drop-shadow-sm dark:brightness-0 dark:invert" />
          <span className="font-semibold tracking-tight text-[15px] text-zinc-900 dark:text-white">Zenix</span>
        </div>

        {/* Center Links (hidden on mobile) */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link, idx) => (
            <a
              key={link.name}
              href={link.href}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative px-4 py-1.5 rounded-full text-[12px] font-medium text-zinc-500 dark:text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-white z-10"
            >
              {hoveredIndex === idx && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-zinc-100/80 dark:bg-zinc-800/80 rounded-full -z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              <span className="relative z-10">{link.name}</span>
            </a>
          ))}
        </div>

        {/* Right: Actions + Theme Toggle */}
        <div className="flex items-center gap-2.5 px-2">
          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center justify-center w-8 h-8 rounded-full border border-zinc-200/60 dark:border-zinc-800/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-300 cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
          
          <div className="hidden sm:flex items-center gap-1.5">
            <RollingButton 
              href="/login" 
              text="Log in"
              className="h-8 px-3 text-[12px] font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white bg-transparent"
            />
            <RollingButton 
              href="/signup" 
              text="Get Started"
              className="h-8 px-4 text-[12px] text-white dark:text-zinc-950 bg-zinc-950 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.2)]"
            />
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
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        ref={mobileMenuRef}
        className="fixed inset-0 z-40 bg-white dark:bg-zinc-950 pt-24 px-6 pb-6 hidden flex-col"
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

      {/* Hero Content */}
      <main className="flex-1 flex flex-col items-center justify-start text-center px-4 md:px-8 z-10 pt-28 md:pt-36 pb-12 md:pb-20 max-w-7xl mx-auto w-full">
        <div className="w-full flex flex-col items-center">
          {/* Headline */}
          <h1 className="split-headline landing-display-tall max-w-7xl text-zinc-950 dark:text-white mx-auto font-black uppercase select-none" style={{ perspective: "1000px" }}>
            Stop shipping <br className="hidden sm:inline" /> AI slop.
          </h1>
          
          {/* Subheadline */}
          <p className="split-subhead mt-8 sm:mt-10 text-lg md:text-xl lg:text-2xl text-zinc-500 dark:text-zinc-400 max-w-3xl leading-relaxed font-light tracking-[-0.015em] mx-auto">
            Build software with context, architecture and design systems not prompts.
          </p>
        </div>

        {/* CTAs */}
        <div className="hero-ctas mt-12 sm:mt-16 flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
          <RollingButton 
            href="/signup" 
            text="Start Building" 
            className="bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-lg px-8 py-3 text-sm md:text-base"
          />
          <RollingButton 
            href="/github" 
            text="Import from GitHub" 
            className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-md px-8 py-3 text-sm md:text-base"
          />
        </div>

      </main>
      
    </div>
  );
}
