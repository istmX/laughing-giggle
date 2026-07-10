import { motion } from 'framer-motion'

export const Loader = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4" role="status" aria-label={text || "Loading"}>
      <motion.div
        aria-hidden="true"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className={`${sizeClasses[size]} border-2 border-ink/20 border-t-ink rounded-full`}
      />
      {text && <p className="text-caption font-mono uppercase tracking-caption text-ink-muted">{text}</p>}
    </div>
  )
}
