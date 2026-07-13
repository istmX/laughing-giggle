import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ArrowUp, Square, RotateCcw, Sparkles, Menu, FileText } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { downloadArtifactsZip, updateArtifact } from '@/features/artifacts/api/artifacts.api'
import { useChatStore } from '../store/useChatStore'
import { toast } from 'react-hot-toast'

import { Sidebar } from '@/Dashboard/components/Sidebar'
import { MessageScrollerProvider, MessageScroller, MessageScrollerViewport, MessageScrollerContent, MessageScrollerItem, MessageScrollerButton } from '@/components/ui/message-scroller'

import { AiIcon } from './components/AiIcon'
import { AiThinking } from './components/AiThinking'
import { EmptyState } from './components/EmptyState'
import { GenerationProgress } from './components/GenerationProgress'
import { SpecReadyPanel } from './components/SpecReadyPanel'
import { ArtifactsPanel } from './components/ArtifactsPanel'

import { useProjectData } from '../hooks/useProjectData'
import { useChatHandlers } from '../hooks/useChatHandlers'

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export function ProjectWorkspace() {
  const { projectId } = useParams()
  const { token } = useAuth()

  // State hooks isolated into useProjectData custom hook
  const {
    project,
    setProject,
    ideaId,
    setIdeaId,
    isPageLoading,
    setIsPageLoading,
    artifacts,
    setArtifacts,
    activeArtifact,
    setActiveArtifact,
    isGeneratingArtifacts,
    setIsGeneratingArtifacts,
    isSavingArtifact,
    setIsSavingArtifact,
    isArtifactsOpen,
    setIsArtifactsOpen,
    showSpecReady,
    setShowSpecReady,
    specContent,
    setSpecContent,
  } = useProjectData(token, projectId)

  const { messages } = useChatStore()
  const [inputValue, setInputValue] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [lastFailedMessage, setLastFailedMessage] = useState(null)

  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  const abortControllerRef = useRef(null)
  const inputRef = useRef(null)

  // Resizable sidebar states
  const [sidebarWidth, setSidebarWidth] = useState(380)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const startWidth = useRef(0)

  const handleMouseDown = (e) => {
    isDragging.current = true
    startX.current = e.clientX
    startWidth.current = sidebarWidth
    document.body.style.cursor = 'col-resize'
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }
  const handleMouseMove = (e) => {
    if (!isDragging.current) return
    const dx = startX.current - e.clientX
    setSidebarWidth(Math.min(Math.max(startWidth.current + dx, 300), 760))
  }
  const handleMouseUp = () => {
    isDragging.current = false
    document.body.style.cursor = ''
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }


  useEffect(() => {
    if (!isPageLoading && inputRef.current) inputRef.current.focus()
  }, [isPageLoading])

  
  const { handleSend } = useChatHandlers({
    token,
    projectId,
    ideaId,
    setIdeaId,
    project,
    setProject,
    artifacts,
    setArtifacts,
    activeArtifact,
    setActiveArtifact,
    setIsGeneratingArtifacts,
    setIsArtifactsOpen,
    setShowSpecReady,
    setSpecContent,
    setIsProcessing,
    setLastFailedMessage,
    setInputValue,
    inputValue,
    isProcessing,
    abortControllerRef,
    inputRef,
  })

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setIsProcessing(false)
    if (inputRef.current) inputRef.current.focus()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = (e) => {
    setInputValue(e.target.value)
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      const clamped = Math.min(inputRef.current.scrollHeight, 120)
      inputRef.current.style.height = `${clamped}px`
    }
  }

  const hasMessages = messages.length > 0

  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-ink flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-canvas" />
          </div>
          <span className="text-xs text-ink-muted font-mono">Loading workspace…</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-dvh w-full bg-background overflow-hidden text-foreground font-sans" data-lenis-prevent="true">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-canvas relative">
        {/* Header */}
        <header className="flex h-12 items-center gap-3 border-b border-hairline/60 bg-canvas/95 backdrop-blur-sm px-4 shrink-0 z-10">
          <button
            type="button"
            className="md:hidden -ml-1 p-1.5 text-ink-muted hover:bg-surface-soft hover:text-ink rounded-md transition-colors cursor-pointer"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-1.5 flex-1 min-w-0 text-[13px]">
            <Link
              to="/dashboard"
              className="text-ink-muted hover:text-ink transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Projects</span>
            </Link>
            <span className="text-hairline shrink-0">/</span>
            <span className="font-medium text-ink truncate">{project?.project_title || 'New Project'}</span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {artifacts.length > 0 && (
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-ink-muted font-mono">
                <FileText className="h-3 w-3" />
                <span>{artifacts.length} files</span>
                {project?.updatedAt && (
                  <>
                    <span className="text-hairline">·</span>
                    <span>{timeAgo(project.updatedAt)}</span>
                  </>
                )}
              </div>
            )}
            <button
              onClick={() => setIsArtifactsOpen(!isArtifactsOpen)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[12px] font-medium rounded-lg transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/20 ${
                isArtifactsOpen
                  ? 'bg-surface-soft text-ink border border-hairline/80'
                  : 'text-ink-muted hover:bg-surface-soft hover:text-ink border border-hairline/60'
              }`}
              aria-label="Toggle context files"
            >
              <ArrowLeft className={`h-3.5 w-3.5 transition-transform duration-200 ${isArtifactsOpen ? 'rotate-180' : ''}`} />
              <span>Context</span>
              {artifacts.length > 0 && (
                <span className="inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-ink text-canvas text-[10px] font-mono">
                  {artifacts.length}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Chat area */}
        <div className="flex-1 min-h-0 relative flex flex-col">
          <MessageScrollerProvider autoScroll={true} defaultScrollPosition="end">
            <MessageScroller className="h-full">
              <MessageScrollerViewport className="px-4 pt-6">
                <MessageScrollerContent className="max-w-3xl mx-auto pb-44 w-full">
                  {!hasMessages && (
                    <div className="min-h-[60vh] flex items-center justify-center">
                      <EmptyState onSuggestion={(s) => setInputValue(s)} />
                    </div>
                  )}

                  {messages.map((msg, i) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="w-full"
                    >
                      <MessageScrollerItem messageId={msg.id} scrollAnchor={msg.role === 'user'} className="w-full">
                        {msg.role === 'user' ? (
                          <div className="flex justify-end py-3">
                            <div className="max-w-[72%] text-right">
                              <p className="text-[15px] text-ink leading-[1.65] font-normal">
                                {msg.content}
                              </p>
                              {msg.timestamp && (
                                <span className="text-[12px] text-ink-muted/55 font-mono mt-1 block">
                                  {msg.timestamp}
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start gap-3 py-4">
                            <div className="shrink-0 mt-0.5">
                              <AiIcon isAnimating={isProcessing && i === messages.length - 1} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[15px] text-ink leading-[1.65] font-light">
                                {msg.content}
                              </p>

                              {msg.options?.length > 0 && (
                                <motion.div
                                  initial="hidden"
                                  animate="visible"
                                  variants={{
                                    hidden: { opacity: 0 },
                                    visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } }
                                  }}
                                  className="flex flex-wrap gap-2 mt-4"
                                >
                                  {msg.options.map((opt, idx) => (
                                    <motion.button
                                      key={idx}
                                      variants={{ hidden: { opacity: 0, y: 4 }, visible: { opacity: 1, y: 0 } }}
                                      whileHover={{ y: -1 }}
                                      disabled={isProcessing}
                                      onClick={() => handleSend(opt)}
                                      className="px-3.5 py-1.5 rounded-full border border-hairline bg-canvas hover:bg-surface-soft hover:border-ink/25 text-[13px] font-normal text-ink transition-all disabled:opacity-40 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/20"
                                    >
                                      {opt}
                                    </motion.button>
                                  ))}
                                  {!msg.options.some(o => o.toLowerCase().includes('zenix decide')) && (
                                    <motion.button
                                      variants={{ hidden: { opacity: 0, y: 4 }, visible: { opacity: 1, y: 0 } }}
                                      whileHover={{ y: -1 }}
                                      disabled={isProcessing}
                                      onClick={() => handleSend('Let Zenix decide')}
                                      className="px-3.5 py-1.5 rounded-full bg-ink hover:opacity-85 text-[13px] font-normal text-canvas transition-all disabled:opacity-40 cursor-pointer flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/20"
                                    >
                                      <Sparkles className="h-3 w-3" />
                                      Let Zenix decide
                                    </motion.button>
                                  )}
                                </motion.div>
                              )}
                            </div>
                          </div>
                        )}

                        {i < messages.length - 1 && (
                          <hr className="border-hairline/60" />
                        )}
                      </MessageScrollerItem>
                    </motion.div>
                  ))}

                  {isProcessing && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-start gap-3 py-4"
                    >
                      <AiIcon isAnimating />
                      <div className="pt-0.5">
                        <AiThinking />
                      </div>
                    </motion.div>
                  )}

                  {isGeneratingArtifacts && !isProcessing && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-3 py-4"
                    >
                      <AiIcon isAnimating />
                      <div className="flex-1 pt-1">
                        <GenerationProgress artifacts={artifacts} />
                      </div>
                    </motion.div>
                  )}
                </MessageScrollerContent>
              </MessageScrollerViewport>
              <MessageScrollerButton />
            </MessageScroller>
          </MessageScrollerProvider>

          <AnimatePresence>
            {showSpecReady && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0 z-20 bg-canvas flex flex-col"
              >
                <SpecReadyPanel
                  specContent={specContent}
                  artifactCount={artifacts.length}
                  onContinue={() => setShowSpecReady(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating Input */}
          <div className={`absolute bottom-0 left-0 right-0 pb-6 px-4 z-10 pointer-events-none transition-opacity duration-200 ${showSpecReady ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <div className="max-w-3xl mx-auto pointer-events-auto">
              <AnimatePresence>
                {lastFailedMessage && !isProcessing && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="flex items-center justify-between bg-canvas border border-hairline rounded-xl px-4 py-2.5 mb-2 shadow-sm"
                  >
                    <span className="text-[12px] text-ink-muted truncate max-w-[70%] font-mono">
                      Failed: "{lastFailedMessage}"
                    </span>
                    <button
                      onClick={() => handleSend(lastFailedMessage)}
                      className="flex items-center gap-1.5 text-[12px] font-medium text-ink hover:opacity-70 transition-opacity cursor-pointer shrink-0 ml-3"
                    >
                      <RotateCcw className="h-3 w-3" />
                      Retry
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="floating-input flex items-end gap-2 px-4 py-3">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={handleInput}
                  onKeyDown={handleKeyDown}
                  disabled={isProcessing}
                  placeholder={
                    project?.wizard_state?.isComplete
                      ? 'Ask Zenix Developer… (Enter to send, Shift+Enter for newline)'
                      : 'What would you like to build? (Enter to send, Shift+Enter for newline)'
                  }
                  className="flex-1 bg-transparent resize-none border-none outline-none text-[15px] text-ink placeholder:text-ink-muted/55 max-h-[120px] min-h-[24px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] disabled:opacity-50 w-full focus:ring-0 leading-relaxed"
                  rows={1}
                  style={{ height: '24px' }}
                />

                {isProcessing ? (
                  <button
                    onClick={handleCancel}
                    aria-label="Stop generation"
                    title="Stop"
                    className="h-8 w-8 rounded-full bg-ink text-canvas hover:opacity-80 transition-all flex items-center justify-center shrink-0 cursor-pointer"
                  >
                    <Square className="h-3 w-3 fill-current" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleSend(null)}
                    disabled={!inputValue.trim()}
                    aria-label="Send message"
                    className="h-8 w-8 rounded-full bg-ink text-canvas hover:opacity-85 disabled:opacity-30 disabled:bg-surface-soft disabled:text-ink-muted transition-all flex items-center justify-center shrink-0 cursor-pointer"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <p className="text-center mt-2 text-[11px] text-ink-muted/45 font-mono">
                Zenix AI can make mistakes. Review output carefully.
              </p>
            </div>
          </div>
        </div>
      </main>

      <ArtifactsPanel
        isOpen={isArtifactsOpen}
        onClose={() => setIsArtifactsOpen(false)}
        artifacts={artifacts}
        activeArtifact={activeArtifact}
        onSelectArtifact={(a) => setActiveArtifact(a)}
        isGeneratingArtifacts={isGeneratingArtifacts}
        isSavingArtifact={isSavingArtifact}
        isDownloading={isDownloading}
        onDownload={async () => {
          setIsDownloading(true)
          try {
            await downloadArtifactsZip(token, projectId)
            toast.success('Downloaded!')
          } catch {
            toast.error('Failed to download ZIP')
          } finally {
            setIsDownloading(false)
          }
        }}
        onArtifactChange={(newContent) => {
          if (!activeArtifact) return
          setActiveArtifact({ ...activeArtifact, content: newContent })
          if (window.saveTimeout) clearTimeout(window.saveTimeout)
          window.saveTimeout = setTimeout(async () => {
            setIsSavingArtifact(true)
            try {
              await updateArtifact(token, activeArtifact._id, { content: newContent })
              setArtifacts((prev) =>
                prev.map((a) => (a._id === activeArtifact._id ? { ...a, content: newContent } : a))
              )
            } catch {
              toast.error('Failed to save artifact')
            } finally {
              setIsSavingArtifact(false)
            }
          }, 1000)
        }}
        sidebarWidth={sidebarWidth}
        handleMouseDown={handleMouseDown}
      />
    </div>
  )
}
