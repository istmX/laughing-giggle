import { useState, useRef, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import { ProgressIndicator } from './ProgressIndicator'
import { TextShimmerWave } from '@/components/ui/text-shimmer-wave'

/**
 * QuestionCard — works with conversational AI questions.
 * `question` can be:
 *   - A string (new conversational format from AI)
 *   - An object { title, options } (legacy format)
 *   - An object { key, question } from the conversational agent
 */
export function QuestionCard({ currentStep, totalSteps, question, onSubmit, isLoading }) {
  const [answer, setAnswer] = useState('')
  const textareaRef = useRef(null)

  // Extract the question text regardless of format
  const questionText = typeof question === 'string'
    ? question
    : question?.question || question?.title || 'Tell us more about your project.'

  useEffect(() => {
    setAnswer('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.focus()
    }
  }, [questionText])

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

  const isSubmitDisabled = !answer.trim() || isLoading

  return (
    <div className="w-full flex flex-col">
      <div className="mb-8">
        <ProgressIndicator current={currentStep} total={totalSteps} />
        <h2 className="text-[40px] leading-[1.1] font-340 tracking-tight text-ink mt-6 mb-4">
          {questionText}
        </h2>
        <p className="text-body text-ink-muted">
          Be as specific as you like — the more detail, the better the output.
        </p>
      </div>

      <div className="relative">
        <textarea
          ref={textareaRef}
          value={answer}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          placeholder="Type your answer..."
          rows={3}
          className="w-full resize-none rounded-xl border border-hairline bg-canvas p-6 text-body-lg tracking-body-lg font-320 text-ink placeholder:text-ink-faint focus:border-ink/30 focus:outline-none focus:ring-4 focus:ring-ink/5 transition-all shadow-sm disabled:opacity-50"
        />
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 min-w-[160px] text-button font-480 text-canvas hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed group"
        >
          {isLoading ? (
            <TextShimmerWave
              className="text-button font-480 [--base-color:rgba(255,255,255,0.4)] [--base-gradient-color:#ffffff]"
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
