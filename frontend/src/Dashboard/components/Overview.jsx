import { EmptyProjects } from '@/features/project/ui/EmptyProjects'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { createProject, getProjects, deleteProject, updateProject } from '@/features/project/api/projects.api'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Folder, ArrowRight, Trash2, Pencil } from 'lucide-react'
import toast from 'react-hot-toast'
import { Modal } from '@/components/ui/Modal'
import { Link } from 'react-router-dom'

export function Overview() {
  const navigate = useNavigate()
  const { token } = useAuth()
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
        setProjects(res?.data || [])
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

  if (isLoading) {
    return <div className="flex-1 flex items-center justify-center"><div className="h-6 w-6 rounded-full border-2 border-ink border-t-transparent animate-spin" /></div>
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-surface-soft/30">
      <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden p-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {projects.length === 0 ? (
          <EmptyProjects onNewProject={handleNewProject} />
        ) : (
          <div className="w-full space-y-8">
            <div className="flex items-center justify-between">
              <h1 className="text-display-sm font-340 tracking-display-sm text-ink">Projects</h1>
              <button
                onClick={handleNewProject}
                className="flex items-center gap-2 rounded-lg bg-ink px-4 py-2 text-sm font-540 text-canvas hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 focus-visible:ring-offset-2"
              >
                New Project
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project, i) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group relative flex flex-col items-start p-6 text-left rounded-2xl border border-hairline bg-surface-elevated transition-colors hover:bg-surface-soft/50"
                >
                  <Link 
                    to={`/projects/${project._id}`} 
                    className="absolute inset-0 z-0 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 focus-visible:ring-offset-2" 
                    aria-label={`Open project ${project.project_title}`}
                  />
                  
                  <div className="absolute top-4 right-4 flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10">
                    <button 
                      onClick={(e) => {
                        e.preventDefault()
                        setEditTitle(project.project_title)
                        setProjectToEdit(project)
                      }} 
                      className="p-2 text-ink-muted hover:text-ink hover:bg-surface-soft rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30" 
                      title="Edit Title"
                      aria-label="Edit project title"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.preventDefault()
                        setProjectToDelete(project)
                      }} 
                      className="p-2 text-ink-muted hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/30" 
                      title="Delete Project"
                      aria-label="Delete project"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-soft text-ink border border-hairline mb-4 group-hover:bg-ink group-hover:text-canvas transition-colors relative z-10 pointer-events-none">
                    <Folder className="h-5 w-5" />
                  </div>

                  <h3 className="text-body-lg font-480 text-ink mb-1 pr-16 relative z-10 pointer-events-none">{project.project_title}</h3>
                  <p className="text-body-sm text-ink-muted line-clamp-2 mt-1 relative z-10 pointer-events-none">
                    {project.project_description || 'No description provided'}
                  </p>
                  
                  <div className="mt-6 flex items-center gap-2 text-xs font-540 text-ink-muted uppercase tracking-wider relative z-10 pointer-events-none">
                    <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                    <span className="h-1 w-1 rounded-full bg-hairline" />
                    <span className="flex items-center gap-1 group-hover:text-ink transition-colors">
                      Open <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <Modal 
        isOpen={!!projectToDelete} 
        onClose={() => setProjectToDelete(null)}
        title="Delete Project"
      >
        <p className="text-ink-muted text-sm mb-6">
          Are you sure you want to delete <span className="font-semibold text-ink">"{projectToDelete?.project_title}"</span>? This action cannot be undone.
        </p>
        <div className="flex items-center justify-end gap-3">
          <button 
            onClick={() => setProjectToDelete(null)}
            className="px-4 py-2 text-sm font-medium text-ink bg-surface hover:bg-surface-soft border border-hairline rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
          >
            Cancel
          </button>
          <button 
            onClick={confirmDelete}
            className="px-4 py-2 text-sm font-medium text-destructive-foreground bg-destructive hover:bg-destructive/90 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/30"
          >
            Delete
          </button>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal 
        isOpen={!!projectToEdit} 
        onClose={() => setProjectToEdit(null)}
        title="Edit Project Name"
      >
        <div className="mb-6">
          <label htmlFor="projectTitle" className="block text-sm font-medium text-ink mb-2">Project Title</label>
          <input
            id="projectTitle"
            type="text"
            autoFocus
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveEdit()
            }}
            className="w-full px-3 py-2 bg-background border border-hairline rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-ink/20 transition-all"
            placeholder="Enter project name..."
          />
        </div>
        <div className="flex items-center justify-end gap-3">
          <button 
            onClick={() => setProjectToEdit(null)}
            className="px-4 py-2 text-sm font-medium text-ink bg-surface hover:bg-surface-soft border border-hairline rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={saveEdit}
            disabled={!editTitle.trim() || editTitle === projectToEdit?.project_title}
            className="px-4 py-2 text-sm font-medium text-canvas bg-ink hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all"
          >
            Save Changes
          </button>
        </div>
      </Modal>
    </div>
  )
}
