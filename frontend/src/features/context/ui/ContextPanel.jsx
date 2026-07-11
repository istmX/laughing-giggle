import React from 'react'
import { useContextFlow } from '../hooks/useContextFlow'
import { Loader2, FileCode } from 'lucide-react'

export function ContextPanel({ projectId, ideaId }) {
  const { isGenerating, generatedFiles, error, triggerContextGeneration } = useContextFlow(projectId, ideaId)

  return (
    <div className="bg-surface border border-hairline rounded-xl p-6 shadow-sm">
      <h3 className="text-card-title font-340 tracking-tight text-ink mb-2">Project Context</h3>
      <p className="text-body-sm text-ink-muted mb-6">
        Generate the developer-ready engineering assets (Agents.md, build-plan.md, ui-tokens.md, etc.) for this project.
      </p>

      {isGenerating ? (
        <div className="flex items-center gap-3 text-ink-muted text-body-sm">
          <Loader2 className="h-4 w-4 animate-spin text-ink" />
          <span>Generating project context documents...</span>
        </div>
      ) : (
        <button
          onClick={triggerContextGeneration}
          className="bg-ink text-canvas hover:opacity-90 px-6 py-3 rounded-full text-body-sm font-480 transition-opacity"
        >
          Generate Context
        </button>
      )}

      {error && (
        <p className="text-destructive text-caption mt-3">{error}</p>
      )}

      {generatedFiles.length > 0 && (
        <div className="mt-6 border-t border-hairline pt-6">
          <h4 className="text-body-sm font-540 text-ink mb-3">Generated Assets:</h4>
          <div className="space-y-2">
            {generatedFiles.map((file, idx) => (
              <div key={idx} className="flex items-center gap-2 text-ink-muted hover:text-ink transition-colors text-body-sm">
                <FileCode className="h-4 w-4 shrink-0" />
                <span>{file.name || file}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
