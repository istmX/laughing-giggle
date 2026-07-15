import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, X, FileCode2, Loader2, Edit2, Eye } from 'lucide-react'
import { GenerationProgress } from './GenerationProgress'
import { toast } from 'react-hot-toast'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'

/** Derive a color class from file extension and type based on DESIGN.md */
function fileIconColor(filePath = '') {
  if (filePath.includes('agents')) return 'bg-block-lilac'
  if (filePath.includes('ui') || filePath.includes('tokens') || filePath.includes('design')) return 'bg-block-lime'
  if (filePath.includes('task') || filePath.includes('plan')) return 'bg-block-coral'
  if (filePath.includes('arch') || filePath.includes('overview') || filePath.includes('structure')) return 'bg-block-pink'
  return 'bg-block-mint'
}

function basename(fp = '') {
  return fp.split('/').pop() || fp
}

function StatusBadge({ isGenerating }) {
  if (isGenerating) {
    return (
      <span className="shrink-0 flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-doc-orange animate-ping opacity-75" />
        <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded border bg-doc-orange/10 text-doc-orange border-doc-orange/30 animate-pulse">
          Generating
        </span>
      </span>
    )
  }
  return (
    <span className="shrink-0 flex items-center gap-1.5">
      <span className="h-1.5 w-1.5 rounded-full bg-doc-green animate-pulse opacity-75" />
      <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded border bg-doc-green/10 text-doc-green border-doc-green/30">
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
  const [isEditing, setIsEditing] = useState(false)

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
                <p className="text-[13px] font-medium text-ink mb-1 w-full max-w-[60ch] block">No context files yet</p>
                <p className="text-[12px] text-ink-muted max-w-[180px] leading-relaxed w-full max-w-[60ch] block">
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
                      <button
                        key={a._id}
                        onClick={() => onSelectArtifact(a)}
                        className={`group flex items-center gap-3 w-full p-2.5 rounded-[10px] text-left cursor-pointer border transition-all duration-200 ${
                          isActive
                            ? 'border-hairline bg-surface-elevated shadow-sm'
                            : 'border-transparent hover:bg-surface-soft hover:border-hairline/50'
                        }`}
                      >
                        {/* File type color square */}
                        <div className={`h-8 w-8 rounded-lg shrink-0 flex items-center justify-center ${cardBg} shadow-sm group-hover:scale-105 transition-transform`}>
                          <span className="text-[10.5px] font-mono text-white font-bold uppercase tracking-wider">
                            {(a.file_path || '').split('.').pop()?.slice(0, 3) || 'F'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0 pr-2">
                          <p className={`text-[13.5px] font-medium truncate ${isActive ? 'text-ink' : 'text-ink-muted group-hover:text-ink transition-colors'}`}>
                            {basename(a.file_path)}
                          </p>
                          <p className="text-[11px] text-ink-faint font-mono truncate w-full max-w-[60ch] block">
                            {a.file_path.split('/').slice(0, -1).join('/') || '/'}
                          </p>
                        </div>
                        <StatusBadge isGenerating={isPending} />
                      </button>
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
                      className="flex-1 flex flex-col min-h-0 p-5 bg-surface-elevated rounded-t-[20px] shadow-[0_-4px_24px_rgba(0,0,0,0.02)] select-text"
                    >
                      <div className="flex items-start justify-between mb-5 px-1 pb-4 border-b border-hairline/60">
                        <div className="flex flex-col min-w-0 pr-4">
                          <span className="text-[15px] font-[600] text-ink truncate mb-0.5">
                            {basename(activeArtifact.file_path)}
                          </span>
                          <span className="text-[11.5px] font-mono text-ink-muted truncate">
                            {activeArtifact.file_path}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {isSavingArtifact && (
                            <span className="flex items-center gap-1.5 text-[11px] text-ink-muted font-medium mr-2">
                              <Loader2 className="h-3 w-3 animate-spin text-ink-muted" />
                              Saving...
                            </span>
                          )}
                          <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="p-1.5 text-ink-muted hover:bg-surface-soft hover:text-ink border border-hairline rounded-lg transition-colors cursor-pointer"
                            title={isEditing ? "View Documentation" : "Edit Raw"}
                          >
                            {isEditing ? <Eye className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
                          </button>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(activeArtifact.content || '')
                              toast.success('Copied to clipboard')
                            }}
                            className="px-2.5 py-1.5 text-[11.5px] font-medium border border-hairline rounded-lg hover:bg-surface-soft hover:text-ink text-ink-muted transition-colors cursor-pointer"
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                      {isEditing ? (
                        <textarea
                          className="flex-1 w-full bg-canvas rounded-xl p-5 resize-none border border-hairline outline-none text-[13px] text-ink font-mono focus:border-ink/20 focus:ring-4 focus:ring-ink/5 transition-all leading-relaxed [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                          value={activeArtifact.content || ''}
                          onChange={(e) => onArtifactChange(e.target.value)}
                        />
                      ) : (
                        <div className="flex-1 w-full bg-canvas rounded-xl px-8 py-6 overflow-y-auto border border-hairline [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] notion-markdown">
                          <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            components={{
                              code({node, inline, className, children, ...props}) {
                                const match = /language-(\w+)/.exec(className || '')
                                return !inline && match ? (
                                  <SyntaxHighlighter
                                    style={oneLight}
                                    language={match[1]}
                                    PreTag="div"
                                    className="rounded-xl border border-hairline my-6 text-[13px] !bg-surface-soft"
                                    {...props}
                                  >
                                    {String(children).replace(/\n$/, '')}
                                  </SyntaxHighlighter>
                                ) : (
                                  <code className={className} {...props}>
                                    {children}
                                  </code>
                                )
                              }
                            }}
                          >
                            {activeArtifact.content || ''}
                          </ReactMarkdown>
                        </div>
                      )}
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
