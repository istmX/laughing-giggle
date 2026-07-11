import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'

export function ProjectCard({ name, status, updatedAt, onClick }) {
  const getStatusColor = () => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-block-lime text-ink'
      case 'archived':
        return 'bg-surface-muted text-ink-muted'
      case 'generating':
        return 'bg-block-lilac text-ink'
      default:
        return 'bg-surface-soft text-ink'
    }
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full group cursor-pointer rounded-lg border border-hairline bg-canvas p-6 shadow-sm hover:shadow-md hover:border-ink/20 transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-card-title tracking-card-title font-bold text-ink line-clamp-2">
          {name || 'Untitled Project'}
        </h3>
        <span className={`rounded-full px-2.5 py-1 text-caption tracking-caption font-normal uppercase ${getStatusColor()}`}>
          {status || 'Draft'}
        </span>
      </div>
      
      <div className="flex items-center text-body-sm tracking-body-sm font-normal text-ink-muted">
        <Clock className="mr-1.5 h-4 w-4" />
        <span>Updated {updatedAt || 'Just now'}</span>
      </div>
    </motion.div>
  )
}
