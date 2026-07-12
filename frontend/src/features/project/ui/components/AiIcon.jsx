import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

/**
 * AiIcon — 24×24 rounded-square with violet→indigo gradient.
 * Rocks slowly when `isAnimating` is true.
 * Respects prefers-reduced-motion via framer-motion's useReducedMotion().
 */
export function AiIcon({ isAnimating = false }) {
  const shouldReduceMotion = useReducedMotion()

  const animateProps = isAnimating && !shouldReduceMotion
    ? { rotate: [0, 10, -10, 0] }
    : { rotate: 0 }

  const transitionProps = isAnimating && !shouldReduceMotion
    ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
    : { duration: 0.2 }

  return (
    <motion.div
      className="h-6 w-6 rounded-[6px] shrink-0 flex items-center justify-center bg-ink shadow-sm"
      animate={animateProps}
      transition={transitionProps}
    >
      <Sparkles className="h-3 w-3 text-canvas" />
    </motion.div>
  )
}
