import { EmptyProjects } from '@/features/project/ui/EmptyProjects'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { createProject, getProjects, deleteProject, updateProject } from '@/features/project/api/projects.api'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Modal } from '@/components/ui/Modal'
import { ProjectCard } from '@/features/project/ui/ProjectCard'

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

  const toggleFavorite = async (e, project) => {
    e.preventDefault()
    e.stopPropagation()
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
    e.preventDefault()
    setEditTitle(project.project_title)
    setProjectToEdit(project)
  }

  const handleDeleteInit = (e, project) => {
    e.preventDefault()
    setProjectToDelete(project)
  }

  if (isLoading) {
    return <div className="flex-1 flex items-center justify-center"><div className="h-6 w-6 rounded-full border-2 border-ink border-t-transparent animate-spin" /></div>
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-surface-soft/10">
      <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden p-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {projects.length === 0 ? (
          <EmptyProjects onNewProject={handleNewProject} />
        ) : (
          <div className="w-full space-y-12">
            <div className="flex items-center justify-between">
              <h1 className="text-display-sm font-340 tracking-display-sm text-ink">All Projects</h1>
              <button
                onClick={handleNewProject}
                className="flex items-center gap-2 rounded-lg bg-ink px-4 py-2 text-sm font-540 text-canvas hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 focus-visible:ring-offset-2"
              >
                New Project
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project, i) => (
                <ProjectCard 
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
