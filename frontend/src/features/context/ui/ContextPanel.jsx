import React, { useState } from 'react'
import { useContextFlow } from '../hooks/useContextFlow'
import { Loader2, FileCode, Check, Clipboard, Eye, EyeOff, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export function ContextPanel({ projectId, ideaId }) {
  const { 
    isGenerating, 
    generatedFiles, 
    error, 
    triggerContextGeneration, 
    cancelContextGeneration 
  } = useContextFlow(ideaId)

  // Track active file preview
  const [previewedFile, setPreviewedFile] = useState(null)
  // Track copied file keys for visual checkmarks
  const [copiedKey, setCopiedKey] = useState(null)

  // Simulated progress steps during active generation
  const [currentProgressIndex, setCurrentProgressIndex] = useState(0)
  const progressSteps = [
    "Analyzing idea prompts...",
    "Defining software architecture...",
    "Building phase-by-phase implementation plan...",
    "Formulating design system rules and tokens...",
    "Configuring AI developer instructions (Agents.md)...",
    "Finalizing repository documentation & README..."
  ]

  React.useEffect(() => {
    let interval
    if (isGenerating) {
      setCurrentProgressIndex(0)
      interval = setInterval(() => {
        setCurrentProgressIndex((prev) => (prev < progressSteps.length - 1 ? prev + 1 : prev))
      }, 3500)
    } else {
      setCurrentProgressIndex(0)
    }
    return () => clearInterval(interval)
  }, [isGenerating])

  const handleCopy = (file) => {
    navigator.clipboard.writeText(file.content)
    setCopiedKey(file.key)
    toast.success(`${file.name} content copied!`)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const togglePreview = (fileKey) => {
    setPreviewedFile(previewedFile === fileKey ? null : fileKey)
  }

  return (
    <div className="bg-surface border border-hairline rounded-xl p-6 shadow-sm">
      <h3 className="text-body-lg font-medium tracking-tight text-ink mb-2">Project Context</h3>
      <p className="text-body-sm text-ink-muted mb-6">
        Generate developer-ready engineering assets (Agents.md, build-plan.md, ui-tokens.md, etc.) for this project.
      </p>

      {isGenerating ? (
        <div className="space-y-4" aria-live="polite">
          <div className="flex items-center justify-between border border-hairline bg-surface/50 rounded-lg p-4">
            <div className="flex items-center gap-3 text-ink-muted text-body-sm">
              <Loader2 className="h-4 w-4 animate-spin text-ink" />
              <span className="font-medium text-ink">Generating context assets...</span>
            </div>
            <button
              onClick={cancelContextGeneration}
              type="button"
              className="flex items-center gap-1.5 text-body-xs font-medium text-destructive hover:opacity-80 transition-opacity border border-destructive/20 bg-destructive/5 px-3 py-1.5 rounded-lg"
            >
              <XCircle className="h-3.5 w-3.5" />
              Cancel
            </button>
          </div>

          {/* Progress list indicators */}
          <div className="border border-hairline rounded-lg p-4 space-y-3 bg-canvas/30 text-body-xs">
            <h5 className="font-semibold text-ink-muted uppercase tracking-wider text-[10px]">Generation Progress</h5>
            <div className="space-y-2">
              {progressSteps.map((step, idx) => {
                const isCompleted = idx < currentProgressIndex
                const isActive = idx === currentProgressIndex
                return (
                  <div key={idx} className="flex items-center gap-2">
                    <span className={`h-1.5 w-1.5 rounded-full ${isCompleted ? 'bg-ink' : isActive ? 'bg-ink animate-pulse' : 'bg-hairline'}`} />
                    <span className={isCompleted ? 'text-ink line-through opacity-50' : isActive ? 'text-ink font-medium' : 'text-ink-muted opacity-40'}>
                      {step}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={triggerContextGeneration}
          type="button"
          className="bg-ink text-canvas hover:opacity-90 px-6 py-3 rounded-lg text-body-sm font-medium transition-opacity"
        >
          {generatedFiles.length > 0 ? 'Regenerate Context' : 'Generate Context'}
        </button>
      )}

      {error && (
        <div className="flex items-start gap-2 border border-destructive/20 bg-destructive/5 p-3 rounded-lg mt-4" aria-live="assertive">
          <p className="text-destructive text-caption">{error}</p>
        </div>
      )}

      {generatedFiles.length > 0 && (
        <div className="mt-6 border-t border-hairline pt-6">
          <h4 className="text-body-sm font-medium text-ink mb-3">Generated Assets:</h4>
          <div className="space-y-3">
            {generatedFiles.map((file) => {
              const isPreviewing = previewedFile === file.key
              const isCopied = copiedKey === file.key
              return (
                <div key={file.key} className="border border-hairline rounded-lg overflow-hidden bg-canvas/20">
                  <div className="flex items-center justify-between p-3 hover:bg-canvas/50 transition-colors">
                    <div className="flex items-center gap-2 text-ink">
                      <FileCode className="h-4 w-4 text-ink-muted shrink-0" />
                      <span className="text-body-sm font-mono">{file.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => togglePreview(file.key)}
                        type="button"
                        aria-label={isPreviewing ? "Close preview" : "View content"}
                        className="p-1.5 hover:bg-canvas rounded text-ink-muted hover:text-ink transition-colors"
                      >
                        {isPreviewing ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                      <button
                        onClick={() => handleCopy(file)}
                        type="button"
                        aria-label="Copy code to clipboard"
                        className="p-1.5 hover:bg-canvas rounded text-ink-muted hover:text-ink transition-colors"
                      >
                        {isCopied ? <Check className="h-3.5 w-3.5 text-success" /> : <Clipboard className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>

                  {isPreviewing && (
                    <div className="border-t border-hairline bg-canvas p-3 font-mono text-body-xs text-ink overflow-x-auto max-h-64 scrollbar-thin">
                      <pre className="whitespace-pre-wrap">{file.content}</pre>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
