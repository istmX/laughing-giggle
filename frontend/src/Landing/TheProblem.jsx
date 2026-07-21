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

  useGSAP(() => {
    const items = gsap.utils.toArray('.problem-row');
    const updateHUD = (idx) => {
      items.forEach((el, i) => el.classList.toggle('active', i === idx));
      if (countRef.current) countRef.current.textContent = `0${idx + 1}`;
      if (progressFillRef.current) {
        progressFillRef.current.style.height = `${((idx + 1) / items.length) * 100}%`;
      }
    };

    items.forEach((item, idx) => idx === 0 ? item.classList.add('active') : item.classList.remove('active'));

    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference) and (min-width: 1024px)', () => {
      gsap.set('.sticky-hud', { opacity: 0, y: 24 });
      gsap.fromTo('.sticky-hud', { opacity: 0, y: 24 }, {
        opacity: 1, y: 0, duration: 0.5,
        scrollTrigger: { trigger: '.problem-row[data-index="0"]', start: 'top 50%', toggleActions: 'play none none reverse' }
      });
      items.forEach((item, idx) => {
        ScrollTrigger.create({
          trigger: item, start: 'top 65%', end: 'bottom 45%', toggleActions: 'play reverse play reverse',
          onEnter: () => updateHUD(idx), onEnterBack: () => updateHUD(idx)
        });
      });
    });

    mm.add('(prefers-reduced-motion: no-preference) and (max-width: 1023px)', () => {
      gsap.set('.sticky-hud', { opacity: 1, y: 0 });
      items.forEach((item, idx) => {
        ScrollTrigger.create({
          trigger: item, start: 'top 75%', end: 'bottom 35%', toggleActions: 'play reverse play reverse',
          onEnter: () => updateHUD(idx), onEnterBack: () => updateHUD(idx)
        });
      });
    });

    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set('.sticky-hud', { opacity: 1, y: 0 });
      items.forEach(item => item.classList.add('active'));
    });
  }, { scope: sectionRef });

  const formatDesc = (item) => {
    if (!item.keyword) return item.desc;
    return item.desc.split(new RegExp(`(${item.keyword})`, 'g')).map((part, idx) => 
      part === item.keyword ? (
        <InteractiveKeyword key={idx} word={item.keyword} tooltipTitle={item.tooltipTitle} tooltipDesc={item.tooltipDesc}>
          {item.keyword}
        </InteractiveKeyword>
      ) : part
    );
  };

  return (
    <section ref={sectionRef} id="problem" className="w-full bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 py-16 md:py-20 transition-colors duration-300 border-b border-zinc-100 dark:border-zinc-900">
      <div className="max-w-6xl mx-auto w-full px-6">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 w-full items-start">
          <div className="sticky-hud w-full lg:w-[38%] lg:sticky lg:top-32 flex flex-col gap-5 select-none pt-2">
            <span className="w-fit text-[9px] font-mono font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-800/60 px-3 py-1 rounded-full">Developer Friction</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-zinc-900 dark:text-white leading-[1.05]">Why AI coding feels broken.</h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed max-w-[320px]">Without shared rules or architectural context, language models quickly introduce tech debt.</p>
            <a href="#blueprints" className="group w-fit text-xs font-semibold tracking-wide text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white flex items-center gap-1.5 transition-colors mt-2">
              Explore Zenix blueprints <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>
            <div className="flex items-center gap-5 mt-6 border-t border-zinc-100 dark:border-zinc-900 pt-6">
              <div className="relative w-[1.5px] h-16 bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden shrink-0">
                <div ref={progressFillRef} className="w-full bg-zinc-950 dark:bg-white h-[16%] transition-all duration-300 ease-out origin-top" />
              </div>
              <div className="flex flex-col gap-0.5 font-mono">
                <span ref={countRef} className="text-xl font-bold text-zinc-950 dark:text-white leading-none">01</span>
                <span className="text-[9px] text-zinc-400 dark:text-zinc-650 font-medium uppercase tracking-wider">Step</span>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-[62%] flex flex-col pb-6">
            {PROBLEMS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={item.id} data-index={idx} className="problem-row group flex gap-6 sm:gap-8 py-6 sm:py-7 border-b border-zinc-100 dark:border-zinc-900 last:border-b-0 pl-4 border-l-2 border-l-transparent transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] opacity-50 hover:opacity-80 scale-100 [&.active]:opacity-100 [&.active]:scale-[1.01] [&.active]:border-l-zinc-950 dark:[&.active]:border-l-white">
                  <span className="font-mono text-xs sm:text-sm font-semibold tracking-wider text-zinc-400 dark:text-zinc-650 mt-1 select-none">0{idx + 1}</span>
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="problem-title text-base sm:text-lg font-bold tracking-tight text-zinc-950 dark:text-white transition-colors duration-300">{item.title}</h3>
                      <Icon className="w-4 h-4 text-zinc-400 dark:text-zinc-600 transition-colors shrink-0" />
                    </div>
                    <p className="problem-desc text-xs sm:text-sm leading-relaxed text-zinc-500 dark:text-zinc-400 transition-colors duration-300">{formatDesc(item)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
