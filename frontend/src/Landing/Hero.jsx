import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import SplitType from 'split-type'
import { RollingButton } from '../components/ui/RollingButton'
import { Navbar } from '../components/ui/Navbar'


export default function Hero() {
  const [displayWord1, setDisplayWord1] = useState('STOP')
  const [displayWord2, setDisplayWord2] = useState('SLOP.')
  const [displayGhost, setDisplayGhost] = useState('CONTEXT')

  const scrambleIntervalRef1 = useRef(null)
  const scrambleIntervalRef2 = useRef(null)
  const scrambleGhostRef = useRef(null)

  const containerRef = useRef(null)

  const handleMouseEnter = () => {
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

  // Scramble Background Ghost Word CONTEXT -> SLOP
  const handleMouseEnterGhost = () => {
    if (scrambleGhostRef.current) clearInterval(scrambleGhostRef.current);
    let iter = 0;
    const target = 'SLOP';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    const interval = setInterval(() => {
      iter += 1;
      if (iter >= target.length) {
        setDisplayGhost(target);
        clearInterval(interval);
        return;
      }
      setDisplayGhost(
        target.split('').map((char, index) => {
          if (index < iter) return target[index];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join('')
      );
    }, 15);
    scrambleGhostRef.current = interval;
  };

  const handleMouseLeaveGhost = () => {
    if (scrambleGhostRef.current) clearInterval(scrambleGhostRef.current);
    let iter = 0;
    const target = 'CONTEXT';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    const interval = setInterval(() => {
      iter += 1;
      if (iter >= target.length) {
        setDisplayGhost(target);
        clearInterval(interval);
        return;
      }
      setDisplayGhost(
        target.split('').map((char, index) => {
          if (index < iter) return target[index];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join('')
      );
    }, 15);
    scrambleGhostRef.current = interval;
  };

  // Synchronized front & back scramble morph triggers
  const handleMouseEnterAll = () => {
    handleMouseEnter();
    handleMouseEnterGhost();
  };

  const handleMouseLeaveAll = () => {
    handleMouseLeave();
    handleMouseLeaveGhost();
  };
  useEffect(() => {
    return () => {
      if (scrambleIntervalRef1.current) clearInterval(scrambleIntervalRef1.current)
      if (scrambleIntervalRef2.current) clearInterval(scrambleIntervalRef2.current)
      if (scrambleGhostRef.current) clearInterval(scrambleGhostRef.current)
    }
  }, [])


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



  return (
    <div ref={containerRef} className="relative w-full min-h-fit md:min-h-screen bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 font-sans selection:bg-zinc-200 dark:selection:bg-zinc-800 overflow-x-hidden flex flex-col transition-colors duration-300">
      
      {/* Decorative premium background SVGs */}
      <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
        {/* Top Left: 4-pointed Minimalist Star */}
        <svg className="absolute left-[8%] top-[120px] w-6 h-6 text-zinc-400 dark:text-zinc-650 opacity-35 dark:opacity-20 animate-pulse duration-[3000ms]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
        </svg>

        {/* Top Right: Concentric Vector Rings */}
        <svg className="absolute right-[8%] top-[90px] w-24 h-24 text-zinc-350 dark:text-zinc-700 opacity-30 dark:opacity-15 animate-[spin_40s_linear_infinite]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.8">
          <circle cx="50" cy="50" r="45" strokeDasharray="3,6" />
          <circle cx="50" cy="50" r="30" />
          <circle cx="50" cy="50" r="15" strokeDasharray="2,2" />
        </svg>

        {/* Center-Left: Coordinate Crosshairs */}
        <svg className="absolute left-[4%] top-[45%] w-8 h-8 text-zinc-400 dark:text-zinc-650 opacity-35 dark:opacity-20" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M20 0v40M0 20h40" strokeDasharray="2,2" />
          <circle cx="20" cy="20" r="6" strokeWidth="0.8" />
        </svg>

        {/* Center-Right: 5x5 Dot Matrix Grid */}
        <svg className="absolute right-[5%] top-[40%] w-20 h-20 text-zinc-350 dark:text-zinc-750 opacity-25 dark:opacity-12" viewBox="0 0 100 100" fill="currentColor">
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
        <svg className="absolute left-[12%] bottom-[120px] w-10 h-10 text-zinc-400 dark:text-zinc-650 opacity-40 dark:opacity-20" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M12 4H4v8M28 4h8v8M12 36H4v-8M28 36h8v-8" strokeLinecap="round" />
        </svg>

        {/* Bottom Right: Sleek 4-pointed Minimalist Star */}
        <svg className="absolute right-[12%] bottom-[100px] w-5 h-5 text-zinc-400 dark:text-zinc-605 opacity-35 dark:opacity-20 animate-pulse duration-[4000ms]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
        </svg>
      </div>

      {/* Ghost Typography Background */}
      <div className="hero-ghost-word absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0">
        <span 
          onMouseEnter={handleMouseEnterAll}
          onMouseLeave={handleMouseLeaveAll}
          className="font-sans font-black text-[clamp(140px,28vw,440px)] uppercase tracking-[-0.04em] text-zinc-950 dark:text-white opacity-[0.055] dark:opacity-[0.035] leading-none select-none pointer-events-auto cursor-pointer"
        >
          {displayGhost}
        </span>
      </div>
      <Navbar />

      {/* Hero Content */}
      <main className="flex-1 flex flex-col items-center justify-start text-center px-4 md:px-8 z-10 pt-28 md:pt-36 pb-12 md:pb-20 max-w-7xl mx-auto w-full">
        <div className="w-full flex flex-col items-center">
          
          {/* Headline (pointer-events-none added to avoid overlap with background elements) */}
          <h1 className="split-headline landing-display-tall max-w-7xl text-zinc-950 dark:text-white mx-auto uppercase select-none pointer-events-none" style={{ perspective: "1000px" }}>
            <span className="line-1 block w-fit mx-auto opacity-95 pointer-events-auto">
              {displayWord1} shipping
            </span>
            <span className="line-2 block w-fit mx-auto mt-2 pointer-events-auto">
              AI <span 
                onMouseEnter={handleMouseEnterAll}
                onMouseLeave={handleMouseLeaveAll}
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
            className="bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-855 dark:hover:bg-zinc-100 hover:-translate-y-0.5 hover:scale-[1.015] shadow-md hover:shadow-xl dark:shadow-none dark:hover:shadow-[0_0_16px_rgba(255,255,255,0.15)] border border-transparent hover:border-zinc-800 dark:hover:border-zinc-200 transition-all duration-300 ease-out px-8 py-3 text-sm md:text-base font-semibold flex items-center gap-1.5 group/hero-primary"
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
            className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white hover:bg-zinc-50/50 dark:hover:bg-zinc-855 hover:border-zinc-350 dark:hover:border-zinc-700 hover:-translate-y-0.5 hover:scale-[1.015] shadow-sm hover:shadow-md transition-all duration-300 ease-out px-8 py-3 text-sm md:text-base font-semibold flex items-center gap-1.5 group/hero-sec"
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
