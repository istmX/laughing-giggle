import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

const SUGGESTIONS = [
  {
    icon: '⚡',
    title: 'Real-time collaboration',
    desc: 'A collaborative markdown editor with live cursors and comments',
  },
  {
    icon: '📊',
    title: 'Analytics dashboard',
    desc: 'An inventory and analytics dashboard with charts and exports',
  },
  {
    icon: '💪',
    title: 'Fitness tracker',
    desc: 'A fitness tracking app with social features and habit streaks',
  },
  {
    icon: '💳',
    title: 'Finance manager',
    desc: 'A personal finance tracker with receipt scanning and budgets',
  },
]

/**
 * EmptyState — beautiful centered hero shown when no messages exist yet.
 * Includes a gradient icon, headline, subtitle, and 2×2 suggestion grid.
 */
export function EmptyState({ onSuggestion, projectDescription }) {
  const showCustomSuggestion = projectDescription && projectDescription.trim().length > 0;

  return (
    <div className="flex flex-col items-center justify-center h-full w-full px-4 pb-32 text-center">
      {/* Monochrome Brand Box Icon — Styled per Figma-design-analysis block system */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="mb-8 h-16 w-16 rounded-[24px] bg-ink flex items-center justify-center shadow-md shadow-ink/5"
      >
        <Sparkles className="h-8 w-8 text-canvas" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="text-2xl font-semibold tracking-tight text-ink mb-3"
      >
        Start describing your idea.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="text-base text-ink-muted leading-relaxed max-w-sm mb-10"
      >
        The AI will interview you, design the architecture,
        and generate your project context.
      </motion.p>

      {showCustomSuggestion && (
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          whileHover={{ scale: 1.01, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSuggestion(projectDescription)}
          className="text-left w-full max-w-lg p-5 rounded-2xl border-2 border-brand-indigo/35 bg-brand-indigo/5 hover:bg-brand-indigo/10 transition-colors mb-6 cursor-pointer group"
        >
          <span className="block text-xs font-mono font-bold text-brand-indigo uppercase tracking-wider mb-2">🚀 Start with Cockpit Description</span>
          <span className="block text-[14.5px] font-medium text-ink leading-relaxed line-clamp-2">
            {projectDescription}
          </span>
        </motion.button>
      )}

      {/* 2×2 suggestion grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.3 } },
        }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg"
      >
        {SUGGESTIONS.map((s, i) => (
          <motion.button
            key={i}
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 320, damping: 28 } },
            }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSuggestion(s.desc)}
            className="text-left p-4 rounded-xl border border-hairline bg-canvas hover:bg-surface-soft hover:border-ink/20 hover:shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/20 group cursor-pointer"
          >
            <span className="text-lg mb-1 block">{s.icon}</span>
            <span className="block text-sm font-medium text-ink mb-0.5 group-hover:text-ink">
              {s.title}
            </span>
            <span className="block text-xs text-ink-muted leading-relaxed">{s.desc}</span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  )
}
