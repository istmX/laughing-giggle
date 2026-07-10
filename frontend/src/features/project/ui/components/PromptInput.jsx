import { useState, useRef, useEffect } from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'

import { TextShimmerWave } from '@/components/ui/text-shimmer-wave'

export function PromptInput({ onSubmit, isLoading }) {
  const [val, setVal] = useState('')
  const textareaRef = useRef(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [])

  const handleInput = (e) => {
    setVal(e.target.value)
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (val.trim() && !isLoading) onSubmit(val.trim())
    }
  }

  return (
    <div className="w-full flex flex-col">
      <div className="mb-8">
        <span className="inline-block mb-4 text-caption tracking-caption font-480 text-ink-muted uppercase">
          New Project
        </span>
        <h1 className="text-[40px] leading-[1.1] font-340 tracking-tight text-ink mb-2">
          Describe what you want to build.
        </h1>
      </div>

      <div className="relative group">
        <textarea
          ref={textareaRef}
          value={val}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          placeholder="I want to build..."
          className="w-full min-h-[200px] resize-none rounded-xl border border-hairline bg-canvas p-6 text-body-lg tracking-body-lg font-320 text-ink placeholder:text-ink-faint focus:border-ink/30 focus:outline-none focus:ring-4 focus:ring-ink/5 transition-all shadow-sm disabled:opacity-50"
        />
      </div>
      
      <div className="mt-8 flex justify-end">
        <button
          onClick={() => { if (val.trim() && !isLoading) onSubmit(val.trim()) }}
          disabled={!val.trim() || isLoading}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 min-w-[140px] text-button font-480 text-canvas hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed group"
        >
          {isLoading ? (
            <TextShimmerWave 
              className="text-button font-480 [--base-color:rgba(255,255,255,0.4)] [--base-gradient-color:#ffffff]"
              duration={1}
              spread={1}
              zDistance={1}
              yDistance={-1}
            >
              Analyzing...
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
