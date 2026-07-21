import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Monitor, Tablet, Smartphone, Lock, CheckCircle2, RotateCw, ExternalLink } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useAuth } from '@/features/auth/hooks/useAuth'

// Match the list of templates from CommunityTemplates
const TEMPLATE_MAP = {
  'ai-startup': {
    title: 'AI Startup Landing Page',
    description: 'High-fidelity dark mode space-glowing SaaS landing page with bento grids, animated text reveals, pricing sliders, and FAQs.',
    author: '@aryan',
    rating: 4.9,
    uses: 2100,
    category: 'SaaS',
    tags: ['Tailwind', 'GSAP', 'HTML'],
    src: '/templates/ai-startup.html',
    accent: '#10b981',
    accentBg: 'rgba(16,185,129,0.08)',
  },
  'portfolio': {
    title: 'Developer Portfolio',
    description: 'Elegant warm-sand editorial portfolio showcasing filtered projects, typography scale systems, and newsletter signups.',
    author: '@john',
    rating: 4.8,
    uses: 1600,
    category: 'Portfolio',
    tags: ['Playfair', 'Editorial', 'Scale Systems'],
    src: '/templates/portfolio.html',
    accent: '#8b5cf6',
    accentBg: 'rgba(139,92,246,0.08)',
  },
  'design-agency': {
    title: 'Creative Design Agency',
    description: 'Bold black/neon-red design studio page featuring huge typographic contrasts, micro-interactions, and capability grids.',
    author: '@alex',
    rating: 4.9,
    uses: 980,
    category: 'Agency',
    tags: ['Typography', 'Awwwards', 'Grid System'],
    src: '/templates/design-agency.html',
    accent: '#ff003c',
    accentBg: 'rgba(255,0,60,0.08)',
  },
  'saas-board': {
    title: 'B2B SaaS Kanban Board',
    description: 'Vercel/Linear style project task board showing column flows, analytical charts, and active settings preferences.',
    author: '@emma',
    rating: 4.7,
    uses: 720,
    category: 'SaaS',
    tags: ['Kanban Board', 'Analytics', 'Settings Sheet'],
    src: '/templates/saas-board.html',
    accent: '#09090b',
    accentBg: 'rgba(0,0,0,0.05)',
  },
  'editorial-blog': {
    title: 'Minimalist Editorial Blog',
    description: 'Prose publication with reading font size controls, clean measure lines, category filters, and active newsletter blocks.',
    author: '@priya',
    rating: 4.8,
    uses: 1240,
    category: 'Blog',
    tags: ['Prose Reading', 'Size Toggles', 'Newsletter'],
    src: '/templates/editorial-blog.html',
    accent: '#ea580c',
    accentBg: 'rgba(234,88,12,0.07)',
  },
  'smart-home': {
    title: 'Mobile Smart Home App',
    description: 'Interactive smart home IoT mobile dashboard inside a phone mockup containing active toggles and AC sliders.',
    author: '@kai',
    rating: 4.9,
    uses: 860,
    category: 'Mobile',
    tags: ['Smart IoT', 'Mobile Preview', 'Active Slider'],
    src: '/templates/smart-home.html',
    accent: '#f59e0b',
    accentBg: 'rgba(245,158,11,0.08)',
  },
}

