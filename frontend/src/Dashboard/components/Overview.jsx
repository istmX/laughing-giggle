import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { createProject, getProjects, deleteProject, updateProject } from '@/features/project/api/projects.api'
import { CreateProjectDialog } from '@/features/project/ui/CreateProjectDialog'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Modal } from '@/components/ui/Modal'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Trash2, Pencil, Star, Plus, Sparkles } from 'lucide-react'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

// Color palette for project icons (cycles by index)
const PROJECT_COLORS = [
  { bg: 'bg-violet-100 dark:bg-violet-900/40', text: 'text-violet-600 dark:text-violet-400', dot: 'bg-violet-400' },
  { bg: 'bg-indigo-100 dark:bg-indigo-900/40', text: 'text-indigo-600 dark:text-indigo-400', dot: 'bg-indigo-400' },
  { bg: 'bg-emerald-100 dark:bg-emerald-900/40', text: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-400' },
  { bg: 'bg-amber-100 dark:bg-amber-900/40', text: 'text-amber-600 dark:text-amber-400', dot: 'bg-amber-400' },
  { bg: 'bg-rose-100 dark:bg-rose-900/40', text: 'text-rose-600 dark:text-rose-400', dot: 'bg-rose-400' },
  { bg: 'bg-sky-100 dark:bg-sky-900/40', text: 'text-sky-600 dark:text-sky-400', dot: 'bg-sky-400' },
  { bg: 'bg-teal-100 dark:bg-teal-900/40', text: 'text-teal-600 dark:text-teal-400', dot: 'bg-teal-400' },
  { bg: 'bg-orange-100 dark:bg-orange-900/40', text: 'text-orange-600 dark:text-orange-400', dot: 'bg-orange-400' },
]

function getProjectColor(index) {
  return PROJECT_COLORS[index % PROJECT_COLORS.length]
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

// ─── Gradient Orb Empty Icon ──────────────────────────────────────────────────
function GradientOrb() {
  return (
    <div className="relative h-10 w-10 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
      <Sparkles className="h-4 w-4 text-white" strokeWidth={1.75} />
    </div>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ onNewProject }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center text-center py-24 px-6"
    >
      <div className="mb-5">
        <GradientOrb />
      </div>
      <h3 className="text-[16px] font-[540] text-ink mb-2">No projects yet</h3>
      <p className="text-[13.5px] text-ink-muted leading-relaxed max-w-[260px] mb-7">
        Describe an idea. Zenix will architect,<br />design, and organize everything for you.
      </p>
      <button
        onClick={() => onNewProject()}
        className="flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[13.5px] font-[480] text-canvas hover:opacity-90 active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
      >
        <Plus className="h-3.5 w-3.5" />
        New Project
      </button>
    </motion.div>
  )
}

// ─── Featured Project Card ────────────────────────────────────────────────────
function FeaturedProject({ project, index, onToggleFavorite, onEdit, onDelete }) {
  const color = getProjectColor(index)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className="group relative flex flex-col md:flex-row items-start md:items-center justify-between p-8 rounded-3xl border border-hairline bg-surface-elevated transition-all hover:border-ink/20 hover:shadow-md hover:shadow-black/5 overflow-hidden gap-6"
    >
      <Link
        to={`/projects/${project._id}`}
        className="absolute inset-0 z-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 focus-visible:ring-offset-2"
        aria-label={`Open project ${project.project_title}`}
      />

      <div className="relative z-10 flex flex-col pointer-events-none flex-1 min-w-0">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted mb-3 flex items-center gap-2">
          <span className={`h-1.5 w-1.5 rounded-full ${color.dot} animate-pulse shrink-0`} />
          Continue working
        </span>
        <h3 className="text-[32px] md:text-[40px] leading-[1.1] font-[480] text-ink tracking-[-0.04em] mb-3 truncate w-full">
          {project.project_title}
        </h3>
        <div className="w-full max-w-xl">
          <p className="text-[16px] text-ink-muted leading-relaxed line-clamp-2">
            {project.project_description || 'Start building your next big idea here.'}
          </p>
        </div>
      </div>

      <div className="relative z-10 flex items-center gap-4 mt-8 md:mt-0 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 shrink-0">
        <div className="flex items-center gap-1 mr-2 md:mr-6">
          <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleFavorite(e, project) }} className={`p-3 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 ${project.is_favorite ? 'text-amber-500 bg-amber-500/10' : 'text-ink-muted hover:text-ink hover:bg-surface-soft'}`}>
            <Star className="h-4 w-4" fill={project.is_favorite ? 'currentColor' : 'none'} />
          </button>
          <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(e, project) }} className="p-3 text-ink-muted hover:text-ink hover:bg-surface-soft rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30">
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(e, project) }} className="p-3 text-ink-muted hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/30">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <div className="h-14 w-14 rounded-full bg-ink text-canvas flex items-center justify-center pointer-events-none transform md:group-hover:scale-105 transition-transform duration-500 ease-[0.16,1,0.3,1] shrink-0">
          <ArrowRight className="h-6 w-6 transform md:group-hover:translate-x-1.5 transition-transform duration-500 ease-[0.16,1,0.3,1]" />
        </div>
      </div>
    </motion.div>
  )
}

