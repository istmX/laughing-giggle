import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { createProject, getProjects, updateProject, deleteProject } from '@/features/project/api/projects.api'
import { useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { 
  ArrowRight, Sparkles, Search, Plus,
  Clock, Database, Star, Pencil, Trash2
} from 'lucide-react'
import { Modal } from '@/components/ui/Modal'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function formatRelativeDate(dateStr) {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now - date
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

// ─── Search & Command Bar ──────────────────────────────────────────────────
function SearchBar() {
  const inputRef = useRef(null)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="relative w-full mb-10 group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-ink-muted group-focus-within:text-ink transition-colors" />
      </div>
      <input
        ref={inputRef}
        type="text"
        className="w-full bg-canvas border border-hairline rounded-2xl py-4 pl-12 pr-4 text-[16px] text-ink placeholder:text-ink-muted/50 focus:outline-none focus:bg-surface-elevated focus:border-ink/20 focus:ring-4 focus:ring-ink/5 transition-all shadow-sm hover:border-ink/20"
        placeholder="Search projects, templates, or actions..."
      />
      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none gap-1.5 text-[11px] font-mono text-ink-muted font-medium">
        <kbd className="hidden sm:inline-flex items-center justify-center border border-hairline bg-surface-soft rounded px-2 py-1 shadow-sm text-[10px]">Ctrl K</kbd>
        <span className="hidden sm:inline-block">/</span>
        <kbd className="hidden sm:inline-flex items-center justify-center border border-hairline bg-surface-soft rounded px-2 py-1 shadow-sm text-[10px]">⌘K</kbd>
      </div>
    </div>
  )
}

// ─── Rich Continue Working Card ──────────────────────────────────────────────
function ContinueWorkingCard({ project }) {
  if (!project) return null;
  
  return (
    <div className="mb-10">
      <h2 className="text-[12px] font-mono tracking-[0.1em] uppercase text-ink-muted mb-4 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        Continue Working
      </h2>
      <Link to={`/projects/${project._id}`} className="block group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 rounded-2xl">
        <div className="bg-canvas border border-hairline rounded-2xl p-6 hover:border-ink/20 hover:shadow-md transition-all">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-[24px] font-[540] text-ink truncate group-hover:text-brand-indigo transition-colors">
                  {project.project_title}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full border border-hairline bg-surface-soft text-[11px] font-mono text-ink-muted uppercase">
                  Active
                </span>
              </div>
              <p className="text-[14px] text-ink-muted line-clamp-2 mb-6 w-full max-w-[60ch] block">
                {project.project_description || 'Resume your architecture and specification session.'}
              </p>
              
              <div className="flex flex-wrap items-center gap-4 text-[12px] text-ink-muted font-[480]">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Edited {formatRelativeDate(project.last_opened_at || project.createdAt)}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-4 shrink-0">
              <div className="flex items-center gap-2 mt-auto">
                <button className="ml-2 px-4 py-2 bg-ink text-canvas text-[13px] font-[540] rounded-full group-hover:scale-105 transition-transform flex items-center gap-2 shadow-sm">
                  Resume <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

// ─── Recent Projects List ────────────────────────────────────────────────────
function RecentProjectsList({ projects, onToggleFavorite, onEdit, onDelete }) {
  if (!projects || projects.length === 0) return null;
  
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[12px] font-mono tracking-[0.1em] uppercase text-ink-muted">Recent Projects</h2>
        <Link to="/dashboard/recent" className="text-[12px] font-[480] text-ink hover:underline">View all</Link>
      </div>
      <div className="bg-canvas border border-hairline rounded-2xl overflow-hidden shadow-sm">
        <div className="divide-y divide-hairline">
          {projects.slice(0, 4).map((p) => (
            <div key={p._id} className="relative flex items-center justify-between p-4 hover:bg-surface-soft transition-colors group">
              <Link to={`/projects/${p._id}`} className="absolute inset-0 z-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/30" />
              
              <div className="relative z-10 flex items-center gap-4 min-w-0 pointer-events-none">
                <div className="w-10 h-10 rounded-lg bg-surface-elevated border border-hairline flex items-center justify-center shrink-0">
                  <Database className="w-4 h-4 text-ink-muted" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-[14px] font-[540] text-ink truncate group-hover:text-brand-indigo transition-colors">{p.project_title}</h4>
                  <p className="text-[12px] text-ink-muted truncate mt-0.5 w-full max-w-[60ch] block">
                    Updated {formatRelativeDate(p.last_opened_at || p.createdAt)}
                  </p>
                </div>
              </div>
              <div className="relative z-10 flex items-center gap-1 shrink-0 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={(e) => onToggleFavorite(e, p)} className={`p-1.5 rounded-md hover:bg-surface-elevated transition-colors ${p.is_favorite ? 'text-warning' : 'text-ink-muted hover:text-ink'}`}>
                  <Star className="w-4 h-4" fill={p.is_favorite ? 'currentColor' : 'none'} />
                </button>
                <button onClick={(e) => onEdit(e, p)} className="p-1.5 rounded-md hover:bg-surface-elevated text-ink-muted hover:text-ink transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={(e) => onDelete(e, p)} className="p-1.5 rounded-md hover:bg-destructive/10 text-ink-muted hover:text-destructive transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}



// ─── Main Overview ────────────────────────────────────────────────────────────
export function Overview() {
  const navigate = useNavigate()
  const { token, user } = useAuth()
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [projectToDelete, setProjectToDelete] = useState(null)
  const [projectToEdit, setProjectToEdit] = useState(null)
  const [editTitle, setEditTitle] = useState('')

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await getProjects(token)
        const sorted = (res?.data || []).sort((a, b) =>
          new Date(b.last_opened_at || b.createdAt) - new Date(a.last_opened_at || a.createdAt)
        )
        setProjects(sorted)
      } catch {
        console.error('Failed to fetch projects')
      } finally {
        setIsLoading(false)
      }
    }
    fetchProjects()
  }, [token])

  const toggleFavorite = async (e, project) => {
    e.preventDefault(); e.stopPropagation()
    try {
      const newStatus = !project.is_favorite
      await updateProject(token, project._id, { is_favorite: newStatus })
      setProjects(prev => prev.map(p => p._id === project._id ? { ...p, is_favorite: newStatus } : p))
      toast.success(newStatus ? 'Added to favorites' : 'Removed from favorites')
    } catch {
      toast.error('Failed to update favorite status')
    }
  }

  const handleEditInit = (e, project) => {
    e.preventDefault(); e.stopPropagation()
    setEditTitle(project.project_title)
    setProjectToEdit(project)
  }

  const handleDeleteInit = (e, project) => {
    e.preventDefault(); e.stopPropagation()
    setProjectToDelete(project)
  }

  const confirmDelete = async () => {
    if (!projectToDelete) return
    try {
      await deleteProject(token, projectToDelete._id)
      setProjects(prev => prev.filter(p => p._id !== projectToDelete._id))
      toast.success('Project deleted')
      setProjectToDelete(null)
    } catch {
      toast.error('Failed to delete project')
    }
  }

  const saveEdit = async () => {
    if (!projectToEdit || !editTitle.trim()) return
    try {
      await updateProject(token, projectToEdit._id, { project_title: editTitle })
      setProjects(prev => prev.map(p => p._id === projectToEdit._id ? { ...p, project_title: editTitle } : p))
      toast.success('Project updated')
      setProjectToEdit(null)
    } catch {
      toast.error('Failed to update project')
    }
  }

  const handleNewProject = async () => {
    try {
      const res = await createProject(token, {
        project_title: 'Untitled Project',
        wizard_state: {}
      })
      if (res?.data?._id) {
        navigate(`/projects/${res.data._id}`)
      }
    } catch {
      toast.error('Failed to create project')
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="h-5 w-5 rounded-full border-2 border-ink border-t-transparent animate-spin" />
      </div>
    )
  }

  const firstName = user?.name?.split(' ')[0] || 'there'
  const featuredProject = projects[0]
  const listProjects = projects.slice(1)

  return (
    <div className="flex-1 flex flex-col h-full bg-background relative overflow-hidden">
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-10 lg:p-12 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        
        <div className="w-full max-w-[1400px] mx-auto pb-24 flex flex-col lg:flex-row gap-10">
          
          {/* Main Content Column */}
          <div className="flex-1 min-w-0">
            {/* Header row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <h1 className="text-[24px] font-[540] text-ink tracking-tight">
                {getGreeting()}, {firstName}
              </h1>
              <button
                onClick={handleNewProject}
                className="flex items-center gap-2 px-5 py-2.5 bg-ink text-canvas text-[14px] font-[480] rounded-full hover:opacity-90 transition-opacity shadow-sm self-start md:self-auto"
              >
                <Plus className="w-4 h-4" /> New Project
              </button>
            </div>

            <SearchBar />

            {projects.length > 0 ? (
              <>
                <ContinueWorkingCard project={featuredProject} />
                <RecentProjectsList 
                  projects={listProjects} 
                  onToggleFavorite={toggleFavorite}
                  onEdit={handleEditInit}
                  onDelete={handleDeleteInit}
                />
              </>
            ) : (
              <div className="bg-surface-soft border border-dashed border-hairline rounded-2xl p-12 text-center flex flex-col items-center mt-10">
                <div className="w-16 h-16 bg-canvas border border-hairline rounded-full flex items-center justify-center mb-4">
                  <Database className="w-6 h-6 text-ink-muted" />
                </div>
                <h3 className="text-[16px] font-[540] text-ink mb-2">Your workspace is empty</h3>
                <p className="text-[14px] text-ink-muted mb-6 whitespace-normal w-full max-w-[60ch] block">
                  Start a new project to begin building with Zenix.
                </p>
                <button
                  onClick={handleNewProject}
                  className="flex items-center gap-2 px-5 py-2.5 bg-ink text-canvas text-[14px] font-[480] rounded-full hover:opacity-90 transition-opacity shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Start Building
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Modals */}
      <Modal isOpen={!!projectToDelete} onClose={() => setProjectToDelete(null)} title="Delete Project">
        <p className="text-ink-muted text-[15px] mb-8 leading-relaxed w-full max-w-[60ch] block">
          Are you sure you want to delete <span className="font-[540] text-ink">"{projectToDelete?.project_title}"</span>? This action cannot be undone.
        </p>
        <div className="flex items-center justify-end gap-3">
          <button onClick={() => setProjectToDelete(null)} className="px-5 py-2.5 text-[14px] font-[540] text-ink bg-surface hover:bg-surface-soft border border-hairline rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 transition-all">Cancel</button>
          <button onClick={confirmDelete} className="px-5 py-2.5 text-[14px] font-[540] text-canvas bg-destructive hover:bg-destructive/90 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/30 transition-all shadow-sm">Delete Project</button>
        </div>
      </Modal>

      <Modal isOpen={!!projectToEdit} onClose={() => setProjectToEdit(null)} title="Rename Project">
        <div className="mb-8 mt-2">
          <label className="block text-[13px] font-[540] text-ink mb-2 uppercase tracking-wider">Project Title</label>
          <input 
            type="text" 
            autoFocus 
            value={editTitle} 
            onChange={(e) => setEditTitle(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && saveEdit()} 
            className="w-full px-4 py-3 bg-surface border border-hairline rounded-xl text-[15px] text-ink focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink/30 transition-all" 
            placeholder="Enter project name..." 
          />
        </div>
        <div className="flex items-center justify-end gap-3">
          <button onClick={() => setProjectToEdit(null)} className="px-5 py-2.5 text-[14px] font-[540] text-ink bg-surface border border-hairline rounded-full hover:bg-surface-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 transition-all">Cancel</button>
          <button onClick={saveEdit} disabled={!editTitle.trim() || editTitle === projectToEdit?.project_title} className="px-5 py-2.5 text-[14px] font-[540] text-canvas bg-ink rounded-full hover:opacity-90 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 transition-all shadow-sm">Save Changes</button>
        </div>
      </Modal>
    </div>
  )
}
