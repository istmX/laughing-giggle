import { useState, useEffect } from 'react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { getFavoriteProjects, updateProject, deleteProject } from '@/features/project/api/projects.api'
import { ProjectCard } from '@/features/project/ui/ProjectCard'
import { EmptyProjects } from '@/features/project/ui/EmptyProjects'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { Modal } from '@/components/ui/Modal'

export function FavoriteProjects() {
  const { token } = useAuth()
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Modal states
  const [projectToDelete, setProjectToDelete] = useState(null)
  const [projectToEdit, setProjectToEdit] = useState(null)
  const [editTitle, setEditTitle] = useState('')

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await getFavoriteProjects(token)
        setProjects(res?.data || [])
      } catch (err) {
        toast.error('Failed to load favorite projects')
      } finally {
        setIsLoading(false)
      }
    }
    fetchProjects()
  }, [token])

  const toggleFavorite = async (e, project) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const newStatus = !project.is_favorite
      await updateProject(token, project._id, { is_favorite: newStatus })
      setProjects(prev => prev.filter(p => p._id !== project._id))
      toast.success('Removed from favorites')
    } catch (err) {
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

  const confirmDelete = async () => {
    if (!projectToDelete) return
    try {
      await deleteProject(token, projectToDelete._id)
      setProjects((prev) => prev.filter(p => p._id !== projectToDelete._id))
      toast.success('Project deleted')
      setProjectToDelete(null)
    } catch (err) {
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
      toast.error('Failed to update project')
    }
  }

  if (isLoading) {
    return <div className="flex-1 flex items-center justify-center"><div className="h-6 w-6 rounded-full border-2 border-ink border-t-transparent animate-spin" /></div>
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-surface-soft/10">
      <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden p-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="w-full space-y-12">
          <div className="flex items-center justify-between">
            <h1 className="text-display-sm font-340 tracking-display-sm text-ink">Favorites</h1>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.length === 0 ? (
                <div className="col-span-full py-8 text-center text-ink-muted text-body-sm">
                  No favorite projects yet.
                </div>
              ) : (
                projects.map((project, i) => (
                  <ProjectCard 
                    key={project._id} 
                    project={project} 
                    index={i} 
                    onToggleFavorite={toggleFavorite}
                    onEdit={handleEditInit}
                    onDelete={handleDeleteInit}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={!!projectToDelete} onClose={() => setProjectToDelete(null)} title="Delete Project">
        <p className="text-ink-muted text-sm mb-6">Are you sure you want to delete <span className="font-semibold text-ink">"{projectToDelete?.project_title}"</span>?</p>
        <div className="flex items-center justify-end gap-3">
          <button onClick={() => setProjectToDelete(null)} className="px-4 py-2 text-sm font-medium text-ink bg-surface hover:bg-surface-soft border border-hairline rounded-lg">Cancel</button>
          <button onClick={confirmDelete} className="px-4 py-2 text-sm font-medium text-destructive-foreground bg-destructive hover:bg-destructive/90 rounded-lg">Delete</button>
        </div>
      </Modal>

      <Modal isOpen={!!projectToEdit} onClose={() => setProjectToEdit(null)} title="Edit Project Name">
        <div className="mb-6">
          <input type="text" autoFocus value={editTitle} onChange={(e) => setEditTitle(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && saveEdit()} className="w-full px-3 py-2 bg-background border border-hairline rounded-lg text-ink" placeholder="Enter project name..." />
        </div>
        <div className="flex items-center justify-end gap-3">
          <button onClick={() => setProjectToEdit(null)} className="px-4 py-2 text-sm font-medium text-ink bg-surface border border-hairline rounded-lg">Cancel</button>
          <button onClick={saveEdit} disabled={!editTitle.trim() || editTitle === projectToEdit?.project_title} className="px-4 py-2 text-sm font-medium text-canvas bg-ink rounded-lg disabled:opacity-50">Save Changes</button>
        </div>
      </Modal>
    </div>
  )
}
