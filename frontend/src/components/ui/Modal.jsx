import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'

export function Modal({ isOpen, onClose, title, children, accent = 'bg-block-lilac' }) {
  const modalRef = useRef(null)
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onCloseRef.current()
    }
    
    // Simple focus trap
    const handleTab = (e) => {
      if (e.key !== 'Tab' || !modalRef.current) return
      
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      
      if (focusableElements.length === 0) return
      
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus()
          e.preventDefault()
        }
      }
    }

    if (isOpen) {
      window.addEventListener('keydown', handleEscape)
      window.addEventListener('keydown', handleTab)
      const previousOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      
      // Auto-focus first focusable element on open
      const focusTimer = setTimeout(() => {
        if (modalRef.current) {
          const focusable = modalRef.current.querySelector('input, button')
          if (focusable) focusable.focus()
        }
      }, 50)
      return () => {
        window.removeEventListener('keydown', handleEscape)
        window.removeEventListener('keydown', handleTab)
        window.clearTimeout(focusTimer)
        document.body.style.overflow = previousOverflow
      }
    }
    return () => {
      window.removeEventListener('keydown', handleEscape)
      window.removeEventListener('keydown', handleTab)
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          />
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="pointer-events-auto mx-4 flex w-[calc(100vw-2rem)] max-w-[32rem] flex-col overflow-hidden rounded-[var(--radius-lg)] border border-hairline bg-surface-elevated shadow-xl"
            >
              <div className={`${accent} flex items-center justify-between border-b border-ink/10 px-6 py-5`}>
                <h2 id="modal-title" className="text-[20px] font-[var(--font-weight-540)] tracking-[-0.03em] text-ink">{title}</h2>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close dialog"
                  className="flex size-10 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-white/50 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
