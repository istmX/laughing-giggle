import { useState, useEffect, useMemo, useRef } from 'react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { getFavoriteProjects, updateProject, deleteProject } from '@/features/project/api/projects.api'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { Modal } from '@/components/ui/Modal'
import { 
  Search, Grid, List as ListIcon, Clock, Star, Pencil, Plus, Loader2,
  Trash2, CheckSquare, Square, Folder, CheckCircle2, Globe, Lock
} from 'lucide-react'

// Formatting helpers
function formatRelativeDate(dateStr) {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now - date
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    if (diffMs < 1000 * 60 * 60) return `${Math.floor(diffMs / 60000)}m ago`
    return `${Math.floor(diffMs / 3600000)}h ago`
  }
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

export function FavoriteProjects() {
  const { token } = useAuth()
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('opened') // opened, modified, created, alpha
  const [layout, setLayout] = useState('grid') // grid, list
  const [selectedIds, setSelectedIds] = useState(new Set())

  // Modal states
  const [projectToDelete, setProjectToDelete] = useState(null)
  const [projectToEdit, setProjectToEdit] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isBulkDeleting, setIsBulkDeleting] = useState(false)

  const searchInputRef = useRef(null)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await getFavoriteProjects(token)
        setProjects(res?.data || [])
      } catch {
        toast.error('Failed to load favorite projects')
      } finally {
        setIsLoading(false)
      }
    }
    fetchProjects()
  }, [token])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const toggleFavorite = async (e, project) => {
    e.preventDefault(); e.stopPropagation()
    try {
      const newStatus = !project.is_favorite
      await updateProject(token, project._id, { is_favorite: newStatus })
      setProjects(prev => prev.filter(p => p._id !== project._id))
      toast.success('Removed from favorites')
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
    setIsDeleting(true)
    try {
      await deleteProject(token, projectToDelete._id)
      setProjects(prev => prev.filter(p => p._id !== projectToDelete._id))
      setSelectedIds(prev => { const n = new Set(prev); n.delete(projectToDelete._id); return n })
      toast.success('Project deleted')
      setProjectToDelete(null)
    } catch {
      toast.error('Failed to delete project')
    } finally {
      setIsDeleting(false)
    }
  }

  const saveEdit = async () => {
    if (!projectToEdit || !editTitle.trim()) return
    setIsSaving(true)
    try {
      await updateProject(token, projectToEdit._id, { project_title: editTitle })
      setProjects(prev => prev.map(p => p._id === projectToEdit._id ? { ...p, project_title: editTitle } : p))
      toast.success('Project updated')
      setProjectToEdit(null)
    } catch {
      toast.error('Failed to update project')
    } finally {
      setIsSaving(false)
    }
  }

  const toggleSelection = (e, id) => {
    e.preventDefault(); e.stopPropagation()
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredProjects.length && filteredProjects.length > 0) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredProjects.map(p => p._id)))
    }
  }

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return
    setIsBulkDeleting(true)
    try {
      for (const id of selectedIds) {
        await deleteProject(token, id)
      }
      setProjects(prev => prev.filter(p => !selectedIds.has(p._id)))
      setSelectedIds(new Set())
      toast.success('Projects deleted')
      setBulkDeleteConfirm(false)
    } catch {
      toast.error('Failed to delete some projects')
    } finally {
      setIsBulkDeleting(false)
    }
  }

  const handleBulkRemoveFavorite = async () => {
    try {
      for (const id of selectedIds) {
        await updateProject(token, id, { is_favorite: false })
      }
      setProjects(prev => prev.filter(p => !selectedIds.has(p._id)))
      setSelectedIds(new Set())
      toast.success('Removed from favorites')
    } catch {
      toast.error('Failed to remove some favorites')
    }
  }

  // Filter and Sort
  const filteredProjects = useMemo(() => {
    let result = [...projects]
    
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(p => p.project_title?.toLowerCase().includes(q) || p.project_description?.toLowerCase().includes(q))
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'opened') return new Date(b.last_opened_at || b.createdAt) - new Date(a.last_opened_at || a.createdAt)
      if (sortBy === 'modified') return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
      if (sortBy === 'created') return new Date(b.createdAt) - new Date(a.createdAt)
      if (sortBy === 'alpha') return (a.project_title || '').localeCompare(b.project_title || '')
      return 0
    })

    return result
  }, [projects, searchQuery, sortBy])

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="h-5 w-5 rounded-full border-2 border-ink border-t-transparent animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-background relative overflow-hidden">
      
      {/* Header & Toolbar */}
      <div className="shrink-0 border-b border-hairline bg-background px-4 py-4 sm:px-6 md:px-8 lg:px-10 z-20">
        <div className="mx-auto w-full max-w-7xl">
          <div className="relative overflow-hidden rounded-[var(--radius-lg)] bg-block-lilac px-4 py-5 sm:px-6 sm:py-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft">Saved workspace</p>
              <h1 className="mt-2 text-[32px] md:text-[40px] font-[480] tracking-[-0.04em] text-ink leading-[1.1]">
                Favorites
              </h1>
              <p className="mt-2 block w-full max-w-[60ch] text-[14px] leading-6 text-ink/70">Your most important projects.</p>
            </div>
            <Link to="/dashboard" className="inline-flex h-11 items-center gap-2 self-start rounded-full bg-ink px-5 text-[13px] font-[var(--font-weight-480)] text-canvas transition-transform hover:-translate-y-0.5 hover:opacity-85 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 md:self-auto">
              <Plus className="size-4" aria-hidden="true" />
              All projects
            </Link>
            </div>
          </div>

          <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Search */}
            <div className="relative w-full flex-1 group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted group-focus-within:text-ink transition-colors" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search favorite projects... (Press ⌘K)"
                className="h-12 w-full min-w-0 rounded-[var(--radius-md)] border border-hairline bg-canvas py-2.5 pl-10 pr-14 text-[14px] text-ink placeholder:text-ink-muted/70 transition-all focus:border-ink/35 focus:outline-none focus:ring-2 focus:ring-ink/10"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none gap-1.5 text-[11px] font-mono text-ink-muted font-medium">
                <kbd className="hidden sm:inline-flex items-center justify-center border border-hairline bg-surface-soft rounded px-1.5 py-0.5 shadow-sm">⌘K</kbd>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-full border border-hairline bg-surface-soft p-1">
                <button 
                  onClick={() => setLayout('grid')}
                  className={`flex size-9 items-center justify-center rounded-full transition-colors ${layout === 'grid' ? 'bg-ink text-canvas' : 'text-ink-muted hover:text-ink'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setLayout('list')}
                  className={`flex size-9 items-center justify-center rounded-full transition-colors ${layout === 'list' ? 'bg-ink text-canvas' : 'text-ink-muted hover:text-ink'}`}
                >
                  <ListIcon className="w-4 h-4" />
                </button>
              </div>
              
              <select 
                value={sortBy} 
                onChange={e => setSortBy(e.target.value)}
                className="bg-surface-soft border border-hairline rounded-lg py-2.5 pl-3 pr-8 text-[13px] font-[540] text-ink focus:outline-none focus:ring-2 focus:ring-ink/20 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%20stroke%3D%22%23666%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_0.5rem_center] bg-[length:1em]"
              >
                <option value="opened">Recently Opened</option>
                <option value="modified">Last Modified</option>
                <option value="created">Creation Date</option>
                <option value="alpha">Alphabetical</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-ink text-canvas rounded-full px-6 py-3 flex items-center gap-4 z-50 shadow-lg animate-in slide-in-from-top-4 fade-in duration-200">
          <span className="text-[13px] font-[540]">{selectedIds.size} selected</span>
          <div className="w-px h-4 bg-canvas/20" />
          <button onClick={handleBulkRemoveFavorite} className="flex items-center gap-1.5 text-[13px] font-[540] text-canvas transition-colors hover:text-block-cream">
            <Star className="w-4 h-4" /> Unfavorite
          </button>
          <button onClick={() => setBulkDeleteConfirm(true)} className="flex items-center gap-1.5 text-[13px] font-[540] text-canvas transition-colors hover:text-block-pink">
            <Trash2 className="w-4 h-4" /> Delete
          </button>
          <button onClick={() => setSelectedIds(new Set())} className="text-[13px] text-canvas/70 hover:text-canvas underline underline-offset-2 ml-2">
            Cancel
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-10 lg:py-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="mx-auto w-full max-w-7xl pb-16">
          
          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-[var(--radius-lg)] bg-block-lilac px-6 py-16 text-center">
              <div className="mb-6 flex size-14 items-center justify-center rounded-full border border-ink/10 bg-canvas/60">
                <Star className="size-6 text-ink" fill="currentColor" />
              </div>
              <h3 className="mb-2 text-[22px] font-[var(--font-weight-540)] tracking-[-0.03em] text-ink">No favorite projects</h3>
              <p className="block w-full max-w-[52ch] text-[14px] leading-6 text-ink/70">
                Star your most important projects from the dashboard to keep them handy here.
              </p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="rounded-[var(--radius-lg)] bg-surface-soft px-6 py-16 text-center text-[14px] text-ink-muted">
              No projects match your search criteria.
            </div>
          ) : (
            <div className="space-y-4">
              
              {layout === 'list' && (
                <div className="flex items-center gap-4 px-4 py-2 border-b border-hairline mb-4">
                  <button onClick={toggleSelectAll} className="p-1 text-ink-muted hover:text-ink">
                    {selectedIds.size === filteredProjects.length && filteredProjects.length > 0 ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                  </button>
                  <div className="flex-1 text-[11px] font-mono uppercase tracking-wider text-ink-muted">Project</div>
                  <div className="hidden md:block w-32 text-[11px] font-mono uppercase tracking-wider text-ink-muted text-right">Status</div>
                  <div className="hidden lg:block w-32 text-[11px] font-mono uppercase tracking-wider text-ink-muted text-right">Last Opened</div>
                  <div className="w-24" /> {/* Actions spacer */}
                </div>
              )}

              <div className={layout === 'grid' ? "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3" : "flex flex-col gap-2"}>
                {filteredProjects.map(project => {
                  const isSelected = selectedIds.has(project._id)
                  const docCount = project.doc_count ?? project.documents?.length ?? 0
                  
                  if (layout === 'grid') {
                    return (
                      <div key={project._id} className={`group relative overflow-hidden bg-canvas border rounded-[var(--radius-lg)] p-0 transition-all hover:-translate-y-1 hover:shadow-md ${isSelected ? 'border-brand-indigo ring-1 ring-brand-indigo bg-brand-indigo/5' : 'border-hairline hover:border-ink/20'}`}>
                        <div className="relative h-16 shrink-0 bg-block-pink" aria-hidden="true">
                          <div className="absolute -right-5 -top-9 size-28 rounded-full border-[10px] border-ink/10" />
                          <div className="absolute bottom-3 left-5 flex size-9 items-center justify-center rounded-[var(--radius-md)] border border-ink/10 bg-canvas/55 text-ink">
                            <Folder className="size-4" />
                          </div>
                        </div>
                        <Link to={`/projects/${project._id}`} className="absolute inset-0 z-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 rounded-2xl" />
                        
                        <div className="relative z-10 flex items-start justify-between p-5 pb-0">
                          <button onClick={(e) => toggleSelection(e, project._id)} className="p-1 -ml-1 text-ink-muted hover:text-ink opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                            {isSelected ? <CheckSquare className="w-4 h-4 text-brand-indigo" /> : <Square className="w-4 h-4" />}
                          </button>
                          
                          <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={(e) => toggleFavorite(e, project)} className={`p-1.5 rounded-full transition-all hover:scale-110 hover:bg-surface-soft active:scale-95 ${project.is_favorite ? 'text-ink' : 'text-ink-muted hover:text-ink'}`}>
                              <Star className="w-4 h-4" fill={project.is_favorite ? 'currentColor' : 'none'} />
                            </button>
                            <button onClick={(e) => handleEditInit(e, project)} className="p-1.5 rounded-full text-ink-muted transition-all hover:scale-110 hover:bg-surface-soft hover:text-ink active:scale-95">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={(e) => handleDeleteInit(e, project)} className="p-1.5 rounded-full text-ink-muted transition-all hover:scale-110 hover:bg-destructive/10 hover:text-destructive active:scale-95">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="relative z-10 px-5 pb-5">
                          <h3 className="text-[16px] font-[540] text-ink truncate mb-1 pr-4">{project.project_title}</h3>
                          <p className="text-[13px] text-ink-muted line-clamp-2 min-h-[40px] mb-4 w-full max-w-[60ch] block">
                            {project.project_description || 'No description.'}
                          </p>
                          
                          <div className="flex items-center justify-between text-[11px] font-mono text-ink-muted">
                            <div className="flex items-center gap-2">
                              {project.is_public ? <Globe className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                              <span>{docCount} docs</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{formatRelativeDate(project.last_opened_at || project.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  }

                  // List Layout
                  return (
                    <div key={project._id} className={`group relative flex flex-col md:flex-row md:items-center gap-4 bg-canvas border rounded-xl p-4 hover:bg-surface-soft transition-colors ${isSelected ? 'border-brand-indigo bg-brand-indigo/5' : 'border-transparent hover:border-hairline'}`}>
                      <Link to={`/projects/${project._id}`} className="absolute inset-0 z-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 rounded-xl" />
                      
                      <button onClick={(e) => toggleSelection(e, project._id)} className="relative z-10 p-1 shrink-0 text-ink-muted hover:text-ink self-start md:self-auto">
                        {isSelected ? <CheckSquare className="w-4 h-4 text-brand-indigo" /> : <Square className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />}
                      </button>
                      
                      <div className="flex-1 min-w-0 relative z-10">
                        <h3 className="text-[15px] font-[540] text-ink truncate">{project.project_title}</h3>
                        <p className="text-[13px] text-ink-muted truncate mt-0.5 w-full max-w-[60ch] block">{project.project_description || 'No description'}</p>
                      </div>
                      
                      <div className="hidden md:flex items-center justify-end w-32 relative z-10">
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-surface-elevated border border-hairline text-[11px] font-[540] text-ink-muted">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Active
                        </span>
                      </div>
                      
                      <div className="hidden lg:flex items-center justify-end w-32 relative z-10 text-[12px] text-ink-muted">
                        {formatRelativeDate(project.last_opened_at || project.createdAt)}
                      </div>
                      
                      <div className="relative z-10 flex items-center justify-end w-24 gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity self-end md:self-auto mt-2 md:mt-0">
                        <button onClick={(e) => toggleFavorite(e, project)} className={`p-1.5 rounded-full transition-all hover:scale-110 hover:bg-surface-elevated active:scale-95 ${project.is_favorite ? 'text-ink' : 'text-ink-muted hover:text-ink'}`}>
                          <Star className="w-4 h-4" fill={project.is_favorite ? 'currentColor' : 'none'} />
                        </button>
                        <button onClick={(e) => handleEditInit(e, project)} className="p-1.5 rounded-md hover:bg-surface-elevated text-ink-muted hover:text-ink transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={(e) => handleDeleteInit(e, project)} className="p-1.5 rounded-md hover:bg-destructive/10 text-ink-muted hover:text-destructive transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={!!projectToDelete} onClose={() => !isDeleting && setProjectToDelete(null)} title="Delete Project" accent="bg-block-coral">
        <p className="text-ink-muted text-[15px] mb-8 leading-relaxed w-full max-w-[60ch] block">
          Are you sure you want to delete <span className="font-[540] text-ink">"{projectToDelete?.project_title}"</span>? This action cannot be undone.
        </p>
        <div className="flex items-center justify-end gap-3">
          <button onClick={() => setProjectToDelete(null)} className="px-5 py-2.5 text-[14px] font-[540] text-ink bg-surface hover:bg-surface-soft border border-hairline rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 transition-all">Cancel</button>
          <button onClick={confirmDelete} disabled={isDeleting} className="inline-flex h-11 items-center gap-2 rounded-full bg-destructive px-5 text-[13px] font-[var(--font-weight-480)] text-canvas transition-opacity hover:opacity-85 disabled:cursor-wait disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/30">
            {isDeleting && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
            {isDeleting ? 'Deleting…' : 'Delete project'}
          </button>
        </div>
      </Modal>

      <Modal isOpen={bulkDeleteConfirm} onClose={() => setBulkDeleteConfirm(false)} title="Delete Projects">
        <p className="text-ink-muted text-[15px] mb-8 leading-relaxed w-full max-w-[60ch] block">
          Are you sure you want to delete {selectedIds.size} projects? This action cannot be undone.
        </p>
        <div className="flex items-center justify-end gap-3">
          <button onClick={() => setBulkDeleteConfirm(false)} className="px-5 py-2.5 text-[14px] font-[540] text-ink bg-surface hover:bg-surface-soft border border-hairline rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 transition-all">Cancel</button>
          <button onClick={handleBulkDelete} disabled={isBulkDeleting} className="inline-flex h-11 items-center gap-2 rounded-full bg-destructive px-5 text-[13px] font-[var(--font-weight-480)] text-canvas transition-opacity hover:opacity-85 disabled:cursor-wait disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/30">
            {isBulkDeleting && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
            {isBulkDeleting ? 'Deleting…' : 'Delete projects'}
          </button>
        </div>
      </Modal>

      <Modal isOpen={!!projectToEdit} onClose={() => !isSaving && setProjectToEdit(null)} title="Rename Project" accent="bg-block-lilac">
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
          <button onClick={saveEdit} disabled={isSaving || !editTitle.trim() || editTitle === projectToEdit?.project_title} className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-[13px] font-[var(--font-weight-480)] text-canvas transition-opacity hover:opacity-85 disabled:cursor-wait disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30">
            {isSaving && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
            {isSaving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
