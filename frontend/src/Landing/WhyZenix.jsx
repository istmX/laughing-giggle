import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CARDS = [
  {
    num: "01",
    title: "The Prompt Approach",
    type: "Traditional",
    heading: "Fragile strings instead of structures",
    desc: "AI coding assistants require endless repetition. Copying code files back and forth leads to context loss, drift, and structural decay.",
    visual: (
      <div className="flex flex-col gap-2 font-mono text-[11px] text-red-400 bg-red-950/20 border border-red-900/40 rounded-lg p-4 w-full max-w-xs">
        <div>{"$ prompt: Build user authentication"}</div>
        <div className="text-zinc-500">{"Thinking..."}</div>
        <div className="text-red-500">{"[error] maximum context length exceeded"}</div>
        <div className="text-red-500">{"[error] file path login.jsx not found"}</div>
      </div>
    )
  },
  {
    num: "02",
    title: "The Zenix Approach",
    type: "Context Engine",
    heading: "Context first, architecture always",
    desc: "By generating local instructions, specifications, and layout tokens first, every AI tool knows exactly how your codebase is structured.",
    visual: (
      <div className="flex flex-col gap-2 font-mono text-[11px] text-emerald-400 bg-emerald-950/20 border border-emerald-900/40 rounded-lg p-4 w-full max-w-xs">
        <div>{"$ agy analyze-workspace"}</div>
        <div className="text-zinc-300">{"Indexing folders..."}</div>
        <div className="text-emerald-400">{"[success] aligned AGENTS.md instructions"}</div>
        <div className="text-emerald-400">{"[success] synced ui-tokens with tailwind"}</div>
      </div>
    )
  },
  {
    num: "03",
    title: "Engineering Workflow",
    type: "Automation",
    heading: "Eliminate repetitive descriptions",
    desc: "Tell Zenix your concept once. It maps databases, aligns files, and builds structured instructions automatically, saving hours of configuration.",
    visual: (
      <div className="relative flex flex-col gap-1 w-full max-w-xs h-32 justify-center">
        <div className="flex justify-between text-[10px] text-zinc-500 font-mono">
          <span>Idea Capture</span>
          <span>Aligned Build</span>
        </div>
        <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden relative">
          <div className="absolute top-0 left-0 w-3/4 h-full bg-emerald-500" />
        </div>
        <div className="flex gap-2 mt-2">
          <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">PM Spec: Active</span>
          <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">Schema: Synced</span>
        </div>
      </div>
    )
  },
  {
    num: "04",
    title: "Production Ready",
    type: "Scale",
    heading: "Deploy with complete system alignment",
    desc: "Every generated context package is fully structured for teamwork. Multiple developers or autonomous AI agents work with identical instructions.",
    visual: (
      <div className="flex flex-col gap-3 p-4 border border-zinc-800 rounded-lg bg-zinc-900 w-full max-w-xs shadow-xl">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider">AWS Production Cluster</span>
        </div>
        <div className="text-xs text-zinc-300 font-light">
          Context blueprints verified. Ready for staging deployment pipeline.
        </div>
      </div>
    )
  }
];

export default function WhyZenix() {
  const containerRef = useRef(null);
  const scrollRef = useRef(null);

  useGSAP(() => {
    const isMobile = window.matchMedia('(max-width: 1023px)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isMobile || prefersReducedMotion) return;

    const sections = gsap.utils.toArray('.why-card');
    const scrollWidth = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;

    const scrollTween = gsap.to(scrollRef.current, {
      x: -scrollWidth,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,
        scrub: 0.5,
        start: 'top top',
        end: () => `+=${scrollWidth}`,
        invalidateOnRefresh: true,
      }
    });

    return () => {
      if (scrollTween.scrollTrigger) scrollTween.scrollTrigger.kill();
    };
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="landing-section relative overflow-hidden z-20">
      
      {/* Desktop Horizontal Scroll Layout */}
      <div className="hidden lg:flex flex-col justify-center h-screen w-full pl-16 xl:pl-24">
        
        <div className="landing-section-header mb-12 text-left">
          <span className="landing-eyebrow">
            Platform Benefits
          </span>
          <h2 className="landing-heading">
            Why engineers build with Zenix
          </h2>
        </div>

        <div ref={scrollRef} className="flex gap-[32px] pr-24 items-stretch select-none">
          {CARDS.map((card, idx) => (
            <div 
              key={idx}
              className="why-card landing-card shrink-0 w-[420px] flex flex-col justify-between gap-8"
            >
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[14px] text-emerald-700 font-540 uppercase tracking-wider bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                    {card.type}
                  </span>
                  <span className="font-mono text-zinc-300 text-lg">{card.num}</span>
                </div>
                <h3 className="text-[28px] font-bold tracking-tight text-zinc-900">{card.heading}</h3>
                <p className="text-zinc-550 text-[18px] font-light leading-relaxed">
                  {card.desc}
                </p>
              </div>
              
              <div className="flex justify-center items-center py-4 border-t border-zinc-100">
                {card.visual}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Mobile Vertical Stacked Layout */}
      <div className="landing-container flex lg:hidden flex-col">
        
        <div className="flex flex-col gap-4">
          <span className="landing-eyebrow">
            Platform Benefits
          </span>
          <h2 className="landing-heading">
            Why engineers build with Zenix
          </h2>
        </div>

        <div className="flex flex-col gap-[32px]">
          {CARDS.map((card, idx) => (
            <div 
              key={idx}
              className="landing-card flex flex-col gap-6"
            >
              <div className="flex justify-between items-center">
                <span className="font-mono text-[14px] text-emerald-700 font-540 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  {card.type}
                </span>
                <span className="font-mono text-zinc-300 text-sm">{card.num}</span>
              </div>
              <h3 className="text-[28px] font-bold tracking-tight text-zinc-900">{card.heading}</h3>
              <p className="text-zinc-550 text-[18px] font-light leading-relaxed">
                {card.desc}
              </p>
              <div className="flex justify-start items-center py-2">
                {card.visual}
              </div>
            </div>
          ))}
        </div>

      </div>

    </section>
  );
}
