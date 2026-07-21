import { useRef, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RollingButton } from '@/components/ui/RollingButton';

gsap.registerPlugin(ScrollTrigger);

/* ── Template data ── */
const TEMPLATES = [
  {
    id: 'ai-startup',
    title: 'AI Startup Landing Page',
    description: 'High-fidelity dark mode space-glowing SaaS landing page with bento grids, animated text reveals, pricing sliders, and FAQs.',
    author: '@aryan',
    rating: 4.9,
    uses: 2100,
    category: 'SaaS',
    tags: ['Tailwind', 'GSAP', 'HTML'],
    src: '/templates/ai-startup.html',
    cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop',
    accent: '#10b981',
    accentBg: 'rgba(16,185,129,0.08)',
  },
  {
    id: 'portfolio',
    title: 'Developer Portfolio',
    description: 'Elegant warm-sand editorial portfolio showcasing filtered projects, typography scale systems, and newsletter signups.',
    author: '@john',
    rating: 4.8,
    uses: 1600,
    category: 'Portfolio',
    tags: ['Playfair', 'Editorial', 'Scale Systems'],
    src: '/templates/portfolio.html',
    cover: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=400&auto=format&fit=crop',
    accent: '#8b5cf6',
    accentBg: 'rgba(139,92,246,0.08)',
  },
  {
    id: 'design-agency',
    title: 'Creative Design Agency',
    description: 'Bold black/neon-red design studio page featuring huge typographic contrasts, micro-interactions, and capability grids.',
    author: '@alex',
    rating: 4.9,
    uses: 980,
    category: 'Agency',
    tags: ['Typography', 'Awwwards', 'Grid System'],
    src: '/templates/design-agency.html',
    cover: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=400&auto=format&fit=crop',
    accent: '#ff003c',
    accentBg: 'rgba(255,0,60,0.08)',
  },
  {
    id: 'saas-board',
    title: 'B2B SaaS Kanban Board',
    description: 'Vercel/Linear style project task board showing column flows, analytical charts, and active settings preferences.',
    author: '@emma',
    rating: 4.7,
    uses: 720,
    category: 'SaaS',
    tags: ['Kanban Board', 'Analytics', 'Settings Sheet'],
    src: '/templates/saas-board.html',
    cover: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=400&auto=format&fit=crop',
    accent: '#09090b',
    accentBg: 'rgba(0,0,0,0.05)',
  },
  {
    id: 'editorial-blog',
    title: 'Minimalist Editorial Blog',
    description: 'Prose publication with reading font size controls, clean measure lines, category filters, and active newsletter blocks.',
    author: '@priya',
    rating: 4.8,
    uses: 1240,
    category: 'Blog',
    tags: ['Prose Reading', 'Size Toggles', 'Newsletter'],
    src: '/templates/editorial-blog.html',
    cover: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=400&auto=format&fit=crop',
    accent: '#ea580c',
    accentBg: 'rgba(234,88,12,0.07)',
  },
  {
    id: 'smart-home',
    title: 'Mobile Smart Home App',
    description: 'Interactive smart home IoT mobile dashboard inside a phone mockup containing active toggles and AC sliders.',
    author: '@kai',
    rating: 4.9,
    uses: 860,
    category: 'Mobile',
    tags: ['Smart IoT', 'Mobile Preview', 'Active Slider'],
    src: '/templates/smart-home.html',
    cover: 'https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=400&auto=format&fit=crop',
    accent: '#f59e0b',
    accentBg: 'rgba(245,158,11,0.08)',
  },
];

const CATEGORIES = ['All', 'SaaS', 'Portfolio', 'Agency', 'Blog', 'Mobile'];

const INCLUDES = [
  { label: 'Project Architecture' },
  { label: 'AGENTS.md' },
  { label: 'DESIGN.md' },
  { label: 'UI Tokens' },
  { label: 'Task Breakdown' },
  { label: 'Documentation' },
  { label: 'AI Instructions' },
  { label: 'Best Practices' },
];

/* ── Star rating ── */
function Stars({ rating }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="10" height="10" viewBox="0 0 24 24" fill={i <= Math.round(rating) ? '#fbbf24' : 'none'} stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
        </svg>
      ))}
      <span className="ml-1 text-[11px] font-mono font-medium text-zinc-500">{rating}</span>
    </span>
  );
}

