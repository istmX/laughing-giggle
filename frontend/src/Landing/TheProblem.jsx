import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROBLEMS } from './ProblemData';
import ProblemCard from './ProblemCard';

gsap.registerPlugin(ScrollTrigger);

export default function TheProblem() {
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // 1. Reduced-motion: static layout
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set('.pcard-stage-2, .pcard-stage-3', { opacity: 1, y: 0, scale: 1 });
      });

      // 2. Desktop (>=1024px): Pinned scroll story
      mm.add(
        '(prefers-reduced-motion: no-preference) and (min-width: 1024px)',
        () => {
          // Initialize stage 2 & stage 3 card states
          gsap.set('.pcard-stage-2, .pcard-stage-3', {
            opacity: 0,
            y: 48,
            scale: 0.96,
          });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: '+=200%',
              scrub: 1.2,
              pin: true,
              pinSpacing: true,
              anticipatePin: 1,
            },
          });

          // Stage 2 Reveal: Cards 3 & 4
          tl.to('.pcard-stage-2', {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.15,
            duration: 1,
            ease: 'power3.out'
          });

          // Stage 3 Reveal: Cards 5 & 6
          tl.to('.pcard-stage-3', {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.15,
            duration: 1,
            ease: 'power3.out'
          });
        }
      );

      // 3. Mobile (<1024px): Sequential scroll reveal
      mm.add(
        '(prefers-reduced-motion: no-preference) and (max-width: 1023px)',
        () => {
          const cards = gsap.utils.toArray('.pcard-mobile-wrap');
          cards.forEach((card) => {
            gsap.fromTo(
              card,
              { opacity: 0, y: 36, scale: 0.97 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.6,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: card,
                  start: 'top 85%',
                  toggleActions: 'play none none reverse',
                },
              }
            );
          });
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="problem"
      className="w-full bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 overflow-hidden py-24 px-6 md:px-12 transition-colors duration-300 border-b border-zinc-100 dark:border-zinc-900"
    >
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-16">
        
        {/* Section Header */}
        <div className="text-center md:text-left max-w-2xl">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-800/60 px-3 py-1 rounded-full select-none">
            Developer Friction
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-zinc-900 dark:text-white mt-4 select-none">
            Why AI coding feels broken.
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base leading-relaxed mt-3">
            Without shared rules or architectural context, language models quickly introduce tech debt.
          </p>
        </div>

        {/* Desktop Masonry Grid Layout (3 Columns) */}
        <div className="hidden lg:grid grid-cols-3 gap-6 w-full">
          {/* Column 1 */}
          <div className="flex flex-col gap-6">
            <div className="pcard-stage-1"><ProblemCard item={PROBLEMS[0]} /></div>
            <div className="pcard-stage-3"><ProblemCard item={PROBLEMS[4]} /></div>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-6">
            <div className="pcard-stage-1"><ProblemCard item={PROBLEMS[1]} /></div>
            <div className="pcard-stage-2"><ProblemCard item={PROBLEMS[3]} /></div>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-6">
            <div className="pcard-stage-2"><ProblemCard item={PROBLEMS[2]} /></div>
            <div className="pcard-stage-3"><ProblemCard item={PROBLEMS[5]} /></div>
          </div>
        </div>

        {/* Mobile Grid Layout (Simple Stacked Scroll Reveal) */}
        <div className="grid lg:hidden grid-cols-1 sm:grid-cols-2 gap-6 w-full">
          {PROBLEMS.map((item) => (
            <div key={item.id} className="pcard-mobile-wrap">
              <ProblemCard item={item} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
