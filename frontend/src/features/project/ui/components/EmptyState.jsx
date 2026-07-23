import { motion } from 'framer-motion'
import { Sparkles, Zap, BarChart3, Activity, CreditCard } from 'lucide-react'

const SUGGESTIONS = [
  {
    icon: Zap,
    title: 'Real-time collaboration',
    desc: 'A collaborative markdown editor with live cursors and comments',
  },
  {
    icon: BarChart3,
    title: 'Analytics dashboard',
    desc: 'An inventory and analytics dashboard with charts and exports',
  },
  {
    icon: Activity,
    title: 'Fitness tracker',
    desc: 'A fitness tracking app with social features and habit streaks',
  },
  {
    icon: CreditCard,
    title: 'Finance manager',
    desc: 'A personal finance tracker with receipt scanning and budgets',
  },
]

/**
 * EmptyState — beautiful centered hero shown when no messages exist yet.
 * Includes a icon, headline, subtitle, and 2×2 suggestion grid.
 */
export function EmptyState({ onSuggestion, projectDescription }) {
  const showCustomSuggestion = projectDescription && projectDescription.trim().length > 0;

  return (
    <div className="flex flex-col items-center justify-center h-full w-full max-w-lg min-w-0 px-4 pb-32 text-center select-none">
      {/* Monochrome Brand Box Icon — Styled per Figma-design-analysis block system */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="mb-8 h-16 w-16 rounded-[24px] bg-ink flex items-center justify-center shadow-md shadow-ink/5"
      >
        <Sparkles className="h-8 w-8 text-canvas" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="text-2xl font-semibold tracking-tight text-ink mb-3"
      >
        Start describing your idea.
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="text-base text-ink-muted leading-relaxed max-w-sm mb-10"
      >
        The AI will interview you, design the architecture,
        and generate your project context.
      </motion.div>

      {showCustomSuggestion && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="w-full max-w-lg mb-6"
        >
          <button
            onClick={() => onSuggestion(projectDescription)}
            className="text-left w-full p-5 rounded-2xl border-2 border-brand-indigo/35 bg-brand-indigo/5 hover:bg-brand-indigo/10 transition-all duration-200 cursor-pointer group flex flex-col min-w-0"
          >
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles className="h-3.5 w-3.5 text-brand-indigo animate-pulse" />
              <span className="block text-[10px] font-mono font-bold text-brand-indigo uppercase tracking-wider">Start with Cockpit Description</span>
            </div>
            <div className="w-full min-w-0">
              <span className="block text-[14.5px] font-medium text-ink leading-relaxed line-clamp-2">
                {projectDescription}
              </span>
            </div>
          </button>
        </motion.div>
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
        {SUGGESTIONS.map((s, i) => {
          const Icon = s.icon
          return (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 320, damping: 28 } },
              }}
              className="w-full min-w-0"
            >
              <button
                onClick={() => onSuggestion(s.desc)}
                className="text-left p-5 rounded-xl border border-hairline bg-canvas hover:bg-surface-soft hover:border-ink/20 hover:shadow-sm transition-all duration-200 group cursor-pointer w-full min-w-0 flex flex-col justify-between h-full"
              >
                <div className="h-8 w-8 rounded bg-surface-soft flex items-center justify-center shrink-0 mb-4 border border-hairline/20">
                  <Icon className="h-4 w-4 text-ink-muted group-hover:text-brand-indigo transition-colors" />
                </div>
                <div className="w-full min-w-0">
                  <span className="block text-sm font-semibold text-ink mb-1 group-hover:text-ink">
                    {s.title}
                  </span>
                  <span className="block text-xs text-ink-muted leading-relaxed line-clamp-2">{s.desc}</span>
                </div>
              </button>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
