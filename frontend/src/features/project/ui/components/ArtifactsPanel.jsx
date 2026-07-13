import { motion, AnimatePresence } from 'framer-motion'
import { Download, X, FileCode2, Loader2 } from 'lucide-react'
import { GenerationProgress } from './GenerationProgress'
import { toast } from 'react-hot-toast'

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
 * Styled matching the Zenix Figma block specifications.
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
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          style={{ width: typeof window !== 'undefined' && window.innerWidth >= 768 ? sidebarWidth : '100%' }}
          className="absolute inset-0 z-40 sm:inset-y-0 sm:right-0 sm:left-auto md:relative md:flex-shrink-0 border-l border-hairline bg-canvas flex flex-col max-w-full shadow-2xl md:shadow-none"
        >
          {/* Drag handle */}
          <div
            className="absolute top-0 bottom-0 left-0 w-1.5 cursor-col-resize hover:bg-ink/10 active:bg-ink/20 transition-colors z-50 hidden md:block"
            onMouseDown={handleMouseDown}
          />

          {/* Panel header */}
          <header className="flex h-12 items-center justify-between border-b border-hairline px-4 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-medium text-ink">Context Files</span>
              {artifacts.length > 0 && (
                <span className="inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-surface-soft border border-hairline text-ink-muted text-[10px] font-mono">
                  {artifacts.length}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={onDownload}
                disabled={isDownloading || artifacts.length === 0}
                className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-medium text-ink-muted hover:text-ink hover:bg-surface-soft rounded-md transition-colors disabled:opacity-40 font-mono cursor-pointer"
                title="Download ZIP"
              >
                {isDownloading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                <span className="hidden sm:inline">ZIP</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-ink-muted hover:bg-surface-soft hover:text-ink rounded-md transition-colors md:hidden cursor-pointer"
                aria-label="Close artifacts"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </header>

          {/* Panel body */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {isGeneratingArtifacts ? (
              <div className="flex-1 p-4 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <GenerationProgress artifacts={artifacts} />
              </div>
            ) : artifacts.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                <div className="h-10 w-10 rounded-xl bg-surface-soft border border-hairline flex items-center justify-center mb-3">
                  <FileCode2 className="h-5 w-5 text-ink-muted/50" />
                </div>
                <p className="text-[13px] font-medium text-ink mb-1">No context files yet</p>
                <p className="text-[12px] text-ink-muted max-w-[180px] leading-relaxed">
                  Complete the AI interview to generate your project architecture.
                </p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col min-h-0">
                {/* File list */}
                <div className="shrink-0 p-3 space-y-1.5 border-b border-hairline/50 max-h-[45%] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
                        className={`flex items-center gap-3 w-full p-2 rounded-lg text-left cursor-pointer border transition-colors ${
                          isActive
                            ? 'border-ink bg-surface-soft shadow-sm'
                            : 'border-transparent hover:bg-surface-soft'
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

                {/* Notion-style Figma Block Editor */}
                <AnimatePresence mode="wait">
                  {activeArtifact && (
                    <motion.div
                      key={activeArtifact._id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="flex-1 flex flex-col min-h-0 p-4 border border-ink/10 bg-surface-soft rounded-[24px] m-3 shadow-sm select-none"
                    >
                      <div className="flex items-center justify-between mb-3 px-1">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-[#c8e6cd]" />
                          <span className="text-[11px] font-mono font-medium text-ink-muted truncate max-w-[150px]">
                            {activeArtifact.file_path}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {isSavingArtifact && (
                            <span className="flex items-center gap-1 text-[11px] text-ink-muted">
                              <Loader2 className="h-3 w-3 animate-spin text-ink-muted shrink-0" />
                              Saving
                            </span>
                          )}
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(activeArtifact.content || '')
                              toast.success('Copied file contents')
                            }}
                            className="px-2 py-1 text-[11px] font-medium border border-hairline rounded-md hover:bg-canvas hover:text-ink text-ink-muted transition-colors cursor-pointer"
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                      <textarea
                        className="flex-1 w-full bg-canvas rounded-xl p-4 resize-none border border-hairline outline-none text-[13px] text-ink font-mono focus:border-ink/25 focus:ring-2 focus:ring-ink/5 transition-all leading-relaxed [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
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
