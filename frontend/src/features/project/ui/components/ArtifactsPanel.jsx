import { motion, AnimatePresence } from 'framer-motion'
import { Download, X, FileCode2, Loader2 } from 'lucide-react'
import { GenerationProgress } from './GenerationProgress'

/** Derive a color class from file extension and type based on DESIGN.md */
function fileIconColor(filePath = '') {
  if (filePath.includes('agents')) return 'bg-[#c5b0f4]' // Lilac
  if (filePath.includes('ui') || filePath.includes('tokens') || filePath.includes('design')) return 'bg-[#dceeb1]' // Lime
  if (filePath.includes('task') || filePath.includes('plan')) return 'bg-[#f3c9b6]' // Coral
  if (filePath.includes('arch') || filePath.includes('overview') || filePath.includes('structure')) return 'bg-[#efd4d4]' // Pink
  return 'bg-[#c8e6cd]' // Mint (default)
}

function basename(fp = '') {
  return fp.split('/').pop() || fp
}

function StatusBadge({ isGenerating }) {
  if (isGenerating) {
    return (
      <span className="shrink-0 flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" />
        <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded border bg-[#fef9c3] text-[#a16207] border-[#fef08a] animate-pulse">
          Generating
        </span>
      </span>
    )
  }
  return (
    <span className="shrink-0 flex items-center gap-1.5">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
      <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded border bg-[#dcfce7] text-[#15803d] border-[#bbf7d0]">
        Ready
      </span>
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
                <div className="p-3 flex flex-col gap-1.5 border-b border-hairline/50">
                  {artifacts.map((a) => {
                    const isPending = !a.content || a.content === 'Pending generation...'
                    const isActive = activeArtifact?._id === a._id
                    const cardBg = fileIconColor(a.file_path)
                    return (
                      <motion.button
                        key={a._id}
                        whileHover={{ x: 1 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => onSelectArtifact(a)}
                        className={`rounded-lg border p-3 flex items-center gap-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/20 ${
                          isActive
                            ? 'border-ink bg-surface-soft shadow-sm'
                            : 'border-hairline bg-canvas'
                        }`}
                      >
                        {/* File type color square — Vibrant solid block */}
                        <div className={`h-8 w-8 rounded-lg shrink-0 flex items-center justify-center ${cardBg} shadow-sm`}>
                          <span className="text-[10px] font-mono text-white font-bold uppercase">
                            {(a.file_path || '').split('.').pop()?.slice(0, 2) || 'F'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-ink truncate">{basename(a.file_path)}</p>
                          <p className="text-[11px] text-ink-muted font-mono truncate">{a.file_path}</p>
                        </div>
                        <StatusBadge isGenerating={isPending} />
                      </motion.button>
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
