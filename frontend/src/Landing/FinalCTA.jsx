import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { RollingButton } from '@/components/ui/RollingButton';
import { useScramble } from '@/hooks/useScramble';

export default function FinalCTA() {
  const line3 = useScramble({
    enterTarget: "LET'S START.",
    leaveTarget: "IT'S CONTEXT.",
    initial: "IT'S CONTEXT.",
    preserve: (ch) => ch === ' ' || ch === "'" || ch === '.',
  });

  const sectionRef = useRef(null);
  const headlineRef = useRef(null);
  const ghostRef = useRef(null);
  const textRef = useRef(null);
  const ctasRef = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // 1. Entry Animation (Cinematic Reveal)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%', // Starts reveal as section approaches viewport
          toggleActions: 'play none none none',
        }
      });

      tl.from('.cta-head-line', {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: 'power3.out',
      });

      tl.from(ghostRef.current, {
        scale: 0.98,
        opacity: 0,
        duration: 1.0,
        ease: 'power2.out',
      }, '-=0.5');

      tl.from(textRef.current, {
        opacity: 0,
        y: 10,
        duration: 0.5,
        ease: 'power2.out',
      }, '-=0.4');

      tl.from(ctasRef.current, {
        y: 15,
        opacity: 0,
        duration: 0.5,
        ease: 'power3.out',
      }, '-=0.3');

      // 2. Scroll Animation (Fade & Parallax scale-down as user approaches the footer)
      gsap.to(headlineRef.current, {
        scale: 0.96,
        opacity: 0.88,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: true,
        }
      });

      gsap.to(ghostRef.current, {
        yPercent: 15,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: true,
        }
      });
    });

    mm.add('(prefers-reduced-motion: reduce)', () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        }
      });
      tl.from(headlineRef.current, { opacity: 0, duration: 0.8 })
        .from(ghostRef.current, { opacity: 0, duration: 0.8 }, '-=0.4')
        .from(textRef.current, { opacity: 0, duration: 0.6 }, '-=0.4')
        .from(ctasRef.current, { opacity: 0, duration: 0.6 }, '-=0.4');
    });

    return () => {
      mm.revert();
    };
  }, { scope: sectionRef });

  return (
    <section 
      ref={sectionRef}
      className="relative z-10 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 py-16 md:py-24 flex flex-col justify-center items-center overflow-hidden border-t border-zinc-200/50 dark:border-zinc-800/40 transition-colors duration-300 w-full"
    >
      
      {/* Background Radial Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 z-0">
        <div className="w-[500px] h-[500px] rounded-full bg-brand-indigo/5 dark:bg-indigo-500/5 blur-[100px]" />
      </div>

      {/* Huge Background Ghost Word */}
      <div 
        ref={ghostRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0 select-none"
      >
        <span className="font-sans font-black text-[clamp(150px,30vw,480px)] uppercase tracking-[-0.04em] text-zinc-950 dark:text-white opacity-[0.035] dark:opacity-[0.025] leading-none select-none">
          SYSTEMS
        </span>
      </div>

      {/* Foreground Container */}
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 md:px-8 flex flex-col items-center justify-center text-center">
        
        {/* Editorial Headline */}
        <h2 
          ref={headlineRef}
          className="text-zinc-950 dark:text-white uppercase select-none tracking-tighter leading-[0.85] text-center mb-6 flex flex-col items-center"
        >
          <span className="cta-head-line block font-extralight text-[clamp(36px,6.5vw,80px)] tracking-tight">
            The Future
          </span>
          <span className="cta-head-line block font-bold text-[clamp(42px,7.5vw,96px)] mt-2">
            Isn't Prompts.
          </span>
          <span className="cta-head-line block font-black text-[clamp(48px,8.5vw,115px)] mt-2 h-[1.1em]">
            {line3.display}
          </span>
        </h2>

        <p 
          ref={textRef}
          className="text-zinc-550 dark:text-zinc-400 font-light text-[clamp(15px,1.8vw,20px)] w-full max-w-2xl leading-relaxed text-center mb-8"
        >
          Everything your AI needs. Nothing it doesn't.
        </p>

        {/* Interactive CTA Buttons */}
        <div 
          ref={ctasRef}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center"
        >
          <RollingButton 
            href="/signup" 
onMouseEnter={line3.handleEnter}
              onMouseLeave={line3.handleLeave}
            className="bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-855 dark:hover:bg-zinc-100 hover:-translate-y-0.5 hover:scale-[1.015] shadow-xs hover:shadow-md dark:shadow-none dark:hover:shadow-[0_0_12px_rgba(255,255,255,0.15)] border border-transparent hover:border-zinc-800 dark:hover:border-zinc-200 transition-all duration-350 ease-out px-8 py-3 font-semibold flex items-center gap-1.5 group/final-primary"
          >
            <span className="flex items-center gap-1.5">
              <span>Start Building</span>
              <svg className="w-3.5 h-3.5 transform group-hover/final-primary:translate-x-0.75 transition-transform duration-200" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </span>
          </RollingButton>

          <RollingButton 
            href="/github" 
            className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white hover:bg-zinc-50/50 dark:hover:bg-zinc-855 hover:border-zinc-350 dark:hover:border-zinc-700 hover:-translate-y-0.5 hover:scale-[1.015] shadow-xs hover:shadow-sm transition-all duration-350 ease-out px-8 py-3 font-semibold flex items-center gap-1.5 group/final-sec"
          >
            <span className="flex items-center gap-1.5">
              <span>Import from GitHub</span>
              <svg className="w-3.5 h-3.5 transform group-hover/final-sec:translate-x-0.75 transition-transform duration-200" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </span>
          </RollingButton>
        </div>

      </div>
    </section>
  );
}
