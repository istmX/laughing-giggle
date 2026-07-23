import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Sparkles, Lock, FileText, GitFork, UploadCloud, FileCode } from 'lucide-react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { getProject } from '../api/projects.api'
import toast from 'react-hot-toast'

export function NewProjectPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()
  
  const [project, setProject] = useState(null)
  const [isPageLoading, setIsPageLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const checkProjectStatus = async () => {
      try {
        const res = await getProject(token, projectId)
        const proj = res.data
        if (proj && isMounted) {
          if (proj.wizard_state && proj.wizard_state.ideaId) {
            navigate(`/projects/${projectId}/chat`, { replace: true })
            return
          }
          setProject(proj)
        }
      } catch (err) {
        console.error('Failed to fetch project status', err)
        toast.error('Could not load project information')
      } finally {
        if (isMounted) setIsPageLoading(false)
      }
    }
    
    if (token && projectId) {
      checkProjectStatus()
    }
    return () => { isMounted = false }
  }, [token, projectId, navigate])

  const handleStartChat = () => {
    navigate(`/projects/${projectId}/chat`)
  }

  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-ink flex items-center justify-center animate-pulse">
            <Sparkles className="h-4 w-4 text-canvas" />
          </div>
          <span className="text-xs text-ink-muted font-mono animate-pulse">Initializing cockpit…</span>
        </div>
      </div>
    )
  }

  const cards = [
    {
      id: 'chat',
      title: 'Chat with Zenix AI',
      desc: 'Describe your idea and run an interactive requirements session to compile your workspace context.',
      icon: Sparkles,
      active: true,
      onClick: handleStartChat,
      accent: 'border-brand-indigo/35 hover:border-brand-indigo shadow-md',
      iconBg: 'bg-brand-indigo/10 text-brand-indigo'
    },
    {
      id: 'github',
      title: 'Import from GitHub',
      desc: 'Connect your repository directly. Zenix will scan your codebase to align context and architecture.',
      icon: GitFork,
      active: false,
      comingSoon: true,
      iconBg: 'bg-surface-soft text-ink-muted'
    },
    {
      id: 'upload',
      title: 'Upload Specification',
      desc: 'Upload a PRD, text spec, or markdown notes to compile them into standard developer context files.',
      icon: UploadCloud,
      active: false,
      comingSoon: true,
      iconBg: 'bg-surface-soft text-ink-muted'
    },
    {
      id: 'templates',
      title: 'Choose a Template',
      desc: 'Start from pre-configured template files (SaaS, Mobile App, IoT Hub, Admin Board) with default tokens.',
      icon: FileCode,
      active: false,
      comingSoon: true,
      iconBg: 'bg-surface-soft text-ink-muted'
    }
  ]

  const blueprints = [
    { file: 'agents.md', desc: 'Agent guidelines, rules & build phases' },
    { file: 'design.md', desc: 'Design tokens, layout & variables' },
    { file: 'architecture.md', desc: 'Folder structure & storage layers' },
    { file: 'project-overview.md', desc: 'Project vision, journeys & inventory' }
  ]

  return (
    <div className="min-h-[100dvh] bg-background dashboard-bg flex flex-col p-6 overflow-y-auto relative selection:bg-ink selection:text-canvas" data-lenis-prevent="true">
      <header className="fixed top-6 left-6 z-50">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-ink-muted hover:text-ink text-[13px] font-[var(--font-weight-480)] transition-colors bg-canvas/80 backdrop-blur-md py-2 px-4 rounded-full border border-hairline shadow-sm">
          <ArrowLeft className="h-[13px] w-[13px]" />
          Dashboard
        </Link>
      </header>

      <div className="w-full max-w-7xl mx-auto pt-24 pb-32 px-4 sm:px-0 flex flex-col lg:flex-row gap-10">
        
        {/* Main Content (Left Grid) */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="border-b border-hairline pb-6">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft">WORKSPACE INITIALIZATION</span>
            <h1 className="mt-2 text-[32px] md:text-[40px] font-[var(--font-weight-540)] tracking-[-0.04em] text-ink">Choose setup source</h1>
            <p className="mt-2 text-[14px] text-ink-muted leading-relaxed max-w-xl">
              Select how you want to build and structure this project's developer context. Click <strong className="font-[var(--font-weight-540)] text-ink">Chat with Zenix AI</strong> to begin drafting your project.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 mt-2">
            {cards.map((card) => {
              const Icon = card.icon
              return (
                <div
                  key={card.id}
                  onClick={card.active ? card.onClick : undefined}
                  className={`relative rounded-[var(--radius-lg)] border p-6 flex flex-col justify-between min-h-[180px] select-none transition-all duration-200 ${
                    card.active
                      ? `bg-canvas cursor-pointer hover:-translate-y-0.5 ${card.accent}`
                      : 'bg-surface-soft border-hairline/60 opacity-60 cursor-not-allowed'
                  }`}
                >
                  {card.comingSoon && (
                    <span className="absolute top-4 right-4 font-mono text-[9px] uppercase tracking-wider bg-canvas border border-hairline px-2.5 py-0.5 rounded text-ink-muted">
                      Coming Soon
                    </span>
                  )}

                  <div className="flex flex-col gap-4">
                    <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${card.iconBg}`}>
                      <Icon className="h-4.5 w-4.5" />
                    </div>

                    <div>
                      <h4 className="text-[15px] font-[var(--font-weight-540)] text-ink tracking-tight">{card.title}</h4>
                      <p className="mt-2 text-[12.5px] text-ink-muted leading-relaxed font-normal">{card.desc}</p>
                    </div>
                  </div>

                  {card.active && (
                    <div className="mt-4 flex items-center gap-1.5 text-[12.5px] font-medium text-brand-indigo group">
                      <span>Start Workspace Chat</span>
                      <span className="transition-transform group-hover:translate-x-0.5">→</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Blueprint Locked Checklist (Right Sidebar) */}
        <div className="w-full lg:w-[340px] shrink-0">
          <div className="rounded-[var(--radius-lg)] border border-hairline bg-surface-soft p-5">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="h-4 w-4 text-ink-muted" strokeWidth={1.8} />
              <h5 className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">Context Blueprints</h5>
            </div>

            <div className="flex flex-col gap-2.5">
              {blueprints.map((bp) => (
                <div key={bp.file} className="flex items-start gap-3 p-3 rounded-[var(--radius-md)] bg-canvas/40 border border-hairline/45">
                  <div className="h-7 w-7 rounded bg-surface-soft flex items-center justify-center shrink-0 mt-0.5 border border-hairline/20">
                    <FileText className="h-4 w-4 text-ink-muted" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[12.5px] font-medium text-ink-muted/80 block font-mono">{bp.file}</span>
                    <span className="text-[11.5px] text-ink-muted/65 leading-normal block mt-0.5">{bp.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-4 text-[12px] text-ink-muted/60 leading-relaxed font-normal">
              No artifacts have been generated for this project yet. Start chatting with Zenix AI to unlock these context files.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
