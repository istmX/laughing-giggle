import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, PenLine, ChevronLeft, ArrowRight } from 'lucide-react'

export function WizardDrawer({ questionText, options = [], onSubmit, isLoading, currentStep = 1, totalSteps = 10 }) {
  const [isCustomMode, setIsCustomMode] = useState(false)
  const [customAnswer, setCustomAnswer] = useState('')

  const handleSelectOption = (optVal) => {
    if (isLoading) return
    onSubmit(optVal)
  }

  const handleSubmitCustom = () => {
    if (isLoading || !customAnswer.trim()) return
    onSubmit(customAnswer.trim())
    setCustomAnswer('')
    setIsCustomMode(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
      {/* Dimmed Overlay Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-background/45 backdrop-blur-[2px] pointer-events-auto"
        onClick={() => {}} // Block clicks or allow dismiss if needed
      />

      {/* Slide-Up Bottom Sheet Drawer */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 26, stiffness: 220 }}
        className="relative w-[95vw] sm:w-[500px] bg-canvas border border-hairline rounded-t-[32px] p-6 pb-10 shadow-2xl pointer-events-auto z-10 flex flex-col min-w-0"
      >
        {/* Top Centered Handle Bar */}
        <div className="w-12 h-1 bg-hairline/80 rounded-full mx-auto mb-5 shrink-0" />

        {/* Header Section */}
        <div className="mb-6 w-full text-left">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-brand-indigo bg-brand-indigo/10 px-2 py-0.5 rounded">
              Question {currentStep} of {totalSteps}
            </span>
          </div>
          <h3 className="text-[20px] font-semibold tracking-tight text-ink mt-3 leading-snug">
            {questionText}
          </h3>
        </div>

        {/* Options Grid / Custom Input Area */}
        <div className="w-full">
          <AnimatePresence mode="wait">
            {!isCustomMode ? (
              <motion.div
                key="options"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="flex flex-col gap-2.5 w-full"
              >
                {/* 3 Brief options */}
                {options.slice(0, 3).map((opt, idx) => (
                  <button
                    key={idx}
                    disabled={isLoading}
                    onClick={() => handleSelectOption(opt)}
                    className="w-full text-left rounded-2xl border border-hairline bg-canvas hover:bg-surface-soft hover:border-ink/20 p-4 text-[13.5px] font-medium text-ink transition-all cursor-pointer flex items-center justify-between group disabled:opacity-40"
                  >
                    <span>{opt}</span>
                    <span className="h-4 w-4 rounded-full border border-hairline flex items-center justify-center shrink-0 group-hover:border-ink/40 transition-colors">
                      <span className="h-2 w-2 rounded-full bg-transparent group-active:bg-ink" />
                    </span>
                  </button>
                ))}

                {/* Option 4: Let Zenix decide */}
                <button
                  disabled={isLoading}
                  onClick={() => handleSelectOption('Let Zenix decide')}
                  className="w-full text-left rounded-2xl border border-hairline bg-ink text-canvas hover:opacity-90 p-4 text-[13.5px] font-medium transition-all cursor-pointer flex items-center gap-3 disabled:opacity-40"
                >
                  <Sparkles className="h-4.5 w-4.5 text-canvas animate-pulse" />
                  <span className="flex-1">Let Zenix decide</span>
                </button>

                {/* Option 5: Write my own answer */}
                <button
                  disabled={isLoading}
                  onClick={() => setIsCustomMode(true)}
                  className="w-full text-left rounded-2xl border border-dashed border-hairline bg-canvas hover:bg-surface-soft p-4 text-[13.5px] font-medium text-ink-muted hover:text-ink transition-all cursor-pointer flex items-center gap-3 disabled:opacity-40"
                >
                  <PenLine className="h-4.5 w-4.5 text-ink-muted/80" />
                  <span className="flex-1">Write my own answer</span>
                  <ArrowRight className="h-4 w-4 text-ink-muted/50" />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="custom"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="flex flex-col gap-4 w-full"
              >
                <textarea
                  value={customAnswer}
                  onChange={(e) => setCustomAnswer(e.target.value)}
                  disabled={isLoading}
                  placeholder="Type your custom specifications here..."
                  className="w-full min-h-[110px] rounded-2xl border border-hairline p-4 text-[14px] leading-relaxed outline-none resize-none bg-surface-soft focus:bg-canvas focus:border-ink/20 transition-all text-ink placeholder:text-ink-muted/30"
                  autoFocus
                />

                <div className="flex items-center justify-between gap-3 shrink-0">
                  <button
                    onClick={() => {
                      setIsCustomMode(false)
                      setCustomAnswer('')
                    }}
                    className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-ink-muted hover:text-ink transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back to options
                  </button>

                  <button
                    onClick={handleSubmitCustom}
                    disabled={isLoading || !customAnswer.trim()}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-ink px-6 text-[13px] font-semibold text-canvas hover:opacity-90 transition-opacity disabled:opacity-40 cursor-pointer"
                  >
                    Submit Answer
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
