import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RollingButton } from '@/components/ui/RollingButton';

gsap.registerPlugin(ScrollTrigger);

const CATEGORIES = ['All', 'SaaS', 'Portfolio', 'Agency', 'Blog', 'Mobile'];

const INCLUDES = [
  { 
    label: 'Project Architecture', 
    tooltip: 'Standardized folder structures, naming conventions, and modular routing guidelines.' 
  },
  { 
    label: 'AGENTS.md', 
    tooltip: 'Operational rules, personality parameters, and identity instructions for AI coding agents.' 
  },
  { 
    label: 'DESIGN.md', 
    tooltip: 'Color palettes, font pairings, visual principles, and interactive element criteria.' 
  },
  { 
    label: 'UI Tokens', 
    tooltip: 'CSS variables for primitive and semantic tokens controlling spacing, radius, and shadows.' 
  },
  { 
    label: 'Task Breakdown', 
    tooltip: 'Chronological implementation plan, sub-task structures, and validation criteria.' 
  },
  { 
    label: 'Documentation', 
    tooltip: 'Comprehensive workspace setup, environment variables, and build run commands.' 
  },
  { 
    label: 'AI Instructions', 
    tooltip: 'Optimized developer prompts to make code generation fast, accurate, and predictable.' 
  },
  { 
    label: 'Best Practices', 
    tooltip: 'Standard engineering directives for performance, accessibility, and file length limits.' 
  },
];

// Helper to generate dynamic featured card state based on selected category filter
const getFeaturedTemplateData = (category) => {
  const titles = {
    All: 'Your Template Could Be Here',
    SaaS: 'Your SaaS Template Here',
    Portfolio: 'Your Portfolio Template Here',
    Agency: 'Your Agency Template Here',
    Blog: 'Your Blog Template Here',
    Mobile: 'Your Mobile Template Here',
  };

  const descriptions = {
    All: 'Publish reusable context systems and help thousands of developers build faster.',
    SaaS: 'Share Next.js layout schemes, database setups, and API folders.',
    Portfolio: 'Provide warm-sand typography grids, custom scroll timelines, and bio templates.',
    Agency: 'Distribute black/neon capability showcases, split layout cards, and contact models.',
    Blog: 'Help others boot up clean reading layouts, dark selectors, and markdown presets.',
    Mobile: 'Deploy optimized NativeWind utilities, screen stacks, and zustand store frameworks.',
  };

  const tags = {
    All: ['Architecture', 'AGENTS.md', 'DESIGN.md', 'UI Tokens'],
    SaaS: ['Next.js 16', 'Supabase', 'Tailwind'],
    Portfolio: ['Editorial Scales', 'Motion Specs', 'Minimalist'],
    Agency: ['GSAP Core', 'Grid System', 'Dark Theme'],
    Blog: ['Prose Reading', 'MDX Setup', 'Newsletter'],
    Mobile: ['Expo Router', 'NativeWind', 'Zustand'],
  };

  const gradients = {
    All: 'from-violet-500/20 via-indigo-500/10 to-transparent',
    SaaS: 'from-blue-500/20 via-sky-500/10 to-transparent',
    Portfolio: 'from-amber-500/20 via-orange-500/10 to-transparent',
    Agency: 'from-rose-500/20 via-pink-500/10 to-transparent',
    Blog: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    Mobile: 'from-cyan-500/20 via-blue-500/10 to-transparent',
  };

  return {
    id: `template-coming-soon-${category.toLowerCase()}`,
    title: titles[category] || titles.All,
    description: descriptions[category] || descriptions.All,
    author: '@community',
    category: category === 'All' ? 'SaaS' : category,
    rating: '--',
    downloads: '--',
    tags: tags[category] || tags.All,
    gradient: gradients[category] || gradients.All,
  };
};

