import { motion } from 'framer-motion'
import { CheckCircle2, FileText, Download, ArrowRight, Sparkles } from 'lucide-react'

/**
 * SpecReadyPanel — dedicated full-panel "spec complete" view.
 * Replaces the interview mode once the spec is generated,
 * before transitioning to dev chat. Shows the spec content
 * with a clear "Open workspace" CTA that moves the user forward.
 */
export function SpecReadyPanel({ specContent, onContinue, artifactCount = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="flex-1 flex flex-col items-center justify-center px-6 pb-36 w-full"
    >
      <div className="w-full max-w-2xl">
        {/* Success indicator with Block Mint background section styling */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          className="flex items-center gap-2 mb-6"
        >
          <div className="h-5 w-5 rounded-full bg-emerald-100 flex items-center justify-center">
            <CheckCircle2 className="h-3 w-3 text-emerald-800" />
          </div>
          <span className="text-[12px] font-medium text-emerald-800">Spec ready</span>
          {artifactCount > 0 && (
            <>
              <span className="text-hairline">·</span>
              <span className="text-[12px] text-ink-muted font-mono">{artifactCount} files generated</span>
            </>
          )}
        </motion.div>

        {/* Spec content card — Styled with figma block-mint background and ink border */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28, delay: 0.08 }}
          className="rounded-[24px] border border-ink/10 bg-surface-soft shadow-sm mb-6 overflow-hidden"
        >
          {/* Card header */}
          <div className="flex items-center justify-between px-6 py-3.5 border-b border-hairline/60 bg-canvas/40">
            <div className="flex items-center gap-2">
              <FileText className="h-3.5 w-3.5 text-ink-muted" />
              <span className="text-[12px] font-[480] text-ink-muted">Project Specification</span>
            </div>
          </div>

          {/* Spec body */}
          <div className="px-6 py-5 max-h-[340px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <pre className="whitespace-pre-wrap text-[13.5px] leading-[1.7] font-sans text-ink font-light">
              {typeof specContent === 'object'
                ? JSON.stringify(specContent, null, 2)
                : specContent}
            </pre>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28, delay: 0.15 }}
          className="flex flex-col items-center gap-3"
        >
          <p className="text-[13px] text-ink-muted text-center leading-relaxed w-full max-w-[60ch] block">
            Your project context has been generated. You can now ask Zenix to help build, refine, and expand it.
          </p>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onContinue}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink text-canvas text-[13px] font-medium hover:opacity-85 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 shadow-sm cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Open workspace
            <ArrowRight className="h-3.5 w-3.5" />
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  )
}