// ─── Project Card (grid) ──────────────────────────────────────────────────────
function ProjectCard({ project, index, onToggleFavorite, onEdit, onDelete }) {
  const color = getProjectColor(index)
  const docCount = project.doc_count ?? project.documents?.length ?? 0
  const dateLabel = formatRelativeDate(project.last_opened_at || project.createdAt)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.05 * index }}
      className="group relative rounded-xl border border-hairline bg-canvas hover:border-ink/20 hover:shadow-md hover:shadow-black/5 transition-all p-4 cursor-pointer"
    >
      <Link
        to={`/projects/${project._id}`}
        className="absolute inset-0 z-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
        aria-label={`Open ${project.project_title}`}
      />

      <div className="relative z-10 flex items-start justify-between gap-3">
        {/* Icon */}
        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${color.bg} ${color.text}`}>
          <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4" xmlns="http://www.w3.org/2000/svg">
            <rect x="2" y="2" width="5" height="5" rx="1" fill="currentColor" opacity="0.9" />
            <rect x="9" y="2" width="5" height="5" rx="1" fill="currentColor" opacity="0.6" />
            <rect x="2" y="9" width="5" height="5" rx="1" fill="currentColor" opacity="0.6" />
            <rect x="9" y="9" width="5" height="5" rx="1" fill="currentColor" opacity="0.3" />
          </svg>
        </div>

        {/* Arrow — appears on hover */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <ArrowUpRight className="h-3.5 w-3.5 text-ink-muted" />
        </div>
      </div>

      <div className="relative z-10 mt-3">
        <h4 className="text-[14px] font-[540] text-ink leading-snug truncate">{project.project_title}</h4>
        <p className="text-[12px] text-ink-muted font-mono mt-0.5">
          {docCount > 0 ? `${docCount} doc${docCount !== 1 ? 's' : ''} · ` : ''}{dateLabel}
        </p>
      </div>

      {/* Action buttons – appear on hover */}
      <div className="relative z-10 flex items-center gap-0.5 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleFavorite(e, project) }}
          className={`p-1.5 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 ${project.is_favorite ? 'text-amber-500 bg-amber-500/10' : 'text-ink-muted hover:text-ink hover:bg-surface-soft'}`}
        >
          <Star className="h-3 w-3" fill={project.is_favorite ? 'currentColor' : 'none'} />
        </button>
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(e, project) }}
          className="p-1.5 text-ink-muted hover:text-ink hover:bg-surface-soft rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
        >
          <Pencil className="h-3 w-3" />
        </button>
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(e, project) }}
          className="p-1.5 text-ink-muted hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/30"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
    </motion.div>
  )
}

// ─── Main Overview ────────────────────────────────────────────────────────────
export function Overview() {
  const navigate = useNavigate()
  const { token, user } = useAuth()
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Modal states
  const [projectToDelete, setProjectToDelete] = useState(null)
  const [projectToEdit, setProjectToEdit] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await getProjects(token)
        // Sort by last opened for consistency
        const sorted = (res?.data || []).sort((a, b) =>
          new Date(b.last_opened_at || b.createdAt) - new Date(a.last_opened_at || a.createdAt)
        )
        setProjects(sorted)
      } catch (err) {
        console.error('Failed to fetch projects', err)
        toast.error('Failed to load projects')
      } finally {
        setIsLoading(false)
      }
    }
    fetchProjects()
  }, [token])

  const handleNewProject = async (promptText) => {
    try {
      const res = await createProject(token, {
        project_title: 'Untitled Project',
        wizard_state: promptText ? { prompt: promptText, autoStart: true } : {}
      })
      if (res?.data?._id) {
        toast.success('Project created')
        navigate(`/projects/${res.data._id}`)
      }
    } catch (err) {
      console.error('Failed to create project', err)
      toast.error('Failed to create project')
    }
  }

  const confirmDelete = async () => {
    if (!projectToDelete) return
    try {
      await deleteProject(token, projectToDelete._id)
      setProjects((prev) => prev.filter(p => p._id !== projectToDelete._id))
      toast.success('Project deleted')
      setProjectToDelete(null)
    } catch (err) {
      console.error('Failed to delete project', err)
      toast.error('Failed to delete project')
    }
  }

  const saveEdit = async () => {
    if (!projectToEdit || !editTitle.trim()) return
    try {
      await updateProject(token, projectToEdit._id, { project_title: editTitle })
      setProjects((prev) => prev.map(p => p._id === projectToEdit._id ? { ...p, project_title: editTitle } : p))
      toast.success('Project updated')
      setProjectToEdit(null)
    } catch (err) {
      console.error('Failed to update project', err)
      toast.error('Failed to update project')
    }
  }

  const toggleFavorite = async (e, project) => {
    try {
      const newStatus = !project.is_favorite
      await updateProject(token, project._id, { is_favorite: newStatus })
      setProjects(prev => prev.map(p => p._id === project._id ? { ...p, is_favorite: newStatus } : p))
      toast.success(newStatus ? 'Added to favorites' : 'Removed from favorites')
    } catch (err) {
      console.error('Failed to update favorite status', err)
      toast.error('Failed to update favorite status')
    }
  }

  const handleEditInit = (e, project) => {
    setEditTitle(project.project_title)
    setProjectToEdit(project)
  }

  const handleDeleteInit = (e, project) => {
    setProjectToDelete(project)
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="h-5 w-5 rounded-full border-2 border-ink border-t-transparent animate-spin" />
      </div>
    )
  }

  const featuredProject = projects[0]
  const listProjects = projects.slice(1)
  const firstName = user?.name?.split(' ')[0] || 'there'

  return (
    <div className="flex-1 flex flex-col h-full bg-background relative overflow-hidden">
      <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden p-6 md:p-12 lg:px-16 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {projects.length === 0 ? (
          <EmptyState onNewProject={() => setIsCreateModalOpen(true)} />
        ) : (
          <div className="w-full max-w-6xl mx-auto pb-24">

            {/* Welcome header */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
            >
              <div>
                <h1 className="text-[48px] md:text-[64px] font-[480] tracking-[-0.04em] leading-[1.1] text-ink">
                  {getGreeting()},<br /><span className="text-ink-muted">{firstName}.</span>
                </h1>
              </div>
              <motion.button
                layoutId="new-project-surface"
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-[14px] font-[480] text-canvas hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 focus-visible:ring-offset-2 whitespace-nowrap self-start md:self-auto"
              >
                <Plus className="h-3.5 w-3.5" />
                New Project
              </motion.button>
            </motion.div>

            {/* Featured / most-recent project */}
            {featuredProject && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                className="mb-12"
              >
                <FeaturedProject
                  project={featuredProject}
                  index={0}
                  onToggleFavorite={toggleFavorite}
                  onEdit={handleEditInit}
                  onDelete={handleDeleteInit}
                />
              </motion.div>
            )}

            {/* Recent Projects grid */}
            {listProjects.length > 0 && (
              <div className="mt-8">
                {/* Section header */}
                <div className="flex items-center justify-between mb-4 px-0.5">
                  <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-[11px] font-mono tracking-[0.12em] uppercase text-ink-muted/70"
                  >
                    Recent Projects
                  </motion.h2>
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.25, duration: 0.5 }}
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[12px] font-[480] text-ink-muted hover:text-ink hover:bg-surface-soft border border-transparent hover:border-hairline transition-all"
                  >
                    <Plus className="h-3 w-3" />
                    New
                  </motion.button>
                </div>

                {/* Card grid */}
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { staggerChildren: 0.05, delayChildren: 0.2 }
                    }
                  }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
                >
                  {listProjects.map((project, i) => (
                    <motion.div
                      key={project._id}
                      variants={{
                        hidden: { opacity: 0, y: 12 },
                        visible: { opacity: 1, y: 0, transition: { ease: 'easeOut', duration: 0.45 } }
                      }}
                    >
                      <ProjectCard
                        project={project}
                        index={i + 1}
                        onToggleFavorite={toggleFavorite}
                        onEdit={handleEditInit}
                        onDelete={handleDeleteInit}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            )}
          </div>
        )}
      </div>

      <CreateProjectDialog
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={(prompt) => {
          setIsCreateModalOpen(false)
          handleNewProject(prompt)
        }}
      />

      {/* Delete Modal */}
      <Modal
        isOpen={!!projectToDelete}
        onClose={() => setProjectToDelete(null)}
        title="Delete Project"
      >
        <p className="text-ink-muted text-[16px] font-[320] mb-8 leading-relaxed">
          Are you sure you want to delete <span className="font-[480] text-ink">"{projectToDelete?.project_title}"</span>? This action cannot be undone and will permanently remove all data associated with it.
        </p>
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={() => setProjectToDelete(null)}
            className="px-5 py-2.5 text-[15px] font-[480] text-ink bg-surface hover:bg-surface-soft border border-hairline rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
          >
            Cancel
          </button>
          <button
            onClick={confirmDelete}
            className="px-5 py-2.5 text-[15px] font-[480] text-canvas bg-destructive hover:bg-destructive/90 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/30 shadow-sm"
          >
            Permanently Delete
          </button>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!projectToEdit}
        onClose={() => setProjectToEdit(null)}
        title="Edit Project"
      >
        <div className="mb-8 mt-2">
          <label htmlFor="projectTitle" className="block text-[14px] font-[540] text-ink mb-3 uppercase tracking-wider">Project Title</label>
          <input
            id="projectTitle"
            type="text"
            autoFocus
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveEdit()
            }}
            className="w-full px-4 py-3 bg-surface border border-hairline rounded-xl text-[16px] font-[320] text-ink focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink/30 transition-all placeholder:text-ink-muted/50"
            placeholder="Enter a memorable name..."
          />
        </div>
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={() => setProjectToEdit(null)}
            className="px-5 py-2.5 text-[15px] font-[480] text-ink bg-surface hover:bg-surface-soft border border-hairline rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
          >
            Cancel
          </button>
          <button
            onClick={saveEdit}
            disabled={!editTitle.trim() || editTitle === projectToEdit?.project_title}
            className="px-5 py-2.5 text-[15px] font-[480] text-canvas bg-ink hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 shadow-sm"
          >
            Save Changes
          </button>
        </div>
      </Modal>
    </div>
  )
}
