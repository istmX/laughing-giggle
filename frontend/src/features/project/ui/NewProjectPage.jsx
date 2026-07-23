import { useState, useEffect, useCallback, useRef } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Sparkles, Edit2 } from 'lucide-react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { updateProject, getProject } from '../api/projects.api'
import { OnboardingOptions } from './components/OnboardingOptions'
import { ProjectSettingsPanel } from './components/ProjectSettingsPanel'
import { BlueprintsStatus } from './components/BlueprintsStatus'
import toast from 'react-hot-toast'

export function NewProjectPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()
  
  const [project, setProject] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [settings, setSettings] = useState({ platform: 'web', techStack: [], designStyle: 'minimalist' })
  const [isPageLoading, setIsPageLoading] = useState(true)
  const saveTimeoutRef = useRef(null)

  // Fetch project on mount
  useEffect(() => {
    let isMounted = true
    const checkProjectStatus = async () => {
      try {
        const res = await getProject(token, projectId)
        const proj = res.data
        if (proj && isMounted) {
          // If ideaId already exists, redirect to chat sandbox directly
          if (proj.wizard_state && proj.wizard_state.ideaId) {
            navigate(`/projects/${projectId}/chat`, { replace: true })
            return
          }
          
          setProject(proj)
          setTitle(proj.project_title || '')
          setDescription(proj.project_description || '')
          if (proj.wizard_state?.settings) {
            setSettings(proj.wizard_state.settings)
          }
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

  const saveChanges = useCallback(async (updatedFields) => {
    try {
      await updateProject(token, projectId, updatedFields)
    } catch (err) {
      console.error('Failed to auto-save project changes', err)
    }
  }, [token, projectId])

  const queueSave = useCallback((updatedFields) => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    saveTimeoutRef.current = setTimeout(() => {
      saveChanges(updatedFields)
    }, 800)
  }, [saveChanges])

  const handleTitleChange = (val) => {
    setTitle(val)
    const ws = project?.wizard_state || {}
    queueSave({ project_title: val, wizard_state: { ...ws, settings } })
  }

  const handleDescriptionChange = (val) => {
    setDescription(val)
    const ws = project?.wizard_state || {}
    queueSave({ project_description: val, wizard_state: { ...ws, settings } })
  }

  const handleSettingsChange = (newSettings) => {
    setSettings(newSettings)
    const ws = project?.wizard_state || {}
    // Also trigger save immediately for settings click
    saveChanges({ wizard_state: { ...ws, settings: newSettings } })
  }

  const handleSelectChat = async () => {
    // Flush any pending saves
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }
    try {
      const ws = project?.wizard_state || {}
      await saveChanges({
        project_title: title.trim() || 'Untitled Project',
        project_description: description.trim(),
        wizard_state: { ...ws, settings }
      })
      navigate(`/projects/${projectId}/chat`)
    } catch (err) {
      console.error(err)
      toast.error('Failed to setup chat workspace')
    }
  }

  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-ink flex items-center justify-center animate-pulse">
            <Sparkles className="h-4 w-4 text-canvas" />
          </div>
          <span className="text-xs text-ink-muted font-mono">Initializing project cockpit…</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[100dvh] bg-canvas flex flex-col p-6 overflow-y-auto relative selection:bg-ink selection:text-canvas">
      {/* Top Floating Header */}
      <header className="fixed top-6 left-6 z-50">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-ink-muted hover:text-ink text-[14px] font-[540] transition-colors bg-canvas/80 backdrop-blur-md py-2.5 px-5 rounded-full border border-hairline shadow-sm">
          <ArrowLeft className="h-[14px] w-[14px]" />
          Dashboard
        </Link>
      </header>

      {/* Cockpit Shell */}
      <div className="w-full max-w-7xl mx-auto pt-24 pb-32 px-4 sm:px-0 flex flex-col lg:flex-row gap-12">
        
        {/* Main Configuration Panel (Left) */}
        <div className="flex-1 flex flex-col gap-10">
          
          {/* Project Title and Identity */}
          <div className="flex flex-col gap-4 border-b border-hairline pb-8">
            <div className="flex items-center gap-3 group">
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Untitled Project"
                className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-[var(--font-weight-340)] tracking-[-0.04em] text-ink bg-transparent outline-none w-full border-b border-transparent focus:border-hairline/60 py-1"
              />
              <Edit2 className="h-4.5 w-4.5 text-ink-muted/30 group-hover:text-ink-muted/80 transition-colors pointer-events-none" />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted">Project Description</label>
              <textarea
                value={description}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                placeholder="Describe your idea, target audience, and key functionalities here. This will serve as context for the Zenix compiler."
                className="w-full min-h-[120px] text-[15px] leading-relaxed text-ink placeholder:text-ink-muted/30 bg-surface-soft border border-hairline rounded-2xl p-4 outline-none resize-none focus:bg-canvas focus:border-ink/25 transition-all"
              />
            </div>
          </div>

          {/* Onboarding Options Grid */}
          <div className="flex flex-col gap-5">
            <div>
              <h3 className="text-[20px] font-[var(--font-weight-540)] tracking-tight text-ink">Choose a Setup Source</h3>
              <p className="text-[13.5px] text-ink-muted leading-relaxed mt-1 font-normal">Select how you want to build and structure this project's developer context.</p>
            </div>
            
            <OnboardingOptions onSelectChat={handleSelectChat} />
          </div>

        </div>

        {/* Settings and Blueprint Checklist (Right Panel) */}
        <div className="w-full lg:w-[380px] shrink-0 flex flex-col gap-8">
          
          {/* Metadata Selector Panel */}
          <div className="rounded-2xl border border-hairline p-6 bg-canvas flex flex-col gap-6">
            <h4 className="text-[16px] font-[var(--font-weight-540)] tracking-tight text-ink pb-3 border-b border-hairline">Project Setup</h4>
            
            <ProjectSettingsPanel settings={settings} onChange={handleSettingsChange} />
          </div>

          {/* Locked Blueprints Checklist */}
          <BlueprintsStatus />

        </div>

      </div>
    </div>
  )
}
