import { motion } from 'framer-motion'

/**
 * AiThinking — three animated dots that pulse in a stagger pattern
 * to indicate the AI is generating a response.
 */
export function AiThinking() {
  return (
    <div className="flex items-center gap-1.5 py-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="inline-block h-1.5 w-1.5 rounded-full bg-ink"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.2,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
