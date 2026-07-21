import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROBLEMS } from './ProblemData';
import InteractiveKeyword from './InteractiveKeyword';

gsap.registerPlugin(ScrollTrigger);

export default function TheProblem() {
  const sectionRef = useRef(null);
  const countRef = useRef(null);
  const progressFillRef = useRef(null);

  useGSAP(
    () => {
      const isDark = document.documentElement.classList.contains('dark');
      const items = gsap.utils.toArray('.problem-item');

      // Set initial state for all items (dimmed)
      items.forEach((item) => {
        const title = item.querySelector('.problem-title');
        const desc = item.querySelector('.problem-desc');
        
        gsap.set(title, { color: isDark ? '#3f3f46' : '#d4d4d8' });
        gsap.set(desc, { color: isDark ? '#27272a' : '#e4e4e7' });
      });

      const mm = gsap.matchMedia();

      // Desktop (>=1024px) scroll tracking
      mm.add(
        '(prefers-reduced-motion: no-preference) and (min-width: 1024px)',
        () => {
          // Initialize sticky HUD state to hidden
          gsap.set('.sticky-hud', { opacity: 0, y: 24 });

          // Reveal sticky HUD when scrolling past the first item and keep pinned there
          gsap.fromTo('.sticky-hud',
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              scrollTrigger: {
                trigger: '.problem-item[data-index="0"]',
                start: 'top 50%',
                toggleActions: 'play none none reverse',
              }
            }
          );

          items.forEach((item, idx) => {
            const title = item.querySelector('.problem-title');
            const desc = item.querySelector('.problem-desc');

            gsap.timeline({
              scrollTrigger: {
                trigger: item,
                start: 'top 65%',
                end: 'bottom 40%',
                toggleActions: 'play reverse play reverse',
                onEnter: () => {
                  if (countRef.current) countRef.current.textContent = `0${idx + 1}`;
                  if (progressFillRef.current) {
                    progressFillRef.current.style.height = `${((idx + 1) / items.length) * 100}%`;
                  }
                },
                onEnterBack: () => {
                  if (countRef.current) countRef.current.textContent = `0${idx + 1}`;
                  if (progressFillRef.current) {
                    progressFillRef.current.style.height = `${((idx + 1) / items.length) * 100}%`;
                  }
                }
              }
            })
            .to(title, { color: isDark ? '#ffffff' : '#09090b', duration: 0.25 })
            .to(desc, { color: isDark ? '#a1a1aa' : '#52525b', duration: 0.25 }, 0);
          });
        }
      );

      // Mobile/Tablet (<1024px) scroll tracking
      mm.add(
        '(prefers-reduced-motion: no-preference) and (max-width: 1023px)',
        () => {
          gsap.set('.sticky-hud', { opacity: 1, y: 0 });

          items.forEach((item, idx) => {
            const title = item.querySelector('.problem-title');
            const desc = item.querySelector('.problem-desc');

            gsap.timeline({
              scrollTrigger: {
                trigger: item,
                start: 'top 75%',
                end: 'bottom 30%',
                toggleActions: 'play reverse play reverse',
                onEnter: () => {
                  if (countRef.current) countRef.current.textContent = `0${idx + 1}`;
                  if (progressFillRef.current) {
                    progressFillRef.current.style.height = `${((idx + 1) / items.length) * 100}%`;
                  }
                },
                onEnterBack: () => {
                  if (countRef.current) countRef.current.textContent = `0${idx + 1}`;
                  if (progressFillRef.current) {
                    progressFillRef.current.style.height = `${((idx + 1) / items.length) * 100}%`;
                  }
                }
              }
            })
            .to(title, { color: isDark ? '#ffffff' : '#09090b', duration: 0.25 })
            .to(desc, { color: isDark ? '#a1a1aa' : '#52525b', duration: 0.25 }, 0);
          });
        }
      );

      // Reduced motion fallback
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set('.sticky-hud', { opacity: 1, y: 0 });
        items.forEach((item) => {
          const title = item.querySelector('.problem-title');
          const desc = item.querySelector('.problem-desc');
          gsap.set(title, { color: isDark ? '#ffffff' : '#09090b' });
          gsap.set(desc, { color: isDark ? '#a1a1aa' : '#52525b' });
        });
      });
    },
    { scope: sectionRef }
  );

  // Helper to parse description text and wrap interactive keywords
  const formatDesc = (item) => {
    const text = item.desc;
    const keyword = item.keyword;
    const tooltip = item.tooltip;
    
    if (!keyword) return text;
    
    const parts = text.split(new RegExp(`(${keyword})`, 'g'));
    return parts.map((part, idx) => {
      if (part === keyword) {
        return (
          <InteractiveKeyword key={idx} word={keyword} tooltip={tooltip}>
            {keyword}
          </InteractiveKeyword>
        );
      }
      return part;
    });
  };

  return (
    <section
      ref={sectionRef}
      id="problem"
      className="w-full bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 overflow-hidden py-24 px-6 md:px-12 transition-colors duration-300 border-b border-zinc-100 dark:border-zinc-900"
    >
      <div className="max-w-7xl mx-auto w-full">
        
        {/* Two-column Typographic Editorial Layout */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 w-full items-start">
          
          {/* Left Sticky Progress HUD */}
          <div className="sticky-hud w-full lg:w-[38%] lg:sticky lg:top-32 flex flex-col gap-6 select-none pt-4">
            <span className="w-fit text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-800/60 px-3 py-1 rounded-full">
              Developer Friction
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-zinc-900 dark:text-white leading-[1.05]">
              Why AI coding feels broken.
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base leading-relaxed max-w-sm">
              Without shared rules or architectural context, language models quickly introduce tech debt.
            </p>

            {/* Vertical Progress Bar Tracker */}
            <div className="flex items-center gap-6 mt-6">
              {/* Vertical line container */}
              <div className="relative w-[1.5px] h-24 bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden shrink-0">
                <div 
                  ref={progressFillRef}
                  className="w-full bg-zinc-950 dark:bg-white h-0 transition-all duration-300 ease-out origin-top"
                />
              </div>
              
              {/* Counter HUD */}
              <div className="flex items-baseline gap-1 font-mono">
                <span ref={countRef} className="text-2xl font-bold text-zinc-950 dark:text-white">01</span>
                <span className="text-xs text-zinc-400 dark:text-zinc-650 font-medium">/ 06</span>
              </div>
            </div>
          </div>

          {/* Right Column: Typographic stack */}
          <div className="w-full lg:w-[62%] flex flex-col gap-12 md:gap-16 pb-12">
            {PROBLEMS.map((item, idx) => (
              <div
                key={item.id}
                data-index={idx}
                className="problem-item flex gap-6 sm:gap-8 border-b border-zinc-100 dark:border-zinc-900 pb-10 last:border-b-0 last:pb-0"
              >
                {/* Index number */}
                <span className="font-mono text-xs sm:text-sm font-semibold tracking-wider text-zinc-400 dark:text-zinc-600 mt-1 select-none">
                  0{idx + 1}
                </span>

                {/* Content */}
                <div className="flex-1 flex flex-col gap-3">
                  <h3 className="problem-title text-xl sm:text-2xl font-bold tracking-tight transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="problem-desc text-sm sm:text-base leading-relaxed transition-colors duration-300">
                    {formatDesc(item)}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
