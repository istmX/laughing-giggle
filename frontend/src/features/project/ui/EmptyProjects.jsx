import { motion } from 'framer-motion'
import { FolderOpen } from 'lucide-react'

export function EmptyProjects({ onNewProject }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-background p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
        className="flex w-full max-w-[640px] flex-col items-center rounded-[var(--radius-lg)] bg-block-lime px-6 py-14 text-center sm:px-12"
      >
        <div className="mb-6 flex size-14 items-center justify-center rounded-full border border-ink/10 bg-canvas/55">
          <FolderOpen className="h-10 w-10 text-ink-muted" strokeWidth={1.5} />
        </div>
        <h2 className="mb-3 text-[24px] font-[var(--font-weight-540)] tracking-[-0.03em] text-ink">
          No projects yet
        </h2>
        <p className="mb-8 block w-full max-w-[52ch] text-[15px] leading-6 text-ink/70">
          Create your first project to start organizing context and generating architecture for your software ideas.
        </p>
        <button 
          onClick={onNewProject}
          className="h-11 rounded-full bg-ink px-6 text-[14px] font-[var(--font-weight-480)] text-canvas transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
        >
          New Project
        </button>
      </motion.div>
    </div>
  )
}
