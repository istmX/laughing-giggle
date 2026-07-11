import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

const EXAMPLES = [
  "AI CRM for agencies",
  "Modern expense tracker",
  "SaaS for gym management",
  "Developer portfolio builder"
]

export function CreateProjectDialog({ isOpen, onClose, onSubmit }) {
  const [prompt, setPrompt] = useState('')
  const textareaRef = useRef(null)

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus()
      setPrompt('')
    }
  }, [isOpen])

  const handleInput = (e) => {
    setPrompt(e.target.value)
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-overlay-scrim/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
              className="w-full max-w-[672px] overflow-hidden rounded-xl bg-canvas shadow-xl border border-hairline pointer-events-auto"
            >
              <div className="flex items-center justify-between border-b border-hairline px-6 py-4">
                <div>
                  <h2 className="text-headline tracking-headline font-semibold text-ink">New Project</h2>
                  <p className="text-body-sm tracking-body-sm text-ink-muted mt-1 font-normal">
                    Describe your software idea. We'll generate the initial architecture.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-full p-2 text-ink-muted hover:bg-surface-soft hover:text-ink transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6">
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    value={prompt}
                    onChange={handleInput}
                    placeholder="Describe your software idea..."
                    className="w-full min-h-[160px] resize-none rounded-md border border-hairline bg-canvas p-[14px] text-body tracking-body font-normal text-ink placeholder:text-ink-faint focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink transition-all"
                  />
                  <div className="absolute bottom-4 right-4 text-caption tracking-caption text-ink-faint">
                    {prompt.length} chars
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {EXAMPLES.map((ex) => (
                    <button
                      key={ex}
                      onClick={() => setPrompt(ex)}
                      className="rounded-sm border border-hairline-soft bg-surface-soft px-3 py-1.5 text-body-sm tracking-body-sm text-ink-muted font-normal hover:border-hairline hover:text-ink transition-colors"
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-hairline px-6 py-4 bg-surface-soft/50">
                <button
                  onClick={onClose}
                  className="rounded-lg bg-canvas px-4 py-2 text-button tracking-button font-medium text-ink border border-hairline hover:bg-surface-soft transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => onSubmit(prompt)}
                  disabled={!prompt.trim()}
                  className="rounded-lg bg-primary px-5 py-2.5 text-button tracking-button font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Generate Context
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