export default function CommunityTemplates({ initialTemplatesData = [] }) {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const previewRef = useRef(null);
  const includesRef = useRef(null);
  const ctaRef = useRef(null);

  const [activeCategory, setActiveCategory] = useState('All');

  // Check if live data is provided
  const hasRealTemplates = initialTemplatesData && initialTemplatesData.length > 0;

  // Dynamically derive the featured template data from the selected category
  const featuredData = getFeaturedTemplateData(activeCategory);

  // GSAP scroll reveal setup
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header entrance
      if (headerRef.current) {
        gsap.from(headerRef.current.children, {
          y: 20,
          opacity: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 90%',
          },
        });
      }

      // Preview area entrance (Featured card & skeleton cards)
      if (previewRef.current) {
        gsap.from(previewRef.current.querySelectorAll('.animate-on-scroll'), {
          y: 30,
          opacity: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: previewRef.current,
            start: 'top 85%',
          },
        });
      }

      // Bottom context chips entrance
      if (includesRef.current) {
        gsap.from(includesRef.current.children, {
          y: 15,
          opacity: 0,
          duration: 0.6,
          stagger: 0.04,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: includesRef.current,
            start: 'top 90%',
          },
        });
      }

      // Bottom CTA entrance
      if (ctaRef.current) {
        gsap.from(ctaRef.current.children, {
          y: 20,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ctaRef.current,
            start: 'top 95%',
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="templates"
      ref={sectionRef}
      className="landing-section relative z-10 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 border-t border-zinc-200/70 dark:border-zinc-800/70 py-16 md:py-24 transition-colors duration-300 overflow-hidden"
    >
      <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8">
        
        {hasRealTemplates ? (
          /* Real templates view - driven by initialTemplatesData */
          <div className="flex flex-col gap-10 mb-16 md:mb-20">
            <div ref={headerRef} className="flex flex-col gap-4 max-w-2xl">
              <span className="font-mono text-[12px] font-medium uppercase tracking-[0.16em] text-zinc-400">
                Community Templates
              </span>
              <h2 className="text-[clamp(32px,3.5vw,46px)] font-bold tracking-[-0.03em] leading-[1.1] text-zinc-950 dark:text-zinc-50">
                Stop starting from scratch.
              </h2>
              <p className="text-[15px] sm:text-[16px] text-zinc-550 dark:text-zinc-400 leading-relaxed">
                Discover and implement optimized context systems created by our developer community.
              </p>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className="h-8 px-4 rounded-full text-[12px] font-medium transition-all duration-200 border cursor-pointer select-none"
                    style={{
                      background: activeCategory === cat ? 'var(--foreground)' : 'transparent',
                      color: activeCategory === cat ? 'var(--background)' : 'var(--text-muted)',
                      borderColor: activeCategory === cat ? 'var(--foreground)' : 'var(--hairline)',
                      boxShadow: activeCategory === cat ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div 
              ref={previewRef}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-on-scroll"
            >
              {initialTemplatesData
                .filter(t => activeCategory === 'All' || t.category === activeCategory)
                .map((template) => (
                  <div 
                    key={template.id}
                    className="relative rounded-xl border border-zinc-200 dark:border-zinc-800 bg-card text-card-foreground p-4 flex flex-col justify-between hover:shadow-[0_12px_24px_rgba(0,0,0,0.04)] transition-all duration-300 hover:border-brand-indigo/35"
                  >
                    <div>
                      <span className="text-[10px] font-mono text-zinc-500 bg-zinc-150 dark:bg-zinc-800 px-2 py-0.5 rounded mb-2 inline-block">
                        {template.category}
                      </span>
                      <h3 className="text-body-sm font-bold text-zinc-900 dark:text-white mb-1">{template.title}</h3>
                      <p className="text-[12px] text-zinc-500 dark:text-zinc-400 leading-normal line-clamp-2 mb-4">{template.description}</p>
                    </div>
                    <div className="flex justify-between items-center border-t border-zinc-100 dark:border-zinc-800 pt-3 text-[11px] font-mono text-zinc-450">
                      <span>★ {template.rating || '--'}</span>
                      <span>👥 {template.uses || template.downloads || '--'}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          /* Premium Empty State Layout (Default) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-16 md:mb-20">
            
            {/* Left Column: Heading, Copy, Filters */}
            <div ref={headerRef} className="lg:col-span-5 flex flex-col gap-5">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[12px] font-medium uppercase tracking-[0.16em] text-zinc-400">
                  Community Templates
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-brand-indigo/10 text-brand-indigo dark:bg-indigo-500/20 dark:text-indigo-300 border border-brand-indigo/20 dark:border-indigo-500/30">
                  Community Beta
                </span>
              </div>

              <h2 className="text-[clamp(32px,3.5vw,46px)] font-bold tracking-[-0.03em] leading-[1.1] text-zinc-950 dark:text-zinc-50">
                Stop starting from scratch.
              </h2>

              <p className="text-[15px] sm:text-[16px] text-zinc-550 dark:text-zinc-400 leading-relaxed font-normal">
                Discover reusable context systems created by the community. Publish your own templates, fork existing ones, and accelerate every new project. Community Marketplace launches soon.
              </p>

              {/* Category Filter Chips */}
              <div className="flex flex-wrap gap-2 mt-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className="h-8 px-4 rounded-full text-[12px] font-medium transition-all duration-200 border cursor-pointer select-none"
                    style={{
                      background: activeCategory === cat ? 'var(--foreground)' : 'transparent',
                      color: activeCategory === cat ? 'var(--background)' : 'var(--text-muted)',
                      borderColor: activeCategory === cat ? 'var(--foreground)' : 'var(--hairline)',
                      boxShadow: activeCategory === cat ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Preview Area Stack (Featured + Blurred Skeletons) */}
            <div 
              ref={previewRef} 
              className="lg:col-span-7 relative w-full h-[380px] sm:h-[450px] flex items-center justify-center select-none"
            >
              
              {/* Blurred Skeleton Card 1 (Left background) */}
              <div className="animate-on-scroll absolute left-2 sm:left-6 top-6 sm:top-10 w-[78%] sm:w-[320px] aspect-[4/3.2] rounded-xl border border-zinc-205 dark:border-zinc-800/40 bg-zinc-50/40 dark:bg-zinc-900/10 opacity-30 dark:opacity-10 blur-[1px] -rotate-6 transform origin-bottom-left pointer-events-none transition-all duration-500 hidden sm:flex flex-col p-4 animate-pulse">
                <div className="w-full h-[45%] bg-zinc-200/60 dark:bg-zinc-800/60 rounded-lg mb-4" />
                <div className="h-4 w-1/3 bg-zinc-200/60 dark:bg-zinc-800/60 rounded mb-2.5" />
                <div className="h-3 w-4/5 bg-zinc-150 dark:bg-zinc-850 rounded mb-1.5" />
                <div className="h-3 w-1/2 bg-zinc-150 dark:bg-zinc-850 rounded mb-4" />
                <div className="flex gap-2">
                  <div className="h-5 w-12 bg-zinc-200/50 dark:bg-zinc-800/50 rounded" />
                  <div className="h-5 w-16 bg-zinc-200/50 dark:bg-zinc-800/50 rounded" />
                </div>
              </div>

              {/* Blurred Skeleton Card 2 (Right background) */}
              <div className="animate-on-scroll absolute right-2 sm:right-6 bottom-6 sm:bottom-10 w-[78%] sm:w-[320px] aspect-[4/3.2] rounded-xl border border-zinc-205 dark:border-zinc-800/40 bg-zinc-50/40 dark:bg-zinc-900/10 opacity-35 dark:opacity-15 blur-[1px] rotate-6 transform origin-bottom-right pointer-events-none transition-all duration-500 hidden sm:flex flex-col p-4 animate-pulse">
                <div className="w-full h-[45%] bg-zinc-200/60 dark:bg-zinc-800/60 rounded-lg mb-4" />
                <div className="h-4 w-1/4 bg-zinc-200/60 dark:bg-zinc-800/60 rounded mb-2.5" />
                <div className="h-3 w-[85%] bg-zinc-150 dark:bg-zinc-850 rounded mb-1.5" />
                <div className="h-3 w-3/5 bg-zinc-150 dark:bg-zinc-850 rounded mb-4" />
                <div className="flex gap-2">
                  <div className="h-5 w-16 bg-zinc-200/50 dark:bg-zinc-800/50 rounded" />
                  <div className="h-5 w-10 bg-zinc-200/50 dark:bg-zinc-800/50 rounded" />
                </div>
              </div>

              {/* Featured Template Card (Center) */}
              <div 
                className="animate-on-scroll relative z-10 w-[88%] sm:w-[360px] rounded-xl border border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_20px_45px_rgba(0,0,0,0.35)] transition-all duration-300 overflow-hidden group/card hover:-translate-y-1 hover:border-brand-indigo/35 dark:hover:border-indigo-500/45 cursor-pointer"
              >
                
                {/* Abstract Illustration with Dynamic Gradients */}
                <div className="relative w-full h-[155px] bg-zinc-950 overflow-hidden flex items-center justify-center">
                  <div className={`absolute inset-0 bg-gradient-to-tr ${featuredData.gradient} opacity-85 transition-all duration-700`} />
                  <div className="absolute inset-0 bg-radial-[circle_at_50%_120%] from-brand-indigo/25 via-transparent to-transparent opacity-80" />

                  {/* Cyber Geometric shapes */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:16px_16px] opacity-70" />
                  <div className="absolute w-44 h-44 rounded-full border border-white/5 animate-spin-[spin_80s_linear_infinite]" />
                  <div className="absolute w-28 h-28 rounded-full border border-dashed border-white/10 animate-spin-[spin_30s_linear_infinite]" />

                  {/* Floating Centered Glassmorphic Icon */}
                  <div className="relative flex items-center justify-center transition-transform duration-500 group-hover/card:scale-105 group-hover/card:-translate-y-0.5">
                    <div className="w-14 h-14 rounded-lg border border-white/15 bg-white/5 backdrop-blur-md flex items-center justify-center shadow-2xl z-10">
                      <svg className="w-7 h-7 text-brand-indigo dark:text-indigo-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                      </svg>
                    </div>
                    <div className="absolute w-16 h-16 bg-brand-indigo/15 rounded-full blur-xl" />
                  </div>

                  {/* Creator tag */}
                  <div className="absolute top-3 right-3 z-15">
                    <span className="text-[9px] font-mono text-zinc-400 dark:text-zinc-500 bg-zinc-900/80 border border-white/5 px-2 py-0.5 rounded">
                      {featuredData.author}
                    </span>
                  </div>

                  {/* Category pill */}
                  <div className="absolute top-3 left-3 z-15">
                    <span className="text-[9px] font-semibold uppercase tracking-wider bg-white/10 dark:bg-white/5 text-white backdrop-blur-sm border border-white/10 px-2 py-0.5 rounded">
                      {featuredData.category}
                    </span>
                  </div>
                </div>

                {/* Content Card Body */}
                <div className="p-4 flex flex-col gap-3">
                  <div>
                    <div className="inline-flex items-center px-1.5 py-0.5 rounded bg-brand-indigo/10 text-brand-indigo dark:bg-brand-indigo/20 dark:text-indigo-355 text-[9px] font-bold tracking-wider uppercase mb-1.5">
                      Community Template
                    </div>
                    <h3 className="text-[15px] font-bold text-zinc-900 dark:text-white leading-snug transition-colors duration-200 group-hover/card:text-brand-indigo">
                      {featuredData.title}
                    </h3>
                  </div>

                  <p className="text-[12px] text-zinc-550 dark:text-zinc-400 leading-normal">
                    {featuredData.description}
                  </p>

                  {/* Dynamic tags */}
                  <div className="flex flex-wrap gap-1.5 mt-0.5">
                    {featuredData.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="text-[10px] font-mono font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-800 px-2 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Dynamic statistics placeholders */}
                  <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800/80 mt-1 text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">
                    <div className="flex items-center gap-1">
                      <svg className="w-3 h-3 text-amber-500 fill-amber-500" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span>{featuredData.rating} Ratings</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-3 h-3 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A11.386 11.386 0 0110.089 20c-2.213 0-4.302-.63-6.089-1.73v-.109c0-3.478 2.92-6.27 6.51-6.27 1.955 0 3.714.832 4.958 2.162M14 3.968a3.96 3.96 0 00-3-1.488 3.96 3.96 0 00-3 1.488M14 3.968a3.96 3.96 0 01-3 1.488 3.96 3.96 0 01-3-1.488" />
                      </svg>
                      <span>{featuredData.downloads} Downloads</span>
                    </div>
                    <div className="flex items-center gap-1 text-brand-indigo font-semibold">
                      <svg className="w-3 h-3 animate-bounce text-brand-indigo dark:text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.63 8.41a14.98 14.98 0 00-6.16 12.12 14.98 14.98 0 0012.12-6.16z" />
                      </svg>
                      <span>Coming Soon</span>
                    </div>
                  </div>

                  {/* Disabled launch button */}
                  <button
                    disabled
                    className="w-full mt-2 h-9 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/60 dark:border-zinc-800/60 text-zinc-400 dark:text-zinc-550 text-[11px] font-semibold cursor-not-allowed select-none transition-all"
                  >
                    Marketplace Launching Soon
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Every template includes section */}
        <div className="border border-zinc-200/70 dark:border-zinc-850 rounded-2xl p-6 md:p-8 mb-12 bg-zinc-50/40 dark:bg-zinc-900/10 backdrop-blur-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
            <div className="shrink-0 max-w-sm">
              <h4 className="text-[14px] font-semibold text-zinc-900 dark:text-white mb-1">
                Every template includes
              </h4>
              <p className="text-[12px] text-zinc-550 dark:text-zinc-400 leading-relaxed">
                Standardized context files generated to align downstream AI coding tools with your project structure, styling guidelines, and engineering roadmap.
              </p>
            </div>
            
            <div ref={includesRef} className="flex flex-wrap gap-2 md:justify-end max-w-2xl">
              {INCLUDES.map((item) => (
                <div 
                  key={item.label} 
                  className="relative group/chip cursor-help"
                >
                  <div 
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-850/80 text-[12px] font-medium text-zinc-700 dark:text-zinc-350 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:-translate-y-0.5 hover:border-brand-indigo/35 dark:hover:border-indigo-500/50 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all duration-200"
                  >
                    <svg className="w-3.5 h-3.5 text-brand-indigo/80 shrink-0 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <polyline points="20,6 9,17 4,12" />
                    </svg>
                    <span>{item.label}</span>
                  </div>
                  
                  {/* CSS Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 w-52 opacity-0 scale-95 pointer-events-none group-hover/chip:opacity-100 group-hover/chip:scale-100 group-hover/chip:pointer-events-auto transition-all duration-200 ease-out z-30">
                    <div className="bg-zinc-900 dark:bg-zinc-850 text-white text-[11px] leading-relaxed p-2.5 rounded-lg shadow-xl text-center relative border border-white/5 dark:border-zinc-800">
                      {item.tooltip}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-zinc-900 dark:bg-zinc-850 rotate-45 border-r border-b border-white/5 dark:border-zinc-800" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-zinc-100 dark:border-zinc-900 pt-10">
          <div>
            <div className="text-[15px] sm:text-[16px] font-semibold text-zinc-900 dark:text-white mb-1">
              Want to share yours?
            </div>
            <div className="text-[13px] text-zinc-550 dark:text-zinc-400">
              Publish your own template and help the community build better software.
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <RollingButton
              href="/dashboard/community"
              text="Browse Marketplace"
              className="h-10 px-6 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
            />
            <RollingButton
              href="/signup"
              text="Publish Template"
              className="h-10 px-6 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-sm"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
