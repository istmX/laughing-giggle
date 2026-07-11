import { motion } from 'framer-motion'
import { FolderOpen } from 'lucide-react'

export function EmptyProjects({ onNewProject }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
        className="flex w-full max-w-[512px] flex-col items-center text-center"
      >
        <div className="mb-6 rounded-full bg-surface-soft p-5 border border-hairline">
          <FolderOpen className="h-10 w-10 text-ink-muted" strokeWidth={1.5} />
        </div>
        <h2 className="text-headline tracking-headline font-semibold text-ink mb-3">
          No projects yet
        </h2>
        <p className="text-body tracking-body text-ink-muted mb-8 font-normal">
          Create your first project to start organizing context and generating architecture for your software ideas.
        </p>
        <button 
          onClick={onNewProject}
          className="rounded-full bg-primary px-6 py-3 text-button tracking-button font-medium text-primary-foreground hover:opacity-90 transition-opacity"
        >
          New Project
        </button>
      </motion.div>
    </div>
  )
}
