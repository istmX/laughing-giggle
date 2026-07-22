import { motion } from 'framer-motion'
import { ArrowUpRight, Folder, Pencil, Star, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'

const ACCENTS = ['bg-block-lilac', 'bg-block-mint', 'bg-block-coral', 'bg-block-cream']

function formatDate(value) {
  if (!value) return 'No activity yet'
  return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

export function ProjectCard({ project, index = 0, onToggleFavorite, onEdit, onDelete }) {
  const accent = ACCENTS[index % ACCENTS.length]

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex min-h-[248px] flex-col overflow-hidden rounded-[var(--radius-lg)] border border-hairline bg-canvas transition-transform hover:-translate-y-0.5"
    >
      <div className={`${accent} relative h-16 shrink-0`} aria-hidden="true">
        <div className="absolute -right-5 -top-9 size-28 rounded-full border-[10px] border-ink/10" />
        <div className="absolute bottom-3 left-5 flex size-9 items-center justify-center rounded-[var(--radius-md)] border border-ink/10 bg-canvas/55 text-ink">
          <Folder className="size-4" aria-hidden="true" />
        </div>
      </div>

      <Link
        to={`/projects/${project._id}`}
        className="absolute inset-0 z-0 rounded-[var(--radius-lg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 focus-visible:ring-offset-2"
        aria-label={`Open project ${project.project_title}`}
      />

      <div className="relative z-10 flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-[16px] font-[var(--font-weight-540)] tracking-[-0.02em] text-ink group-hover:underline group-hover:underline-offset-4">
              {project.project_title}
            </h3>
            <p className="mt-2 line-clamp-2 text-[13px] leading-5 text-ink-muted">
              {project.project_description || 'No description provided yet.'}
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-hairline bg-surface-soft px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-ink-muted">
            Project
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-6">
          <span className="text-[11px] text-ink-muted">Updated {formatDate(project.last_opened_at || project.createdAt)}</span>
          <span className="flex items-center gap-1 text-[12px] font-[var(--font-weight-480)] text-ink">
            Open <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </span>
        </div>
      </div>

      <div className="absolute right-3 top-20 z-20 flex items-center gap-1 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
        <button
          type="button"
          onClick={(event) => onToggleFavorite(event, project)}
          className={`flex size-9 items-center justify-center rounded-full bg-canvas/85 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 ${project.is_favorite ? 'text-ink' : 'text-ink-muted hover:text-ink'}`}
          title={project.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
          aria-label={project.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Star className="size-4" fill={project.is_favorite ? 'currentColor' : 'none'} aria-hidden="true" />
        </button>
        <button type="button" onClick={(event) => onEdit(event, project)} className="flex size-9 items-center justify-center rounded-full bg-canvas/85 text-ink-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30" title="Rename project" aria-label="Rename project">
          <Pencil className="size-4" aria-hidden="true" />
        </button>
        <button type="button" onClick={(event) => onDelete(event, project)} className="flex size-9 items-center justify-center rounded-full bg-canvas/85 text-ink-muted transition-colors hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/30" title="Delete project" aria-label="Delete project">
          <Trash2 className="size-4" aria-hidden="true" />
        </button>
      </div>
    </motion.article>
  )
}
