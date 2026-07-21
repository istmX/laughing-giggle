import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FolderOpen, Loader2, Plus, Search, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

import { Modal } from '@/components/ui/Modal'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { createProject, deleteProject, getProjects, updateProject } from '@/features/project/api/projects.api'
import { ProjectCard } from '@/features/project/ui/ProjectCard'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function SearchBar({ value, onChange }) {
  const inputRef = useRef(null)

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        inputRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="group relative w-full">
      <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink-muted transition-colors group-focus-within:text-ink" aria-hidden="true" />
      <input
        ref={inputRef}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        type="search"
        aria-label="Search projects"
        placeholder="Search projects"
        className="h-12 w-full rounded-[var(--radius-md)] border border-hairline bg-canvas pl-11 pr-24 text-[14px] text-ink outline-none transition-colors placeholder:text-ink-muted focus:border-ink/35 focus:ring-2 focus:ring-ink/10"
      />
      <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-hairline bg-surface-soft px-2 py-1 font-mono text-[10px] text-ink-muted sm:inline-flex">
        ⌘ K
      </kbd>
    </div>
  )
}

function WorkspaceBanner({ projectCount, onNewProject }) {
  return (
    <section className="relative overflow-hidden rounded-[var(--radius-lg)] bg-block-lime p-6 sm:p-8" aria-labelledby="workspace-banner-title">
      <div className="relative z-10 max-w-2xl sm:pr-44">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/65">
          <Sparkles className="size-3.5" aria-hidden="true" />
          Context workspace
        </div>
        <h2 id="workspace-banner-title" className="mt-4 max-w-[30ch] text-[clamp(1.75rem,3vw,2.75rem)] font-[var(--font-weight-340)] leading-[1.02] tracking-[-0.04em] text-ink">
          Keep every idea implementation-ready.
        </h2>
        <p className="mt-3 max-w-[58ch] text-[14px] leading-6 text-ink/70">
          Zenix turns rough ideas into context, architecture, and a build path your tools can use.
        </p>
      </div>

      <div className="relative z-10 mt-6 flex flex-wrap items-center gap-4 sm:absolute sm:bottom-8 sm:right-8 sm:mt-0 sm:flex-col sm:items-end">
        <div className="text-left sm:text-right">
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink/60">Workspace</p>
          <p className="mt-1 text-[24px] font-[var(--font-weight-540)] tracking-[-0.03em] text-ink">{projectCount} {projectCount === 1 ? 'project' : 'projects'}</p>
        </div>
        <button
          type="button"
          onClick={onNewProject}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-[13px] font-[var(--font-weight-480)] text-canvas transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 focus-visible:ring-offset-2 focus-visible:ring-offset-block-lime"
        >
          <Plus className="size-4" aria-hidden="true" />
          New project
        </button>
      </div>

      <div className="absolute -right-16 -top-20 size-64 rounded-full border-[18px] border-ink/10" aria-hidden="true" />
    </section>
  )
}

function EmptyProjects({ onNewProject, hasSearch }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-hairline bg-surface-soft px-6 py-16 text-center">
      <div className="flex size-14 items-center justify-center rounded-full border border-hairline bg-canvas text-ink-muted">
        <FolderOpen className="size-6" strokeWidth={1.5} aria-hidden="true" />
      </div>
      <h2 className="mt-5 text-[20px] font-[var(--font-weight-540)] tracking-[-0.02em] text-ink">
        {hasSearch ? 'No matching projects' : 'Your workspace is empty'}
      </h2>
      <p className="mt-2 max-w-[42ch] text-[14px] leading-6 text-ink-muted">
        {hasSearch ? 'Try a different search term or clear the filter.' : 'Start a project to turn your next software idea into an implementation-ready workspace.'}
      </p>
      {!hasSearch && (
        <button
          type="button"
          onClick={onNewProject}
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-[13px] font-[var(--font-weight-480)] text-canvas transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
        >
          <Plus className="size-4" aria-hidden="true" />
          Start building
        </button>
      )}
    </div>
  )
}

