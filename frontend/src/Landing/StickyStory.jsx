import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    num: "01",
    title: "Idea Input",
    tag: "Source",
    desc: "Describe your project or product vision in plain English. Zenix accepts custom descriptions and guides you step-by-step to capture precise parameters.",
    visual: (
      <div className="landing-story-visual flex flex-col gap-4 font-mono text-[13px] text-zinc-400 bg-zinc-900 border border-zinc-800 p-6">
        <div className="text-zinc-600">{"// Describe your software concept"}</div>
        <div className="flex gap-2 text-zinc-100">
          <span className="text-amber-300">prompt:</span>
          <span className="border-r-2 border-zinc-100 animate-pulse pr-1">A developer portfolio with a custom dark theme</span>
        </div>
      </div>
    )
  },
  {
    num: "02",
    title: "Architecture Synthesis",
    tag: "Design",
    desc: "Zenix drafts the structural layout, databases, and dependencies. It determines the system nodes and boundaries to keep code clean and modular.",
    visual: (
      <div className="landing-story-visual relative flex items-center justify-center p-6 border border-zinc-800 bg-zinc-900 h-48">
        <svg className="w-full h-full" viewBox="0 0 360 190" role="img" aria-label="Architecture layers connected from app to external services">
          <g stroke="#f4ecd6" strokeWidth="1.5" fill="none">
            <path d="M180 42V66M62 95H298M62 95V110M180 95V110M298 95V110M180 144V160" />
          </g>
          <g fill="#1f1d3d" stroke="#f4ecd6" strokeWidth="1.5">
            <rect x="125" y="12" width="110" height="30" rx="6" />
            <rect x="18" y="110" width="88" height="30" rx="6" />
            <rect x="136" y="110" width="88" height="30" rx="6" />
            <rect x="254" y="110" width="88" height="30" rx="6" />
            <rect x="125" y="160" width="110" height="24" rx="6" />
          </g>
          <g fill="#ffffff" fontSize="10" textAnchor="middle" fontFamily="monospace">
            <text x="180" y="31">APP</text>
            <text x="62" y="129">UI LAYER</text>
            <text x="180" y="129">DOMAIN</text>
            <text x="298" y="129">DATA</text>
            <text x="180" y="176">SERVICES</text>
          </g>
        </svg>
      </div>
    )
  },
  {
    num: "03",
    title: "Context Compilation",
    tag: "RAG Engine",
    desc: "All design decisions, schemas, and specifications are compiled into standardized Markdown files. This serves as a unified context layer for your IDE tools.",
    visual: (
      <div className="landing-story-visual relative flex flex-col gap-2 h-48 justify-center items-center">
        <div className="absolute top-4 w-4/5 bg-zinc-800 border border-zinc-700 rounded-xl p-6 text-[10px] font-mono text-zinc-400 rotate-[-4deg] shadow-lg">
          architecture.md
        </div>
        <div className="absolute top-8 w-4/5 bg-zinc-800 border border-zinc-700 rounded-xl p-6 text-[10px] font-mono text-zinc-300 rotate-[-1deg] shadow-xl">
          ui-tokens.md
        </div>
        <div className="absolute top-12 w-4/5 bg-zinc-950 border border-zinc-800 rounded-xl p-6 text-[10px] font-mono text-zinc-100 rotate-[2deg] shadow-2xl">
          AGENTS.md
        </div>
      </div>
    )
  },
  {
    num: "04",
    title: "Agent Alignment",
    tag: "Orchestration",
    desc: "AI coding assistants are aligned with the project specification. Standardized agent guides prevent hallucinations and ensure code complies with your goals.",
    visual: (
      <div className="landing-story-visual flex flex-col gap-4 font-mono text-[13px] text-zinc-400 bg-zinc-950 border border-zinc-800 p-6">
        <div className="flex items-center gap-1.5 border-b border-zinc-800 pb-2 mb-1">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
          <span className="text-zinc-600 text-[10px] ml-1">zenix-agent</span>
        </div>
        <div className="text-zinc-500">{"$ agy initialize-context"}</div>
        <div className="text-emerald-400">{"[ok] verified AGENTS.md compliance"}</div>
        <div className="text-emerald-400">{"[ok] system rules synced with cursor"}</div>
      </div>
    )
  },
  {
    num: "05",
    title: "Design Tokens",
    tag: "Design System",
    desc: "Colors, typography scale, radii, and layouts are mapped to standardized variables, establishing a consistent styling language for the frontend.",
    visual: (
      <div className="landing-story-visual flex flex-col gap-4 border border-zinc-800 bg-zinc-900 p-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-amber-400" />
          <div className="w-6 h-6 rounded bg-lime-400" />
          <div className="w-6 h-6 rounded bg-orange-400" />
          <div className="w-6 h-6 rounded bg-zinc-900 border border-zinc-700" />
        </div>
        <div className="flex flex-col gap-1 font-mono text-[13px] text-zinc-400">
          <div>--radius-lg: 24px;</div>
          <div>--color-brand: oklch(0.65 0.15 260);</div>
        </div>
      </div>
    )
  },
  {
    num: "06",
    title: "Production Ready",
    tag: "Deployment",
    desc: "Zenix prepares the output package. Developers can download a ZIP of all markdown blueprints or publish direct design system templates.",
    visual: (
      <div className="landing-story-visual flex flex-col gap-4 items-center justify-center border border-zinc-800 bg-zinc-900 p-6 h-48">
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          ✓
        </div>
        <div className="text-sm font-medium text-zinc-100">Project Context Finalized</div>
      </div>
    )
  }
];

