import { EmptyProjects } from '@/features/project/ui/EmptyProjects'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { createProject, getProjects, deleteProject, updateProject } from '@/features/project/api/projects.api'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Modal } from '@/components/ui/Modal'
import { motion } from 'framer-motion'
import { Folder, ArrowRight, Trash2, Pencil, Star, ArrowUpRight } from 'lucide-react'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function FeaturedProject({ project, onToggleFavorite, onEdit, onDelete }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className="group relative flex flex-col md:flex-row items-start md:items-center justify-between p-8 rounded-3xl border border-hairline bg-surface-elevated transition-colors hover:bg-surface-soft/40 overflow-hidden gap-6"
    >
      <Link 
        to={`/projects/${project._id}`} 
        className="absolute inset-0 z-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 focus-visible:ring-offset-2" 
        aria-label={`Open project ${project.project_title}`}
      />
      
      <div className="relative z-10 flex flex-col pointer-events-none flex-1 min-w-0">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted mb-3 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-ink animate-pulse shrink-0" />
          Continue working
        </span>
        <h3 className="text-[32px] md:text-[40px] leading-[1.1] font-[480] text-ink tracking-[-0.04em] mb-3 truncate w-full">{project.project_title}</h3>
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

function ProjectRow({ project, index, onToggleFavorite, onEdit, onDelete }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 + (index * 0.05) }}
      className="group relative flex items-center justify-between py-5 border-b border-hairline/50 hover:bg-surface-soft/40 transition-colors px-4 -mx-4 rounded-xl gap-4"
    >
       <Link 
        to={`/projects/${project._id}`} 
        className="absolute inset-0 z-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30" 
      />
      <div className="relative z-10 flex items-center gap-5 pointer-events-none flex-1 min-w-0">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-soft text-ink border border-hairline transition-colors group-hover:bg-background shrink-0">
          <Folder className="h-5 w-5" />
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <h4 className="text-[18px] font-[480] text-ink tracking-tight truncate">{project.project_title}</h4>
          <span className="text-[14px] font-[320] text-ink-muted mt-0.5 truncate">Opened {new Date(project.last_opened_at || project.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="relative z-10 flex items-center gap-4 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 shrink-0">
        <div className="flex items-center gap-1">
          <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleFavorite(e, project) }} className={`p-2.5 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 ${project.is_favorite ? 'text-amber-500 bg-amber-500/10' : 'text-ink-muted hover:text-ink hover:bg-surface-soft'}`}>
            <Star className="h-4 w-4" fill={project.is_favorite ? 'currentColor' : 'none'} />
          </button>
          <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(e, project) }} className="p-2.5 text-ink-muted hover:text-ink hover:bg-surface-soft rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30">
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(e, project) }} className="p-2.5 text-ink-muted hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/30">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-surface-soft/0 group-hover:bg-surface-soft transition-colors pointer-events-none shrink-0">
          <ArrowUpRight className="h-5 w-5 text-ink-muted group-hover:text-ink transform md:group-hover:translate-x-0.5 md:group-hover:-translate-y-0.5 transition-all duration-300 ease-out" />
        </div>
      </div>
    </motion.div>
  )
}

export function Overview() {
  const navigate = useNavigate()
  const { token, user } = useAuth()
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Modal states
  const [projectToDelete, setProjectToDelete] = useState(null)
  const [projectToEdit, setProjectToEdit] = useState(null)
  const [editTitle, setEditTitle] = useState('')

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

  const handleNewProject = async () => {
    try {
      const res = await createProject(token, { project_title: 'Untitled Project' })
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
    return <div className="flex-1 flex items-center justify-center"><div className="h-6 w-6 rounded-full border-2 border-ink border-t-transparent animate-spin" /></div>
  }

  const featuredProject = projects[0]
  const listProjects = projects.slice(1)
  const firstName = user?.name?.split(' ')[0] || 'there'

  return (
    <div className="flex-1 flex flex-col h-full bg-background relative overflow-hidden">
      <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden p-6 md:p-12 lg:px-16 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {projects.length === 0 ? (
          <EmptyProjects onNewProject={handleNewProject} />
        ) : (
          <div className="w-full max-w-6xl mx-auto pb-24">
            
            {/* The Welcome Narrative */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
            >
              <div>
                <h1 className="text-[48px] md:text-[64px] font-[480] tracking-[-0.04em] leading-[1.1] text-ink">
                  {getGreeting()},<br/><span className="text-ink-muted">{firstName}.</span>
                </h1>
              </div>
              <button
                onClick={handleNewProject}
                className="flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-[16px] font-[480] text-canvas hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 focus-visible:ring-offset-2 whitespace-nowrap self-start md:self-auto"
              >
                New Project
              </button>
            </motion.div>
            
            {/* The Rhythm Break: Featured Canvas */}
            {featuredProject && (
              <div className="mb-12">
                <FeaturedProject 
                  project={featuredProject} 
                  onToggleFavorite={toggleFavorite}
                  onEdit={handleEditInit}
                  onDelete={handleDeleteInit}
                />
              </div>
            )}

            {/* The Density: List View */}
            {listProjects.length > 0 && (
              <div className="mt-8">
                <motion.h2 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="text-[14px] font-[540] uppercase tracking-wider text-ink-muted mb-4 px-2"
                >
                  All Projects
                </motion.h2>
                <div className="flex flex-col">
                  {listProjects.map((project, i) => (
                    <ProjectRow 
                      key={project._id} 
                      project={project} 
                      index={i} 
                      onToggleFavorite={toggleFavorite}
                      onEdit={handleEditInit}
                      onDelete={handleDeleteInit}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

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

