import { motion } from 'framer-motion'
import { CheckCircle2, Loader2 } from 'lucide-react'

const GENERATION_STEPS = [
  'Analyzing specification...',
  'Generating architecture...',
  'Mapping agent configs...',
  'Writing UI rules...',
  'Finalizing context files...',
]

/**
 * GenerationProgress — animated checklist shown while artifacts are
 * being generated. Items stagger in; completed items fade to low opacity
 * with a green check. The active item shows an animated spinner.
 */
export function GenerationProgress({ artifacts = [] }) {
  // Derive step states from artifacts array
  const done = artifacts.filter((a) => a.content && a.content !== 'Pending generation...').length
  const total = artifacts.length || GENERATION_STEPS.length

  const steps = artifacts.length > 0
    ? artifacts.map((a) => ({
        label: a.file_path || 'Pending...',
        isDone: a.content && a.content !== 'Pending generation...',
      }))
    : GENERATION_STEPS.map((label, i) => ({
        label,
        isDone: false,
      }))

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -12 },
    visible: { opacity: 1, x: 0, transition: { ease: 'easeOut', duration: 0.35 } },
  }

  return (
    <div className="w-full">
      <p className="text-xs font-mono uppercase tracking-widest text-ink-muted mb-4">
        Building your project
      </p>
      <motion.div
        className="flex flex-col gap-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {steps.map((step, i) => {
          const isActive = !step.isDone && i === done
          return (
            <motion.div
              key={step.label + i}
              variants={itemVariants}
              className={`flex items-center gap-3 transition-opacity duration-500 ${step.isDone ? 'opacity-40' : 'opacity-100'}`}
            >
              {step.isDone ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              ) : isActive ? (
                <Loader2 className="h-4 w-4 shrink-0 text-ink-muted animate-spin" />
              ) : (
                <span className="h-4 w-4 shrink-0 rounded-full border border-hairline" />
              )}
              <span className={`text-sm ${step.isDone ? 'line-through text-ink-muted' : isActive ? 'text-ink font-medium' : 'text-ink-muted'}`}>
                {step.label}
                {isActive && (
                  <motion.span
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                    className="ml-1"
                  >
                    …
                  </motion.span>
                )}
              </span>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
