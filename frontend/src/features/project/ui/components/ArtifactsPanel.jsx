import { motion, AnimatePresence } from 'framer-motion'
import { Download, X, FileCode2, Loader2 } from 'lucide-react'
import { GenerationProgress } from './GenerationProgress'

/** Derive a color class from file extension */
function fileIconColor(filePath = '') {
  if (filePath.endsWith('.md')) return 'bg-emerald-500'
  if (filePath.endsWith('.json')) return 'bg-blue-500'
  if (filePath.endsWith('.yaml') || filePath.endsWith('.yml')) return 'bg-amber-500'
  if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) return 'bg-sky-500'
  if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) return 'bg-yellow-500'
  return 'bg-ink-muted'
}

function basename(fp = '') {
  return fp.split('/').pop() || fp
}

function StatusBadge({ isGenerating }) {
  if (isGenerating) {
    return (
      <motion.span
        animate={{ opacity: [1, 0.6, 1] }}
        transition={{ duration: 1.2, repeat: Infinity }}
        className="text-[10px] font-medium px-1.5 py-0.5 rounded border bg-amber-50 text-amber-600 border-amber-200"
      >
        Generating…
      </motion.span>
    )
  }
  return (
    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded border bg-emerald-50 text-emerald-700 border-emerald-200">
      Ready
    </span>
  )
}

/**
 * ArtifactsPanel — file-explorer style panel that slides in from the right.
 * Shows file cards; clicking one reveals the Notion-like editor below.
 */
export function ArtifactsPanel({
  isOpen,
  onClose,
  artifacts,
  activeArtifact,
  onSelectArtifact,
  isGeneratingArtifacts,
  isSavingArtifact,
  isDownloading,
  onDownload,
  onArtifactChange,
  sidebarWidth,
  handleMouseDown,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', bounce: 0, duration: 0.38 }}
          style={{ width: typeof window !== 'undefined' && window.innerWidth >= 768 ? sidebarWidth : '100%' }}
          className="absolute inset-0 z-40 sm:inset-y-0 sm:right-0 sm:left-auto md:relative md:flex-shrink-0 border-l border-hairline bg-canvas flex flex-col max-w-full shadow-2xl md:shadow-none"
        >
          {/* Drag handle (desktop only) */}
          <div
            className="absolute top-0 bottom-0 left-0 w-1.5 cursor-col-resize hover:bg-ink/10 active:bg-ink/20 transition-colors z-50 hidden md:block"
            onMouseDown={handleMouseDown}
          />

          {/* Panel header */}
          <header className="flex h-14 items-center justify-between border-b border-hairline px-4 shrink-0">
            <div className="flex items-center gap-2">
              <FileCode2 className="h-4 w-4 text-ink-muted" />
              <span className="text-sm font-medium text-ink">Context Files</span>
              {artifacts.length > 0 && (
                <span className="text-[10px] font-mono bg-surface-soft border border-hairline text-ink-muted rounded-full px-1.5 py-0.5">
                  {artifacts.length}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={onDownload}
                disabled={isDownloading || artifacts.length === 0}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-ink-muted hover:text-ink hover:bg-surface-soft rounded-md transition-colors disabled:opacity-40"
                title="Download ZIP"
              >
                {isDownloading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                <span className="hidden sm:inline">ZIP</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-ink-muted hover:bg-surface-soft hover:text-ink rounded-md transition-colors md:hidden"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </header>

          {/* Panel body */}
          <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col">
            {isGeneratingArtifacts ? (
              <div className="flex-1 p-5">
                <GenerationProgress artifacts={artifacts} />
              </div>
            ) : artifacts.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                <div className="h-12 w-12 rounded-2xl bg-surface-soft border border-hairline flex items-center justify-center mb-4 text-ink-muted/50">
                  <FileCode2 className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium text-ink mb-1">No context files yet</p>
                <p className="text-xs text-ink-muted max-w-[180px] leading-relaxed">
                  Complete the AI interview to generate your project architecture.
                </p>
              </div>
            ) : (
              <div className="flex flex-col">
                {/* File list */}
                <div className="p-3 flex flex-col gap-1.5 border-b border-hairline">
                  {artifacts.map((a) => {
                    const isPending = !a.content || a.content === 'Pending generation...'
                    const isActive = activeArtifact?._id === a._id
                    return (
                      <button
                        key={a._id}
                        onClick={() => onSelectArtifact(a)}
                        className={`rounded-lg border p-3 flex items-center gap-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/20 ${
                          isActive
                            ? 'border-ink/25 bg-surface-soft shadow-sm'
                            : 'border-hairline bg-canvas hover:bg-surface-soft cursor-pointer'
                        }`}
                      >
                        {/* File type color square */}
                        <div className={`h-7 w-7 rounded-md shrink-0 flex items-center justify-center ${fileIconColor(a.file_path)}`}>
                          <span className="text-[9px] font-mono text-white font-bold uppercase">
                            {(a.file_path || '').split('.').pop()?.slice(0, 2) || 'F'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-ink truncate">{basename(a.file_path)}</p>
                          <p className="text-[11px] text-ink-muted truncate">{a.file_path}</p>
                        </div>
                        <StatusBadge isGenerating={isPending} />
                      </button>
                    )
                  })}
                </div>

                {/* Editor area */}
                <AnimatePresence mode="wait">
                  {activeArtifact && (
                    <motion.div
                      key={activeArtifact._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="flex flex-col flex-1 p-3"
                    >
                      <div className="flex items-center justify-between mb-2 px-1">
                        <span className="text-[11px] font-mono text-ink-muted uppercase tracking-wide">
                          Editing {basename(activeArtifact.file_path)}
                        </span>
                        {isSavingArtifact && (
                          <span className="flex items-center gap-1 text-[11px] text-ink-muted">
                            <Loader2 className="h-3 w-3 animate-spin" /> Saving…
                          </span>
                        )}
                      </div>
                      <textarea
                        className="w-full flex-1 min-h-[320px] bg-canvas rounded-xl p-4 resize-none border border-hairline outline-none text-sm text-ink font-mono focus:border-ink/25 focus:ring-2 focus:ring-ink/5 transition-all shadow-sm leading-relaxed"
                        value={activeArtifact.content || ''}
                        onChange={(e) => onArtifactChange(e.target.value)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
