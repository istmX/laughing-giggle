import { useState, useRef, useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';
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
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Interactive word scramble states
  const [displayWord1, setDisplayWord1] = useState('STOP');
  const [displayWord2, setDisplayWord2] = useState('SLOP.');
  const scrambleIntervalRef1 = useRef(null);
  const scrambleIntervalRef2 = useRef(null);

  // Spotlight coordinates inside navigation
  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0 });
  const [showSpotlight, setShowSpotlight] = useState(false);

  // Magnetic Navbar motion springs (persists instances across renders)
  const navX = useSpring(0, { stiffness: 220, damping: 26 });
  const navY = useSpring(0, { stiffness: 220, damping: 26 });
  const navScaleX = useSpring(1, { stiffness: 220, damping: 26 });

  const containerRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const { contextSafe } = useGSAP({ scope: containerRef });

  const handleMouseEnter = () => {
    // 1. Scramble Line 1 word: STOP -> START (Snappy 15ms interval, increment by 1)
    if (scrambleIntervalRef1.current) clearInterval(scrambleIntervalRef1.current);
    let iter1 = 0;
    const target1 = 'START';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    const interval1 = setInterval(() => {
      iter1 += 1;
      if (iter1 >= target1.length) {
        setDisplayWord1(target1);
        clearInterval(interval1);
        return;
      }
      setDisplayWord1(
        target1.split('').map((char, index) => {
          if (index < iter1) return target1[index];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join('')
      );
    }, 15);
    scrambleIntervalRef1.current = interval1;

    // 2. Scramble Line 2 word: SLOP. -> CONTEXT. (Snappy 15ms interval, increment by 1)
    if (scrambleIntervalRef2.current) clearInterval(scrambleIntervalRef2.current);
    let iter2 = 0;
    const target2 = 'CONTEXT.';
    
    const interval2 = setInterval(() => {
      iter2 += 1;
      if (iter2 >= target2.length) {
        setDisplayWord2(target2);
        clearInterval(interval2);
        return;
      }
      setDisplayWord2(
        target2.split('').map((char, index) => {
          if (char === '.') return '.';
          if (index < iter2) return target2[index];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join('')
      );
    }, 15);
    scrambleIntervalRef2.current = interval2;
  };

  const handleMouseLeave = () => {
    // 1. Scramble Line 1 word: START -> STOP (Snappy 15ms interval, increment by 1)
    if (scrambleIntervalRef1.current) clearInterval(scrambleIntervalRef1.current);
    let iter1 = 0;
    const target1 = 'STOP';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    const interval1 = setInterval(() => {
      iter1 += 1;
      if (iter1 >= target1.length) {
        setDisplayWord1(target1);
        clearInterval(interval1);
        return;
      }
      setDisplayWord1(
        target1.split('').map((char, index) => {
          if (index < iter1) return target1[index];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join('')
      );
    }, 15);
    scrambleIntervalRef1.current = interval1;

    // 2. Scramble Line 2 word: CONTEXT. -> SLOP. (Snappy 15ms interval, increment by 1)
    if (scrambleIntervalRef2.current) clearInterval(scrambleIntervalRef2.current);
    let iter2 = 0;
    const target2 = 'SLOP.';
    
    const interval2 = setInterval(() => {
      iter2 += 1;
      if (iter2 >= target2.length) {
        setDisplayWord2(target2);
        clearInterval(interval2);
        return;
      }
      setDisplayWord2(
        target2.split('').map((char, index) => {
          if (char === '.') return '.';
          if (index < iter2) return target2[index];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join('')
      );
    }, 15);
    scrambleIntervalRef2.current = interval2;
  };

  // Magnetic & Spotlight hover interaction handlers
  const handleMouseMoveNav = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    
    // Magnetic calculation
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    
    navX.set(Math.max(Math.min(deltaX * 0.02, 6), -6));
    navY.set(Math.max(Math.min(deltaY * 0.04, 4), -4));
    navScaleX.set(1.01);

    // Spotlight position calculation
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setSpotlightPos({ x, y });
    setShowSpotlight(true);
  };

  const handleMouseLeaveNav = () => {
    navX.set(0);
    navY.set(0);
    navScaleX.set(1);
    setShowSpotlight(false);
  };

  // Scroll event observer
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrambleIntervalRef1.current) clearInterval(scrambleIntervalRef1.current);
      if (scrambleIntervalRef2.current) clearInterval(scrambleIntervalRef2.current);
    };
  }, []);

  useGSAP(() => {
    let subheadInstance;
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // 1. Kinetic load reveal (sequential lines and blocks - accelerated timings)
      const tl = gsap.timeline();
      
      tl.from('.line-1', {
        y: 25,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
      });

      tl.from('.line-2', {
        y: 25,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
      }, '-=0.45');

      tl.from('.hero-ghost-word span', {
        opacity: 0,
        scale: 0.98,
        duration: 0.8,
        ease: 'power3.out',
      }, '-=0.45');

      // Split and animate subhead lines/words (accelerated)
      subheadInstance = new SplitType('.split-subhead', { types: 'lines, words' });
      tl.from(subheadInstance.words, {
        y: 8,
        opacity: 0,
        stagger: 0.008,
        duration: 0.6,
        ease: 'power3.out',
      }, '-=0.5');

      tl.from('.hero-ctas', {
        y: 10,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
      }, '-=0.4');

      // Load reveal for fixed navbar: strictly animate OPACITY to prevent transform clashes with Framer Motion springs
      tl.from('.hero-nav', {
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
      }, '-=0.8');

      // 2. Scroll-triggered parallax scaling and drifting
      gsap.to('.split-headline', {
        scale: 0.97,
        opacity: 0.95,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      });

      gsap.to('.hero-ghost-word span', {
        yPercent: 20,
        opacity: 0,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      });

      gsap.to('.split-subhead', {
        y: -10,
        opacity: 0.4,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      });

      gsap.to('.hero-ctas', {
        y: -5,
        opacity: 0.9,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      });
    });

    mm.add('(prefers-reduced-motion: reduce)', () => {
      const tl = gsap.timeline();
      
      tl.from('.line-1', { opacity: 0, duration: 0.6 });
      tl.from('.line-2', { opacity: 0, duration: 0.6 }, '-=0.45');
      tl.from('.hero-ghost-word span', { opacity: 0, duration: 0.8 }, '-=0.45');
      tl.from('.split-subhead', { opacity: 0, duration: 0.6 }, '-=0.5');
      tl.from('.hero-ctas', { opacity: 0, duration: 0.6 }, '-=0.4');
      tl.from('.hero-nav', { opacity: 0, duration: 0.7 }, '-=0.8');
    });

    return () => {
      if (subheadInstance) subheadInstance.revert();
      mm.revert();
    };
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

  // Derive scroll-aware navbar styling classes (border typo corrected to border-zinc-200/80)
  const scrolledClasses = isScrolled 
    ? 'top-3 h-12 max-w-4xl rounded-[24px] bg-white/80 dark:bg-[#0b0b0d]/85 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.08)] dark:shadow-[0_12px_40px_-12px_rgba(255,255,255,0.03)] border-zinc-200/80 dark:border-zinc-800/90 backdrop-blur-2xl'
    : 'top-6 h-14 max-w-5xl rounded-full bg-white/70 dark:bg-[#0b0b0d]/75 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_-8px_rgba(255,255,255,0.01)] border-zinc-200/60 dark:border-zinc-800/60 backdrop-blur-xl';

  return (
    <div ref={containerRef} className="relative w-full min-h-fit md:min-h-screen bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 font-sans selection:bg-zinc-200 dark:selection:bg-zinc-800 overflow-x-hidden flex flex-col transition-colors duration-300">
      
      {/* Decorative premium background SVGs */}
      <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
        {/* Top Left: 4-pointed Minimalist Star */}
        <svg className="absolute left-[12%] top-[22%] w-6 h-6 text-zinc-400 dark:text-zinc-650 opacity-25 dark:opacity-10 animate-pulse duration-[3000ms]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
        </svg>

        {/* Top Right: Concentric Vector Rings */}
        <svg className="absolute right-[14%] top-[18%] w-24 h-24 text-zinc-350 dark:text-zinc-700 opacity-20 dark:opacity-8 animate-[spin_40s_linear_infinite]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.8">
          <circle cx="50" cy="50" r="45" strokeDasharray="3,6" />
          <circle cx="50" cy="50" r="30" />
          <circle cx="50" cy="50" r="15" strokeDasharray="2,2" />
        </svg>

        {/* Center-Left: Coordinate Crosshairs */}
        <svg className="absolute left-[6%] top-[45%] w-8 h-8 text-zinc-400 dark:text-zinc-650 opacity-25 dark:opacity-12" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M20 0v40M0 20h40" strokeDasharray="2,2" />
          <circle cx="20" cy="20" r="6" strokeWidth="0.8" />
        </svg>

        {/* Center-Right: 5x5 Dot Matrix Grid */}
        <svg className="absolute right-[8%] top-[42%] w-20 h-20 text-zinc-350 dark:text-zinc-750 opacity-15 dark:opacity-6" viewBox="0 0 100 100" fill="currentColor">
          <circle cx="10" cy="10" r="1.5" />
          <circle cx="30" cy="10" r="1.5" />
          <circle cx="50" cy="10" r="1.5" />
          <circle cx="70" cy="10" r="1.5" />
          <circle cx="90" cy="10" r="1.5" />
          <circle cx="10" cy="30" r="1.5" />
          <circle cx="30" cy="30" r="1.5" />
          <circle cx="50" cy="30" r="1.5" />
          <circle cx="70" cy="30" r="1.5" />
          <circle cx="90" cy="30" r="1.5" />
          <circle cx="10" cy="50" r="1.5" />
          <circle cx="30" cy="50" r="1.5" />
          <circle cx="50" cy="50" r="1.5" />
          <circle cx="70" cy="50" r="1.5" />
          <circle cx="90" cy="50" r="1.5" />
          <circle cx="10" cy="70" r="1.5" />
          <circle cx="30" cy="70" r="1.5" />
          <circle cx="50" cy="70" r="1.5" />
          <circle cx="70" cy="70" r="1.5" />
          <circle cx="90" cy="70" r="1.5" />
          <circle cx="10" cy="90" r="1.5" />
          <circle cx="30" cy="90" r="1.5" />
          <circle cx="50" cy="90" r="1.5" />
          <circle cx="70" cy="90" r="1.5" />
          <circle cx="90" cy="90" r="1.5" />
        </svg>

        {/* Bottom Left: Angle corner bracket */}
        <svg className="absolute left-[16%] bottom-[18%] w-10 h-10 text-zinc-400 dark:text-zinc-650 opacity-30 dark:opacity-10" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M12 4H4v8M28 4h8v8M12 36H4v-8M28 36h8v-8" strokeLinecap="round" />
        </svg>

        {/* Bottom Right: Sleek 4-pointed Minimalist Star */}
        <svg className="absolute right-[18%] bottom-[20%] w-5 h-5 text-zinc-400 dark:text-zinc-605 opacity-25 dark:opacity-10 animate-pulse duration-[4000ms]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
        </svg>
      </div>

      {/* Ghost Typography Background */}
      <div className="hero-ghost-word absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
        <span className="font-sans font-black text-[clamp(140px,28vw,440px)] uppercase tracking-[-0.04em] text-zinc-950 dark:text-white opacity-[0.025] dark:opacity-[0.015] leading-none select-none">
          CONTEXT
        </span>
      </div>

      {/* Navigation (Floating, Glassmorphism, Magnetic, Spotlight) */}
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
        {/* Spotlight Effect inside Navbar */}
        {showSpotlight && (
          <div 
            className="absolute inset-0 pointer-events-none rounded-full transition-opacity duration-300"
            style={{
              background: `radial-gradient(100px circle at ${spotlightPos.x}px ${spotlightPos.y}px, ${theme === 'light' ? 'rgba(0, 0, 0, 0.035)' : 'rgba(255, 255, 255, 0.08)'}, transparent 80%)`
            }}
          />
        )}

        {/* Left: Logo */}
        <div className="flex items-center gap-3 px-2 group/logo cursor-pointer relative z-10">
          <img 
            src="/logo.png" 
            alt="Zenix Logo" 
            className="w-5.5 h-5.5 object-contain drop-shadow-sm dark:brightness-0 dark:invert transition-all duration-300 group-hover/logo:rotate-[8deg] group-hover/logo:scale-105 group-hover/logo:opacity-90" 
          />
          <span className="font-semibold tracking-tight text-[15px] text-zinc-900 dark:text-white">Zenix</span>
        </div>

        {/* Center Links (hidden on mobile) */}
        <div className="hidden md:flex items-center gap-1 relative z-10">
          {NAV_LINKS.map((link, idx) => (
            <a
              key={link.name}
              href={link.href}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative px-4 py-1.5 rounded-full text-[12px] font-medium text-zinc-500 dark:text-zinc-400 transition-all duration-200 hover:text-zinc-950 dark:hover:text-white hover:-translate-y-[1.5px] z-10"
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

        {/* Right: Actions + Theme Toggle */}
        <div className="flex items-center gap-3 px-2 relative z-10">
          
          {/* Animated Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="relative flex items-center w-12 h-7 rounded-full bg-zinc-150 dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700/60 cursor-pointer p-0.5 transition-colors duration-350 select-none"
            aria-label="Toggle theme"
          >
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="w-5.5 h-5.5 rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center shadow-[0_1px_3px_rgba(0,0,0,0.1)] dark:shadow-none z-10"
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

      {/* Mobile Menu Overlay */}
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

      {/* Hero Content */}
      <main className="flex-1 flex flex-col items-center justify-start text-center px-4 md:px-8 z-10 pt-28 md:pt-36 pb-12 md:pb-20 max-w-7xl mx-auto w-full">
        <div className="w-full flex flex-col items-center">
          
          {/* Headline */}
          <h1 className="split-headline landing-display-tall max-w-7xl text-zinc-950 dark:text-white mx-auto uppercase select-none" style={{ perspective: "1000px" }}>
            <span className="line-1 block opacity-95">
              {displayWord1} shipping
            </span>
            <span className="line-2 block mt-2">
              AI <span 
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="relative inline-block cursor-pointer text-zinc-950 dark:text-white font-sans font-bold tracking-tight select-none group/slop px-1.5"
              >
                {displayWord2}
                <span className="absolute bottom-2 left-0 w-full h-[4px] bg-zinc-950 dark:bg-white scale-x-0 origin-left group-hover/slop:scale-x-100 transition-transform duration-250 ease-out" />
              </span>
            </span>
          </h1>
          
          {/* Subheadline */}
          <p className="split-subhead mt-6 sm:mt-7 text-lg md:text-xl lg:text-[20px] text-zinc-550 dark:text-zinc-400 max-w-[580px] leading-relaxed font-light tracking-[-0.015em] mx-auto">
            Build software with context, architecture, and design systems—not prompts.
          </p>
        </div>

        {/* CTAs */}
        <div className="hero-ctas mt-8 sm:mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
          <RollingButton 
            href="/signup" 
            className="bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-850 dark:hover:bg-zinc-100 hover:-translate-y-0.5 hover:scale-[1.015] shadow-md hover:shadow-xl dark:shadow-none dark:hover:shadow-[0_0_16px_rgba(255,255,255,0.15)] border border-transparent hover:border-zinc-800 dark:hover:border-zinc-200 transition-all duration-300 ease-out px-8 py-3 text-sm md:text-base font-semibold flex items-center gap-1.5 group/hero-primary"
          >
            <span className="flex items-center gap-1.5">
              <span>Start Building</span>
              <svg className="w-3.5 h-3.5 transform group-hover/hero-primary:translate-x-0.75 transition-transform duration-200" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </span>
          </RollingButton>
          <RollingButton 
            href="/github" 
            className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white hover:bg-zinc-50/50 dark:hover:bg-zinc-850 hover:border-zinc-350 dark:hover:border-zinc-700 hover:-translate-y-0.5 hover:scale-[1.015] shadow-sm hover:shadow-md transition-all duration-300 ease-out px-8 py-3 text-sm md:text-base font-semibold flex items-center gap-1.5 group/hero-sec"
          >
            <span className="flex items-center gap-1.5">
              <span>Import from GitHub</span>
              <svg className="w-3.5 h-3.5 transform group-hover/hero-sec:translate-x-0.75 transition-transform duration-200" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </span>
          </RollingButton>
        </div>

      </main>
      
    </div>
  );
}
