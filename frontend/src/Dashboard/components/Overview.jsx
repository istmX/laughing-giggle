import { FolderOpen, Plus } from 'lucide-react'
import { motion } from 'framer-motion'

export function Overview() {
  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-10 lg:p-16 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
        className="mx-auto max-w-4xl space-y-12"
      >
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-semibold tracking-tight text-ink">Welcome to Zenix</h1>
          <p className="text-xl text-ink-muted max-w-2xl leading-relaxed font-light">
            Select a project from the sidebar to pick up where you left off, or create a new workspace to get started.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 180, damping: 15 }}
            className="mb-10 flex items-center justify-center p-12 rounded-[32px] border border-hairline bg-surface-soft shadow-sm rotate-3 hover:rotate-0 transition-transform duration-500 ease-out"
          >
            <FolderOpen className="h-20 w-20 text-[#ff3d8b] -rotate-3 transition-transform duration-500" strokeWidth={1.5} />
          </motion.div>
          
          <motion.h3 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, type: "spring", stiffness: 400, damping: 25 }}
            className="text-2xl font-semibold text-ink mb-10 tracking-tight"
          >
            No projects yet
          </motion.h3>

          <motion.button 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 400, damping: 25 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            className="group flex items-center gap-3 rounded-full bg-[#ff3d8b] px-10 py-4 text-lg font-medium text-white hover:bg-[#e6367c] transition-colors shadow-sm hover:shadow-lg hover:shadow-[#ff3d8b]/20"
          >
            <Plus className="h-6 w-6 transition-transform group-hover:rotate-180 duration-500 ease-out" />
            Create a project
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}