/* ── Template Card ── */
function TemplateCard({ template, onPreview }) {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const formatUses = (n) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`;

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="template-card group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200/60 dark:border-zinc-800/65 bg-white dark:bg-zinc-900 shadow-[0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-none transition-all duration-300"
      style={{
        boxShadow: isHovered
          ? `0 16px 48px rgba(0,0,0,0.10), 0 0 0 1px ${template.accent}30`
          : '0 2px 8px rgba(0,0,0,0.04)',
        transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
      }}
    >
      {/* Preview cover image */}
      <div className="relative overflow-hidden bg-zinc-100 dark:bg-zinc-800 h-[220px]">
        <img
          src={template.cover}
          alt={template.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
        />

        {/* Gradient overlay at bottom */}
        <div
          className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.95))' }}
        />

        {/* Category badge */}
        <div className="absolute top-3 left-3 z-10">
          <span
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold"
            style={{ background: template.accentBg, color: template.accent }}
          >
            {template.category}
          </span>
        </div>

        {/* Preview button on hover */}
        <div
          className="absolute inset-x-0 bottom-0 p-3 z-10 flex justify-center transition-all duration-200"
          style={{ opacity: isHovered ? 1 : 0, transform: isHovered ? 'translateY(0)' : 'translateY(4px)' }}
        >
          <button
            onClick={() => onPreview(template)}
            className="inline-flex items-center gap-1.5 h-8 px-4 rounded-full bg-zinc-950 text-white text-[11px] font-semibold shadow-lg transition-all hover:bg-zinc-800 active:scale-95"
            style={{ pointerEvents: 'auto' }}
          >
            <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            Preview
          </button>
        </div>
      </div>

      {/* Card Footer */}
      <div className="flex flex-col gap-2 p-4">
        {/* Title + author */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-[14px] font-semibold text-zinc-900 dark:text-white leading-tight mb-0.5">{template.title}</h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">{template.author}</p>
          </div>
          <Stars rating={template.rating} />
        </div>

        {/* Description */}
        <p className="text-[12px] text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">{template.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {template.tags.map((tag) => (
            <span key={tag} className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
              {tag}
            </span>
          ))}
        </div>

        {/* Uses + CTA */}
        <div className="flex items-center justify-between pt-1 border-t border-zinc-100 dark:border-zinc-800 mt-1">
          <span className="text-[11px] text-zinc-400 font-mono flex items-center gap-1">
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="opacity-60">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            {formatUses(template.uses)} uses
          </span>
          <button
            onClick={() => onPreview(template)}
            className="inline-flex items-center gap-1 h-7 px-3 rounded-full text-[11px] font-semibold text-white transition-all active:scale-95"
            style={{ background: template.accent, boxShadow: `0 2px 10px ${template.accent}40` }}
          >
            Use Template →
          </button>
        </div>
      </div>
    </div>
  );
}



/* ── Main section ── */
export default function CommunityTemplates() {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const gridRef = useRef(null);
  const includesRef = useRef(null);

  const [activeCategory, setActiveCategory] = useState('All');

  const filteredTemplates = activeCategory === 'All'
    ? TEMPLATES
    : TEMPLATES.filter((t) => t.category === activeCategory);

  // GSAP entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current.children, {
        y: 32,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: headerRef.current,
          start: 'top 85%',
        },
      });

      gsap.from(gridRef.current.children, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 80%',
        },
      });

      gsap.from(includesRef.current.children, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.05,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: includesRef.current,
          start: 'top 85%',
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handlePreview = useCallback((template) => {
    navigate(`/templates/${template.id}`);
  }, [navigate]);

  return (
    <>
      <section
        ref={sectionRef}
        className="landing-section relative z-10 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 border-t border-zinc-200/70 dark:border-zinc-800/70 transition-colors duration-300"
      >
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8">

          {/* Header */}
          <div ref={headerRef} className="flex flex-col gap-4 mb-10">
            <span className="font-mono text-[13px] font-medium uppercase tracking-[0.16em] text-zinc-400">
              Community Templates
            </span>
            <h2 className="text-[clamp(36px,4vw,52px)] font-semibold tracking-[-0.03em] leading-[1.06] text-zinc-950 max-w-2xl">
              Stop starting from scratch.
            </h2>
            <p className="text-[17px] text-zinc-500 max-w-xl leading-relaxed font-normal">
              Clone production-ready context templates created by the community, customize them, or publish your own for others to build on.
            </p>

            {/* Category filter pills */}
            <div className="flex flex-wrap gap-2 mt-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="h-8 px-4 rounded-full text-[12px] font-medium transition-all duration-200 border"
                  style={{
                    background: activeCategory === cat ? '#09090b' : 'transparent',
                    color: activeCategory === cat ? '#fff' : '#71717a',
                    borderColor: activeCategory === cat ? '#09090b' : '#e4e4e7',
                    boxShadow: activeCategory === cat ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Trending label */}
          <div className="flex items-center gap-2 mb-5">
            <span className="text-[13px] font-semibold text-zinc-900 flex items-center gap-1.5">
              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-zinc-600">
                <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
              </svg>
              Trending
            </span>
            <div className="h-px flex-1 bg-zinc-100"></div>
          </div>

          {/* Template Grid */}
          <div
            ref={gridRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16"
          >
            {filteredTemplates.map((template, index) => (
              <TemplateCard
                key={template.id}
                template={template}
                onPreview={handlePreview}
                index={index}
              />
            ))}
          </div>

          {/* Every template includes */}
          <div className="border border-zinc-200/60 dark:border-zinc-800/65 rounded-2xl p-8 mb-12 bg-zinc-50/50 dark:bg-zinc-900/50">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="shrink-0">
                <div className="text-[13px] font-semibold text-zinc-900 dark:text-white mb-1">Every template includes</div>
                <div className="text-[12px] text-zinc-500 dark:text-zinc-400">All the context files Zenix needs to understand your project.</div>
              </div>
              <div ref={includesRef} className="flex flex-wrap gap-2 sm:ml-auto">
                {INCLUDES.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 text-[12px] font-medium text-zinc-700 dark:text-zinc-300 shadow-sm"
                  >
                    <svg className="w-3.5 h-3.5 text-zinc-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <polyline points="20,6 9,17 4,12" />
                    </svg>
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-zinc-100 dark:border-zinc-900 pt-10">
            <div>
              <div className="text-[16px] font-semibold text-zinc-900 dark:text-white mb-1">Want to share yours?</div>
              <div className="text-[13px] text-zinc-500 dark:text-zinc-400">Publish your own template and help the community build better software.</div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <RollingButton
                href="/dashboard/community"
                text="Browse Marketplace"
                className="h-10 px-6 border border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
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


    </>
  );
}