export default function StickyStory() {
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  useGSAP(() => {
    const isMobile = window.matchMedia('(max-width: 1023px)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isMobile || prefersReducedMotion) return;

    const sections = gsap.utils.toArray('.story-panel', containerRef.current);
    const track = trackRef.current;
    const totalPanels = sections.length;
    if (!track || !sections.length) return;

    const getPanelHeight = () => containerRef.current?.querySelector('.landing-story-desktop')?.clientHeight || window.innerHeight;
    const getScrollDistance = () => (totalPanels - 1) * getPanelHeight();

    gsap.set(track, { y: 0 });

    const scrollTween = gsap.to(track, {
      y: () => -getScrollDistance(),
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: 0.8,
        start: 'top top',
        end: () => `+=${getScrollDistance()}`,
        invalidateOnRefresh: true,
      }
    });

    // Animate progress line
    const progressBar = gsap.utils.toArray('.story-progress-bar', containerRef.current);
    gsap.fromTo(progressBar, 
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: () => `+=${getScrollDistance()}`,
          scrub: 0.5,
        }
      }
    );

    const rafId = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(rafId);
      if (scrollTween.scrollTrigger) scrollTween.scrollTrigger.kill();
    };
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="landing-section relative z-20 lg:py-0 lg:flex lg:min-h-screen lg:items-center">
 
      <div className="landing-story-shell w-full max-w-7xl mx-auto text-zinc-950 overflow-hidden relative">
        
        {/* Desktop Sticky Layout */}
        <div className="landing-story-desktop hidden lg:grid w-full h-screen overflow-hidden">
          
          {/* Left Side: Text and Steps Indicator */}
          <div className="landing-story-copy h-full min-w-0 flex flex-col justify-center relative z-10 w-full px-8 xl:px-12">
            
            <div className="absolute left-8 xl:left-12 top-1/4 bottom-1/4 w-[1px] bg-zinc-900/20 origin-top">
              <div className="story-progress-bar w-full h-full bg-zinc-900 scale-y-0 origin-top" />
            </div>

            <div className="landing-story-copy-content flex flex-col gap-4">
              <span className="landing-eyebrow text-zinc-700">
                Interactive Story
              </span>
              <h2 className="landing-heading text-zinc-950">
                A structured path from raw ideas to clean code
              </h2>
              <p className="text-zinc-700 font-light leading-relaxed">
                Scroll down to explore how Zenix translates vision into high fidelity context for your development agents.
              </p>
            </div>
          </div>

          {/* Right Side: Pinned Stacking Visual Panels */}
          <div className="landing-story-stage h-full min-w-0 relative overflow-hidden">
            <div ref={trackRef} className="story-panel-track w-full h-full flex flex-col will-change-transform">
              {STEPS.map((step, idx) => (
                <div
                  key={idx} 
                  className="story-panel w-full h-full min-w-0 shrink-0 flex flex-col justify-center items-center px-8 xl:px-12 border-l"
                >
                  <div className="story-panel-card landing-story-panel w-full max-w-2xl flex flex-col gap-6 hover:border-white transition-colors duration-200">
                    
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[14px] text-zinc-700 font-540 uppercase tracking-wider bg-white/70 px-2.5 py-1 rounded-full border border-zinc-300">
                        {step.tag}
                      </span>
                      <span className="font-mono text-[18px] text-zinc-400">{step.num}</span>
                    </div>

                    <h3 className="landing-story-title">{step.title}</h3>
                    
                    <div className="my-4 flex items-center justify-start">
                      {step.visual}
                    </div>

                    <p className="landing-story-description">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Mobile Stacked Layout */}
        <div className="flex lg:hidden flex-col gap-12 px-6 py-12">
          
          <div className="landing-story-mobile-copy flex flex-col gap-4">
            <span className="landing-eyebrow text-zinc-700">
              Interactive Story
            </span>
            <h2 className="landing-heading text-zinc-950">
              A structured path from raw ideas to clean code
            </h2>
          </div>

          <div className="flex flex-col gap-16">
            {STEPS.map((step, idx) => (
              <div key={idx} className="flex flex-col gap-4 border-l border-zinc-400 pl-4 py-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[14px] text-zinc-700 font-540 uppercase tracking-wider bg-white/70 px-2 py-0.5 rounded-full border border-zinc-300">
                    {step.tag}
                  </span>
                  <span className="font-mono text-sm text-zinc-400">{step.num}</span>
                </div>
                <h3 className="landing-story-title">{step.title}</h3>
                <div className="my-2 flex justify-start">
                  {step.visual}
                </div>
                <p className="landing-story-description text-zinc-700">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

        </div>

      </div>

    </section>
  );
}