export function Overview() {
  const navigate = useNavigate()
  const { token, user } = useAuth()
  const [projects, setProjects] = useState([])
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [projectToDelete, setProjectToDelete] = useState(null)
  const [projectToEdit, setProjectToEdit] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getProjects(token)
        const sorted = (response?.data || []).sort((a, b) => (
          new Date(b.last_opened_at || b.createdAt) - new Date(a.last_opened_at || a.createdAt)
        ))
        setProjects(sorted)
      } catch {
        toast.error('Failed to load your projects')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [token])

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return projects
    return projects.filter((project) => (
      project.project_title?.toLowerCase().includes(query) ||
      project.project_description?.toLowerCase().includes(query)
    ))
  }, [projects, search])

  const handleNewProject = async () => {
    try {
      const response = await createProject(token, { project_title: 'Untitled Project', wizard_state: {} })
      if (response?.data?._id) navigate(`/projects/${response.data._id}`)
    } catch {
      toast.error('Failed to create project')
    }
  }

  const toggleFavorite = async (event, project) => {
    event.preventDefault()
    event.stopPropagation()
    try {
      const isFavorite = !project.is_favorite
      await updateProject(token, project._id, { is_favorite: isFavorite })
      setProjects((current) => current.map((item) => item._id === project._id ? { ...item, is_favorite: isFavorite } : item))
      toast.success(isFavorite ? 'Added to favorites' : 'Removed from favorites')
    } catch {
      toast.error('Failed to update favorite status')
    }
  }

  const startEditing = (event, project) => {
    event.preventDefault()
    event.stopPropagation()
    setEditTitle(project.project_title)
    setProjectToEdit(project)
  }

  const startDeleting = (event, project) => {
    event.preventDefault()
    event.stopPropagation()
    setProjectToDelete(project)
  }

  const confirmDelete = async () => {
    if (!projectToDelete) return
    setIsDeleting(true)
    try {
      await deleteProject(token, projectToDelete._id)
      setProjects((current) => current.filter((project) => project._id !== projectToDelete._id))
      setProjectToDelete(null)
      toast.success('Project deleted')
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
      const title = editTitle.trim()
      await updateProject(token, projectToEdit._id, { project_title: title })
      setProjects((current) => current.map((project) => project._id === projectToEdit._id ? { ...project, project_title: title } : project))
      setProjectToEdit(null)
      toast.success('Project updated')
    } catch {
      toast.error('Failed to update project')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-background" aria-label="Loading projects">
        <div className="size-5 animate-spin rounded-full border-2 border-ink border-t-transparent" />
      </div>
    )
  }

  const firstName = user?.name?.split(' ')[0] || 'there'

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden bg-background text-ink">
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 pb-16">
          <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-soft">{getGreeting()}, {firstName}</p>
              <h1 className="mt-2 text-[32px] font-[var(--font-weight-540)] leading-tight tracking-[-0.04em] text-ink sm:text-[40px]">All projects</h1>
              <p className="mt-2 max-w-[48ch] text-[14px] leading-6 text-ink-muted">A clear place for every idea, decision, and implementation path.</p>
            </div>
            <button
              type="button"
              onClick={handleNewProject}
              className="inline-flex h-11 items-center gap-2 self-start rounded-full bg-ink px-5 text-[13px] font-[var(--font-weight-480)] text-canvas transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 sm:self-auto"
            >
              <Plus className="size-4" aria-hidden="true" />
              New project
            </button>
          </header>

          <WorkspaceBanner projectCount={projects.length} onNewProject={handleNewProject} />

          <section aria-labelledby="projects-heading">
            <div className="flex flex-col justify-between gap-4 border-b border-hairline pb-4 sm:flex-row sm:items-end">
              <div>
                <h2 id="projects-heading" className="text-[18px] font-[var(--font-weight-540)] tracking-[-0.02em] text-ink">Your projects</h2>
                <p className="mt-1 text-[13px] text-ink-muted">{filteredProjects.length} of {projects.length} shown</p>
              </div>
              <div className="w-full sm:w-[18rem]">
                <SearchBar value={search} onChange={setSearch} />
              </div>
            </div>

            <div className="mt-6">
              {filteredProjects.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {filteredProjects.map((project, index) => (
                    <ProjectCard
                      key={project._id}
                      project={project}
                      index={index}
                      onToggleFavorite={toggleFavorite}
                      onEdit={startEditing}
                      onDelete={startDeleting}
                    />
                  ))}
                </div>
              ) : (
                <EmptyProjects onNewProject={handleNewProject} hasSearch={Boolean(search.trim())} />
              )}
            </div>
          </section>
        </div>
      </div>

      <Modal isOpen={!!projectToDelete} onClose={() => !isDeleting && setProjectToDelete(null)} title="Delete project" accent="bg-block-coral">
        <p className="max-w-[60ch] text-[15px] leading-6 text-ink-muted">
          Are you sure you want to delete <span className="font-[var(--font-weight-540)] text-ink">“{projectToDelete?.project_title}”</span>? This action cannot be undone.
        </p>
        <div className="mt-8 flex justify-end gap-3">
          <button type="button" onClick={() => setProjectToDelete(null)} className="h-11 rounded-full border border-hairline bg-canvas px-5 text-[13px] font-[var(--font-weight-480)] text-ink transition-colors hover:bg-surface-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/20">Cancel</button>
          <button type="button" onClick={confirmDelete} disabled={isDeleting} className="inline-flex h-11 items-center gap-2 rounded-full bg-destructive px-5 text-[13px] font-[var(--font-weight-480)] text-canvas transition-opacity hover:opacity-85 disabled:cursor-wait disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/30">
            {isDeleting && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
            {isDeleting ? 'Deleting…' : 'Delete project'}
          </button>
        </div>
      </Modal>

      <Modal isOpen={!!projectToEdit} onClose={() => !isSaving && setProjectToEdit(null)} title="Rename project" accent="bg-block-lilac">
        <label htmlFor="project-title" className="block text-[13px] font-[var(--font-weight-480)] text-ink">Project title</label>
        <input
          id="project-title"
          type="text"
          autoFocus
          value={editTitle}
          onChange={(event) => setEditTitle(event.target.value)}
          onKeyDown={(event) => event.key === 'Enter' && saveEdit()}
          className="mt-2 h-12 w-full rounded-[var(--radius-md)] border border-hairline bg-canvas px-4 text-[15px] text-ink outline-none transition-colors placeholder:text-ink-muted focus:border-ink/35 focus:ring-2 focus:ring-ink/10"
          placeholder="Enter project name"
        />
        <div className="mt-8 flex justify-end gap-3">
          <button type="button" onClick={() => setProjectToEdit(null)} className="h-11 rounded-full border border-hairline bg-canvas px-5 text-[13px] font-[var(--font-weight-480)] text-ink transition-colors hover:bg-surface-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/20">Cancel</button>
          <button type="button" onClick={saveEdit} disabled={isSaving || !editTitle.trim() || editTitle.trim() === projectToEdit?.project_title} className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-[13px] font-[var(--font-weight-480)] text-canvas transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/20">
            {isSaving && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
            {isSaving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
