import { motion } from 'framer-motion'
import { Folder, ArrowRight, Trash2, Pencil, Star } from 'lucide-react'
import { Link } from 'react-router-dom'

export function ProjectCard({ project, index = 0, onToggleFavorite, onEdit, onDelete }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group relative flex flex-col items-start p-6 text-left rounded-2xl border border-hairline bg-surface-elevated transition-colors hover:bg-surface-soft/50 w-full min-w-0 overflow-hidden"
    >
      <Link 
        to={`/projects/${project._id}`} 
        className="absolute inset-0 z-0 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 focus-visible:ring-offset-2" 
        aria-label={`Open project ${project.project_title}`}
      />
      
      <div className="absolute top-4 right-4 flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10">
        <button 
          onClick={(e) => onToggleFavorite(e, project)} 
          className={`p-2 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 ${project.is_favorite ? 'text-amber-500 hover:bg-amber-500/10' : 'text-ink-muted hover:text-ink hover:bg-surface-soft'}`}
          title={project.is_favorite ? "Remove from Favorites" : "Add to Favorites"}
          aria-label="Toggle favorite"
        >
          <Star className="h-4 w-4" fill={project.is_favorite ? 'currentColor' : 'none'} />
        </button>
        <button 
          onClick={(e) => onEdit(e, project)} 
          className="p-2 text-ink-muted hover:text-ink hover:bg-surface-soft rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30" 
          title="Edit Title"
          aria-label="Edit project title"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button 
          onClick={(e) => onDelete(e, project)} 
          className="p-2 text-ink-muted hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/30" 
          title="Delete Project"
          aria-label="Delete project"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-soft text-ink border border-hairline mb-4 group-hover:bg-ink group-hover:text-canvas transition-colors relative z-10 pointer-events-none shrink-0">
        <Folder className="h-5 w-5" />
      </div>

      <h3 className="text-body-lg font-480 text-ink mb-1 pr-12 md:pr-24 relative z-10 pointer-events-none truncate w-full">{project.project_title}</h3>
      <div className="w-full">
        <p className="text-body-sm text-ink-muted line-clamp-2 mt-1 relative z-10 pointer-events-none w-full max-w-[60ch] block">
          {project.project_description || 'No description provided'}
        </p>
      </div>
      
      <div className="mt-6 flex items-center gap-2 text-xs font-540 text-ink-muted uppercase tracking-wider relative z-10 pointer-events-none">
        <span>{new Date(project.last_opened_at || project.createdAt).toLocaleDateString()}</span>
        <span className="h-1 w-1 rounded-full bg-hairline" />
        <span className="flex items-center gap-1 group-hover:text-ink transition-colors">
          Open <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </motion.div>
  )
}
