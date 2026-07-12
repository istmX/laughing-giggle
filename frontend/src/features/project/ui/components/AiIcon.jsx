import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

/**
 * AiIcon — small 24×24 rounded-square with violet→indigo gradient.
 * Spins slowly when `isAnimating` is true (AI is generating).
 */
export function AiIcon({ isAnimating = false }) {
  return (
    <motion.div
      className="h-6 w-6 rounded-[6px] shrink-0 flex items-center justify-center bg-gradient-to-br from-violet-500 to-indigo-500 shadow-sm"
      animate={isAnimating ? { rotate: [0, 10, -10, 0] } : { rotate: 0 }}
      transition={
        isAnimating
          ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
          : { duration: 0.2 }
      }
    >
      <Sparkles className="h-3 w-3 text-white" />
    </motion.div>
  )
}
