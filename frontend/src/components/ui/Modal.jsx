import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'

export function Modal({ isOpen, onClose, title, children }) {
  const modalRef = useRef(null)

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
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
      document.body.style.overflow = 'hidden'
      
      // Auto-focus first focusable element on open
      setTimeout(() => {
        if (modalRef.current) {
          const focusable = modalRef.current.querySelector('input, button')
          if (focusable) focusable.focus()
        }
      }, 50)
    }
    return () => {
      window.removeEventListener('keydown', handleEscape)
      window.removeEventListener('keydown', handleTab)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

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
              className="w-full max-w-2xl rounded-2xl border border-hairline bg-surface-elevated shadow-xl pointer-events-auto flex flex-col mx-4"
            >
              <div className="flex items-center justify-between border-b border-hairline/50 px-6 py-4">
                <h2 id="modal-title" className="text-lg font-semibold text-ink">{title}</h2>
                <button
                  onClick={onClose}
                  aria-label="Close dialog"
                  className="rounded-md p-2 text-ink-muted hover:bg-surface-soft hover:text-ink transition-colors"
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
