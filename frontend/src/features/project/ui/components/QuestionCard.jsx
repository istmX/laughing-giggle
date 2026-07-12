import { useState, useRef, useEffect } from 'react'
import { ArrowRight, Sparkles, PenLine, ChevronLeft } from 'lucide-react'
import { ProgressIndicator } from './ProgressIndicator'
import { TextShimmerWave } from '@/components/ui/text-shimmer-wave'
import { motion } from 'framer-motion'

/**
 * QuestionCard — works with conversational AI questions.
 * `question` can be:
 *   - A string (new conversational format from AI)
 *   - An object { title, options } (legacy format)
 *   - An object { key, question, options } from the conversational agent
 */
export function QuestionCard({ currentStep, totalSteps, question, onSubmit, isLoading }) {
  const [answer, setAnswer] = useState('')
  const textareaRef = useRef(null)

  // Extract the question text and options regardless of format
  const questionText = typeof question === 'string'
    ? question
    : question?.question || question?.title || 'Tell us more about your project.'

  const aiOptions = question?.options || []
  const hasOptions = aiOptions.length > 0

  const [showCustomInput, setShowCustomInput] = useState(!hasOptions)
  const [selectedOptions, setSelectedOptions] = useState([])
  const [selectedOption, setSelectedOption] = useState(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      if (!hasOptions) {
        textareaRef.current.focus()
      }
    }
  }, [hasOptions])

  const handleInput = (e) => {
    setAnswer(e.target.value)
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  const handleSubmit = () => {
    if (!answer.trim() || isLoading) return
    onSubmit(answer.trim())
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleSelectOption = (optVal) => {
    const normalized = optVal.toLowerCase()
    const isSpecial = normalized.includes('zenix decide') || 
                      normalized.includes('ai decide') || 
                      normalized.includes('no other details') || 
                      normalized.includes('generate the final spec')
    
    if (isSpecial) {
      setSelectedOption(optVal)
      setSelectedOptions([])
      setAnswer(optVal)
      // Auto submit special option immediately to save user effort
      onSubmit(optVal)
    } else {
      setSelectedOption(null)
      const isSelected = selectedOptions.includes(optVal)
      const next = isSelected ? selectedOptions.filter((o) => o !== optVal) : [...selectedOptions, optVal]
      setSelectedOptions(next)
      setAnswer(next.join(', '))
    }
  }

  const handleWriteOwn = () => {
    setShowCustomInput(true)
    setSelectedOption(null)
    setSelectedOptions([])
    setAnswer('')
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus()
      }
    }, 50)
  }

  const handleBackToOptions = () => {
    setShowCustomInput(false)
    setSelectedOption(null)
    setSelectedOptions([])
    setAnswer('')
  }

  const isSubmitDisabled = !answer.trim() || isLoading

  // Detect filler questions (wrap-up questions asking if there is anything else)
  const isFillerQuestion = questionText.toLowerCase().includes('anything else') || 
                           questionText.toLowerCase().includes('other details') || 
                           questionText.toLowerCase().includes('any other things') || 
                           questionText.toLowerCase().includes('other features')

  const hasAiZenixDecide = aiOptions.some(opt => 
    opt.toLowerCase().includes('zenix decide') || 
    opt.toLowerCase().includes('ai decide')
  )

  const renderDecideAllButton = () => {
    if (currentStep < 10) return null;
    return (
      <button
        onClick={() => onSubmit("Let Zenix decide for all remaining")}
        disabled={isLoading}
        className="w-full text-left rounded-xl border border-dashed border-brand-indigo/30 bg-brand-indigo/[0.01] px-6 py-4 text-body-sm font-normal text-brand-indigo hover:text-brand-indigo hover:bg-brand-indigo/[0.03] hover:border-brand-indigo/50 transition-all flex items-center gap-3 group disabled:opacity-50 mt-3 animate-fade-in"
      >
        <Sparkles className="h-4 w-4 shrink-0 text-brand-indigo animate-pulse" />
        <span className="flex-1 font-medium">Let Zenix decide all remaining questions</span>
        <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
      </button>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full flex flex-col"
    >
      <div className="mb-8">
        <ProgressIndicator current={currentStep} total={totalSteps} />
        <h2 className="text-[40px] leading-[1.1] font-semibold tracking-tight text-ink mt-6 mb-4">
          {questionText}
        </h2>
        <p className="text-body text-ink-muted">
          {showCustomInput
            ? "Be as specific as you like — the more detail, the better the output."
            : "Choose one or more suggested options or write your own answer."}
        </p>
      </div>

      {!showCustomInput && hasOptions ? (
        <div className="flex flex-col gap-3">
          {aiOptions.map((opt, idx) => {
            const isSelected = selectedOptions.includes(opt) || selectedOption === opt
            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(opt)}
                disabled={isLoading}
                className={`w-full text-left rounded-xl border px-6 py-4 text-body-sm font-normal transition-all flex items-center justify-between group disabled:opacity-50 ${
                  isSelected
                    ? 'border-ink bg-ink/[0.03] ring-4 ring-ink/5 text-ink font-medium'
                    : 'border-hairline bg-canvas text-ink-muted hover:text-ink hover:border-ink/20 hover:bg-ink/[0.01]'
                }`}
              >
                <span>{opt}</span>
                <div className="flex items-center gap-2">
                  {isSelected && <span className="text-caption text-ink-muted mr-1">(Selected)</span>}
                  <span className={`h-2.5 w-2.5 rounded-sm border border-ink/30 transition-all ${isSelected ? 'bg-ink scale-100' : 'bg-transparent scale-100 group-hover:border-ink'}`} />
                </div>
              </button>
            )
          })}

          {!hasAiZenixDecide && (
            <button
              onClick={() => handleSelectOption("Let Zenix decide")}
              disabled={isLoading}
              className={`w-full text-left rounded-xl border px-6 py-4 text-body-sm font-normal transition-all flex items-center gap-3 group disabled:opacity-50 ${
                selectedOption === "Let Zenix decide"
                  ? 'border-ink bg-ink/[0.03] ring-4 ring-ink/5 text-ink font-medium'
                  : 'border-hairline bg-canvas text-ink-muted hover:text-ink hover:border-ink/20 hover:bg-ink/[0.01]'
              }`}
            >
              <Sparkles className="h-4 w-4 shrink-0 opacity-70" />
              <span className="flex-1">Let Zenix decide</span>
              <span className={`h-2.5 w-2.5 rounded-full bg-ink transition-transform ${selectedOption === "Let Zenix decide" ? 'scale-100' : 'scale-0 group-hover:scale-50'}`} />
            </button>
          )}

          {isFillerQuestion && (
            <button
              onClick={() => handleSelectOption("I have no other details, please generate the final spec")}
              disabled={isLoading}
              className="w-full text-left rounded-xl border border-dashed border-ink-muted/30 bg-canvas px-6 py-4 text-body-sm font-normal text-ink hover:text-ink hover:bg-ink/[0.02] hover:border-ink/50 transition-all flex items-center gap-3 group disabled:opacity-50"
            >
              <ArrowRight className="h-4 w-4 shrink-0 opacity-70 text-ink" />
              <span className="flex-1 font-medium">Skip and generate final spec now</span>
              <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
            </button>
          )}

          <button
            onClick={handleWriteOwn}
            disabled={isLoading}
            className="w-full text-left rounded-xl border border-hairline border-dashed bg-canvas px-6 py-4 text-body-sm font-normal text-ink-muted hover:text-ink hover:border-ink/20 hover:bg-ink/[0.01] transition-all flex items-center gap-3 group disabled:opacity-50"
          >
            <PenLine className="h-4 w-4 shrink-0 opacity-70" />
            <span className="flex-1">Write my own answer</span>
            <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
          </button>

          {renderDecideAllButton()}
        </div>
      ) : (
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={answer}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="Type your answer..."
            rows={3}
            className="w-full resize-none rounded-xl border border-hairline bg-canvas p-6 text-body-lg tracking-body-lg font-normal text-ink placeholder:text-ink-faint focus:border-ink/30 focus:outline-none focus:ring-4 focus:ring-ink/5 transition-all shadow-sm disabled:opacity-50"
          />

          {hasOptions && (
            <button
              onClick={handleBackToOptions}
              disabled={isLoading}
              className="mt-3 inline-flex items-center gap-1.5 text-caption tracking-caption font-medium text-ink-muted hover:text-ink transition-colors"
            >
              <ChevronLeft className="h-3 w-3" />
              Back to suggested options
            </button>
          )}

          {renderDecideAllButton()}
        </div>
      )}

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 min-w-[160px] text-button font-medium text-canvas hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed group"
        >
          {isLoading ? (
            <TextShimmerWave
              className="text-button font-medium [--base-color:rgba(255,255,255,0.4)] [--base-gradient-color:#ffffff]"
              duration={1}
              spread={1}
              zDistance={1}
              yDistance={-1}
            >
              Thinking...
            </TextShimmerWave>
          ) : (
            <>
              Continue
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}
