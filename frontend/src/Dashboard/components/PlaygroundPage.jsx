import { EmptyProjects } from '@/features/project/ui/EmptyProjects'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { getProjects } from '@/features/project/api/projects.api'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Folder, ArrowRight, PlaySquare } from 'lucide-react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

export function PlaygroundPage() {
  const navigate = useNavigate()
  const { token } = useAuth()
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)

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

  if (isLoading) {
    return <div className="flex-1 flex items-center justify-center"><div className="h-6 w-6 rounded-full border-2 border-ink border-t-transparent animate-spin" /></div>
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-surface-soft/30">
      <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden p-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {projects.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <div className="h-16 w-16 bg-surface border border-hairline rounded-2xl flex items-center justify-center mb-6">
              <PlaySquare className="h-8 w-8 text-ink-muted" />
            </div>
            <h2 className="text-2xl font-semibold text-ink mb-2">Welcome to AI Playground</h2>
            <p className="text-ink-muted mb-8 text-sm">
              You need a project to enter the AI Playground. Go to Projects to create one first.
            </p>
            <Link to="/dashboard" className="rounded-lg bg-ink px-6 py-3 text-sm font-medium text-canvas hover:opacity-90 transition-opacity">
              Go to Projects
            </Link>
          </div>
        ) : (
          <div className="w-full space-y-8 max-w-5xl mx-auto">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-surface border border-hairline rounded-lg">
                  <PlaySquare className="h-5 w-5 text-ink" />
                </div>
                <h1 className="text-display-sm font-340 tracking-display-sm text-ink">AI Playground</h1>
              </div>
              <p className="text-ink-muted text-base">Select a project below to enter the sandbox and start generating architecture, UI rules, and artifacts.</p>
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
                    aria-label={`Enter playground for ${project.project_title}`}
                  />
                  
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-soft text-ink border border-hairline mb-4 group-hover:bg-ink group-hover:text-canvas transition-colors relative z-10 pointer-events-none">
                    <Folder className="h-5 w-5" />
                  </div>

                  <h3 className="text-body-lg font-480 text-ink mb-1 relative z-10 pointer-events-none">{project.project_title}</h3>
                  <p className="text-body-sm text-ink-muted line-clamp-2 mt-1 relative z-10 pointer-events-none">
                    {project.project_description || 'No description provided'}
                  </p>
                  
                  <div className="mt-6 flex items-center gap-2 text-xs font-540 text-ink-muted uppercase tracking-wider relative z-10 pointer-events-none">
                    <span className="flex items-center gap-1 group-hover:text-ink transition-colors">
                      Enter Playground <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