export default function TemplateDetailPage() {
  const { templateId } = useParams()
  const navigate = useNavigate()
  const isAuthenticated = true // Design specifications unlocked for all visitors
  const iframeRef = useRef(null)

  const template = TEMPLATE_MAP[templateId]

  const [viewMode, setViewMode] = useState('desktop') // 'desktop' | 'tablet' | 'mobile'
  const [activeTab, setActiveTab] = useState('details') // 'details' | 'design'
  const [markdown, setMarkdown] = useState('')
  const [loadingMarkdown, setLoadingMarkdown] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  // Redirect to 404 if template not found
  useEffect(() => {
    if (!template) {
      navigate('/404', { replace: true })
    }
  }, [template, navigate])

  // Fetch DESIGN.md if authenticated and user opens the design system tab
  useEffect(() => {
    if (template && isAuthenticated && activeTab === 'design' && !markdown) {
      setLoadingMarkdown(true)
      fetch(`/templates/design/${templateId}.md`)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to load design specification.')
          return res.text()
        })
        .then((text) => {
          setMarkdown(text)
        })
        .catch((err) => {
          console.error(err)
          setMarkdown('# Error\nFailed to load design specification.')
        })
        .finally(() => {
          setLoadingMarkdown(false)
        })
    }
  }, [templateId, isAuthenticated, activeTab, template, markdown])

  if (!template) return null

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(markdown)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const handleReload = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      {/* Upper Navigation Header */}
      <header className="h-14 border-b border-zinc-800/80 bg-zinc-900/60 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-30 sticky top-0">
        <div className="flex items-center gap-4">
          <Link
            to="/#templates"
            className="w-8 h-8 rounded-full border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 flex items-center justify-center transition-colors text-zinc-400 hover:text-zinc-100"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="h-4 w-px bg-zinc-800"></div>
          <div className="flex items-center gap-2 text-[13px] font-medium text-zinc-400">
            <span>Templates</span>
            <span>/</span>
            <span className="text-zinc-100">{template.title}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-zinc-500 bg-zinc-900 border border-zinc-800/80 px-2.5 py-1 rounded-md">
            zenix --template {templateId}
          </span>
          <button
            onClick={() => alert('Starting your workspace initialization...')}
            className="h-8 px-4 rounded-full text-[12px] font-semibold text-white transition-transform active:scale-95 shadow-lg hover:shadow-indigo-500/10"
            style={{
              background: template.accent,
            }}
          >
            Use Template
          </button>
        </div>
      </header>

      {/* Main Workspace split */}
      <div className="flex-1 flex min-h-0 relative">
        {/* Left Side: Interactive Preview Sandbox */}
        <div className="flex-1 bg-zinc-900 flex flex-col min-w-0">
          {/* Sandbox Top Control Bar */}
          <div className="h-11 border-b border-zinc-800/60 bg-zinc-900/80 flex items-center justify-between px-4 shrink-0">
            {/* View Mode controls */}
            <div className="flex items-center bg-zinc-950 border border-zinc-800 p-0.5 rounded-lg">
              <button
                onClick={() => setViewMode('desktop')}
                className={`h-7 px-3 rounded-md flex items-center gap-1.5 text-[11px] font-medium transition-all ${
                  viewMode === 'desktop' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                Desktop
              </button>
              <button
                onClick={() => setViewMode('tablet')}
                className={`h-7 px-3 rounded-md flex items-center gap-1.5 text-[11px] font-medium transition-all ${
                  viewMode === 'tablet' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Tablet className="w-3.5 h-3.5" />
                Tablet
              </button>
              <button
                onClick={() => setViewMode('mobile')}
                className={`h-7 px-3 rounded-md flex items-center gap-1.5 text-[11px] font-medium transition-all ${
                  viewMode === 'mobile' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                Mobile
              </button>
            </div>

            {/* Address Simulator + Reload */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 h-7 px-3 rounded-md bg-zinc-950 border border-zinc-800/60 text-[10px] font-mono text-zinc-500 max-w-[280px] overflow-hidden truncate select-all">
                <span>https://zenix-dev.run{template.src}</span>
              </div>
              <button
                onClick={handleReload}
                className="w-7 h-7 rounded-md border border-zinc-800/80 bg-zinc-950 hover:bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-zinc-100 transition-colors"
                title="Reload preview"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Canvas Wrapper */}
          <div className="flex-1 p-6 flex justify-center items-center overflow-auto bg-[radial-gradient(#1f1f2e_1px,transparent_1px)] [background-size:16px_16px]">
            <div
              className="bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300 relative border border-zinc-800/60"
              style={{
                width: viewMode === 'desktop' ? '100%' : viewMode === 'tablet' ? '768px' : '375px',
                height: '100%',
                maxWidth: '100%',
              }}
            >
              <iframe
                ref={iframeRef}
                src={template.src}
                title={template.title}
                className="w-full h-full border-none bg-white"
              />
            </div>
          </div>
        </div>

        {/* Right Side: Sidebar Tabs & Details */}
        <div className="w-[360px] border-l border-zinc-800 bg-zinc-950 flex flex-col shrink-0 min-h-0">
          {/* Tab bar header */}
          <div className="flex border-b border-zinc-800/80 h-11 shrink-0 bg-zinc-900/20">
            <button
              onClick={() => setActiveTab('details')}
              className={`flex-1 text-[12px] font-semibold border-b-2 transition-all ${
                activeTab === 'details'
                  ? 'border-zinc-100 text-zinc-100 bg-zinc-900/10'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab('design')}
              className={`flex-1 text-[12px] font-semibold border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'design'
                  ? 'border-zinc-100 text-zinc-100 bg-zinc-900/10'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {!isAuthenticated && <Lock className="w-3 h-3 text-zinc-600" />}
              Design System
            </button>
          </div>

          {/* Tab Scroll Content */}
          <div className="flex-1 overflow-y-auto p-5 min-h-0">
            {activeTab === 'details' ? (
              <div className="space-y-6">
                <div>
                  <span
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold mb-3"
                    style={{ background: template.accentBg, color: template.accent }}
                  >
                    {template.category}
                  </span>
                  <h1 className="text-xl font-bold text-zinc-100 leading-tight mb-1">{template.title}</h1>
                  <p className="text-[12px] text-zinc-500 font-mono">Published by {template.author}</p>
                </div>

                <div className="flex items-center gap-6 py-3 border-y border-zinc-900">
                  <div>
                    <div className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 mb-0.5">Rating</div>
                    <div className="flex items-center gap-1">
                      <span className="text-[14px] font-bold text-zinc-200">{template.rating}</span>
                      <span className="text-[11px] text-zinc-500">★</span>
                    </div>
                  </div>
                  <div className="w-px h-8 bg-zinc-800"></div>
                  <div>
                    <div className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 mb-0.5">Community Use</div>
                    <div className="text-[14px] font-bold text-zinc-200">{template.uses} deployments</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-[11px] uppercase tracking-wider font-bold text-zinc-500 mb-2">Description</h3>
                  <p className="text-[13px] text-zinc-400 leading-relaxed font-normal">{template.description}</p>
                </div>

                <div>
                  <h3 className="text-[11px] uppercase tracking-wider font-bold text-zinc-500 mb-2">Included Resources</h3>
                  <div className="grid grid-cols-2 gap-2 text-[12px] text-zinc-400">
                    <div className="flex items-center gap-2 bg-zinc-900/60 p-2 rounded-lg border border-zinc-800/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-600"></span>
                      <span>AGENTS.md</span>
                    </div>
                    <div className="flex items-center gap-2 bg-zinc-900/60 p-2 rounded-lg border border-zinc-800/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-600"></span>
                      <span>DESIGN.md</span>
                    </div>
                    <div className="flex items-center gap-2 bg-zinc-900/60 p-2 rounded-lg border border-zinc-800/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-600"></span>
                      <span>Task Breakdown</span>
                    </div>
                    <div className="flex items-center gap-2 bg-zinc-900/60 p-2 rounded-lg border border-zinc-800/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-600"></span>
                      <span>Architecture Spec</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-[11px] uppercase tracking-wider font-bold text-zinc-500 mb-2.5">Metadata Tags</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {template.tags.map((tag) => (
                      <span key={tag} className="text-[11px] font-medium text-zinc-400 bg-zinc-900 border border-zinc-800/60 px-2.5 py-1 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Design system tab */
              <div className="h-full">
                {isAuthenticated ? (
                  /* Authenticated Design System Markdown view */
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">DESIGN.md spec</span>
                      <button
                        onClick={handleCopyMarkdown}
                        className="text-[11px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1 bg-zinc-900 px-2.5 py-1 rounded border border-zinc-800 transition-colors"
                      >
                        {isCopied ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            Copied
                          </>
                        ) : (
                          'Copy Raw'
                        )}
                      </button>
                    </div>

                    {loadingMarkdown ? (
                      <div className="flex flex-col items-center justify-center py-20 text-zinc-500 text-[12px] gap-2">
                        <RotateCw className="w-5 h-5 animate-spin text-zinc-600" />
                        <span>Loading specifications...</span>
                      </div>
                    ) : (
                      <article className="prose prose-invert prose-sm text-zinc-300 font-sans max-w-none text-[12.5px] leading-relaxed space-y-4">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
                      </article>
                    )}
                  </div>
                ) : (
                  /* Locked screen when not logged in */
                  <div className="flex flex-col items-center justify-center text-center py-12 px-2 h-full">
                    {/* Glowing lock sphere */}
                    <div className="relative w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6 shadow-inner">
                      <div className="absolute inset-0 rounded-full bg-indigo-500/5 blur-xl"></div>
                      <Lock className="w-6 h-6 text-indigo-400" />
                    </div>

                    <h2 className="text-sm font-bold text-zinc-100 mb-2">Design System Locked</h2>
                    <p className="text-[12.5px] text-zinc-400 leading-relaxed font-normal mb-6 max-w-xs">
                      Zenix templates provide professional context templates with full visual rules, spacing systems, token guides, and typography setups.
                      <span className="block mt-2 text-zinc-500">Sign in to your Zenix Workspace to unlock this file.</span>
                    </p>

                    <Link
                      to={`/login?redirect=/templates/${templateId}`}
                      className="w-full h-9 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-bold text-[12px] flex items-center justify-center transition-all shadow-lg active:scale-95"
                    >
                      Sign In to Unlock
                    </Link>

                    <div className="mt-8 pt-6 border-t border-zinc-900 w-full text-left text-[11px] text-zinc-500 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                        <span>View complete design tokens</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                        <span>Copy full colors, margins, and typographies</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-zinc-700"></span>
                        <span>Direct export to code implementation</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
