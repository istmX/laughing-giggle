import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, X } from 'lucide-react'
import { useEffect, useRef } from 'react'

export function AuthErrorModal({ isOpen, onClose, errorMessage }) {
  const closeButtonRef = useRef(null)
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return undefined

    const previousOverflow = document.body.style.overflow
    const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 50)
    const handleEscape = (event) => {
      if (event.key === 'Escape') onCloseRef.current()
    }

    window.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'

    return () => {
      window.clearTimeout(focusTimer)
      window.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.button
            type="button"
            aria-label="Close authentication error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 cursor-default bg-ink/40 backdrop-blur-[2px]"
          />

          <div
            className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4"
            role="presentation"
          >
            <motion.div
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="error-modal-title"
              aria-describedby="error-modal-description"
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto relative w-[calc(100vw-2rem)] max-w-[28rem] shrink-0 rounded-[var(--radius-lg)] border border-hairline bg-canvas p-6 shadow-lg sm:p-8"
            >
              <button
                type="button"
                onClick={onClose}
                aria-label="Close authentication error"
                className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-surface-soft hover:text-ink focus-visible:ring-2 focus-visible:ring-ink/20"
              >
                <X className="size-4" aria-hidden="true" />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="flex size-12 items-center justify-center rounded-full bg-block-pink text-ink">
                  <AlertCircle className="size-6" aria-hidden="true" />
                </div>

                <h2 id="error-modal-title" className="mt-4 text-[20px] font-[var(--font-weight-540)] tracking-[-0.02em] text-ink">
                  Authentication error
                </h2>
                <p id="error-modal-description" className="mt-3 max-w-[30ch] text-[15px] leading-6 text-ink-muted">
                  {errorMessage || 'Something went wrong. Please try again.'}
                </p>

                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={onClose}
                  className="mt-6 h-12 w-full rounded-full bg-ink px-5 text-[15px] font-[var(--font-weight-480)] text-canvas transition-colors hover:bg-ink/85 focus-visible:ring-2 focus-visible:ring-ink/25"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
