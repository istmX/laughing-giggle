import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { OptionButton } from './OptionButton'
import { ProgressIndicator } from './ProgressIndicator'

export function QuestionCard({ currentStep, totalSteps, question, onSubmit }) {
  const [selectedOption, setSelectedOption] = useState(null)
  const [customValue, setCustomValue] = useState('')

  const isCustomSelected = selectedOption === 'custom'
  const isSubmitDisabled = !selectedOption || (isCustomSelected && !customValue.trim())

  const handleSubmit = () => {
    if (isSubmitDisabled) return
    onSubmit(isCustomSelected ? customValue.trim() : selectedOption)
    setSelectedOption(null)
    setCustomValue('')
  }

  return (
    <div className="w-full flex flex-col">
      <div className="mb-8">
        <ProgressIndicator current={currentStep} total={totalSteps} />
        <h2 className="text-[40px] leading-[1.1] font-340 tracking-tight text-ink mt-6 mb-8">
          {question.title}
        </h2>
      </div>

      <div className="flex flex-col gap-3">
        {question.options.map((opt) => (
          <OptionButton
            key={opt}
            label={opt}
            badge="Suggested"
            isSelected={selectedOption === opt}
            onClick={() => {
              setSelectedOption(opt)
              setCustomValue('')
            }}
          />
        ))}
        
        <OptionButton
          label="Let AI decide"
          description="Best for beginners. Let Zenix choose the optimal stack."
          isSelected={selectedOption === 'ai_decide'}
          onClick={() => {
            setSelectedOption('ai_decide')
            setCustomValue('')
          }}
        />

        <OptionButton
          label="Write my own..."
          description="For professionals. Specify a custom tool not listed above."
          isSelected={isCustomSelected}
          onClick={() => setSelectedOption('custom')}
        />

        {isCustomSelected && (
          <div className="mt-2 pl-[3.25rem] pr-4">
            <input
              autoFocus
              type="text"
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSubmit()
              }}
              placeholder="E.g. Firebase Authentication"
              className="w-full rounded-md border-b border-hairline bg-transparent py-2 text-body font-330 text-ink placeholder:text-ink-faint focus:border-ink focus:outline-none transition-colors"
            />
          </div>
        )}
      </div>

      <div className="mt-10 flex justify-start">
        <button
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
          className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-button font-480 text-canvas hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed group"
        >
          Continue
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  )
}
