import { useEffect, useState, useRef } from 'react'
import { Plus, Trash2, Send, PlaySquare, ArrowLeft, Loader2, PanelLeftClose, PanelLeftOpen, Search, Monitor, Smartphone, Download, Layout, Code2, Sparkles, Wand2, Paintbrush } from 'lucide-react'
import { usePlayground } from '../hooks/usePlayground'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Panel, Group, Separator } from 'react-resizable-panels'
import { LiveSandbox } from './LiveSandbox'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { motion, AnimatePresence } from 'framer-motion'

const STARTER_PROMPTS = [
  { icon: <Layout className="w-4 h-4" />, text: "Create a SaaS design system" },
  { icon: <Wand2 className="w-4 h-4" />, text: "Make it look like Linear" },
  { icon: <Paintbrush className="w-4 h-4" />, text: "Generate dark mode" },
  { icon: <Sparkles className="w-4 h-4" />, text: "Use editorial typography" }
]

export const Playground = () => {
  const {
    sessions, activeSession, activeSessionId, isLoadingSessions, isLoadingSession, isSendingMessage,
    loadSessions, loadSession, createNewSession, deleteSession, sendMessage, setActiveSessionId, renameSession
  } = usePlayground()

  const [input, setInput] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [editingSessionId, setEditingSessionId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [previewMode, setPreviewMode] = useState('desktop') // desktop, mobile
  
  const chatScrollRef = useRef(null)
  const chatEndRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    loadSessions()
  }, [loadSessions])

  useEffect(() => {
    if (activeSessionId && (!activeSession || activeSession._id !== activeSessionId)) {
      loadSession(activeSessionId)
    }
  }, [activeSessionId, loadSession, activeSession])

  useEffect(() => {
    const viewport = chatScrollRef.current
    if (!viewport) return
    viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' })
  }, [activeSession?.chatHistory, isSendingMessage])

  // Auto-resize textarea
  const handleInput = (e) => {
    setInput(e.target.value)
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px'
    }
  }

  const handleSend = (e) => {
    e?.preventDefault()
    if (!input.trim() || isSendingMessage) return
    sendMessage(input.trim())
    setInput('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const filteredSessions = sessions.filter(s => 
    s.title?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div data-lenis-prevent className="fixed inset-0 flex bg-canvas overflow-hidden text-ink font-sans selection:bg-brand-indigo/20">
      
      {/* Sidebar Toggle (Floating) */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="absolute top-3 left-3 z-50 p-2 bg-surface border border-hairline rounded-md shadow-sm text-ink-muted hover:text-ink transition-colors"
          title="Open Sidebar"
        >
          <PanelLeftOpen className="h-4 w-4" />
        </button>
      )}

      {/* Unified Sidebar */}
      {isSidebarOpen && (
        <div className="w-[260px] border-r border-hairline bg-surface-soft flex flex-col shrink-0 transition-all duration-300 z-20">
          <div className="h-14 px-4 border-b border-hairline flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <Link to="/dashboard" className="text-ink-muted hover:text-ink transition-colors flex items-center justify-center p-1 -ml-1 rounded hover:bg-canvas">
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <span className="font-[500] text-[14px] text-ink tracking-tight">Design Playground</span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-ink-muted hover:text-ink p-1 rounded hover:bg-canvas transition-colors"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          </div>

          <div className="p-3 border-b border-hairline shrink-0 space-y-3">
            <button 
              onClick={() => createNewSession()}
              className="w-full flex items-center justify-center gap-2 bg-ink text-canvas py-2 px-4 rounded-md text-[13px] font-[500] hover:opacity-90 transition-opacity"
            >
              <Plus className="h-4 w-4" />
              New Session
            </button>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ink-muted" />
              <input
                type="text"
                placeholder="Search sessions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-canvas border border-hairline rounded-md pl-8 pr-3 py-1.5 text-[13px] outline-none focus:border-brand-indigo/50 transition-colors"
              />
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto p-2 space-y-0.5 custom-scrollbar">
            {isLoadingSessions ? (
              <div className="p-4 flex justify-center">
                <Loader2 className="h-4 w-4 animate-spin text-ink-muted" />
              </div>
            ) : filteredSessions.length === 0 ? (
              <div className="p-4 text-center text-[13px] text-ink-muted">No sessions found</div>
            ) : (
              filteredSessions.map((session) => (
                <div 
                  key={session._id}
                  className={cn(
                    "group flex items-center justify-between px-2.5 py-2 rounded-md cursor-pointer transition-colors text-[13px]",
                    activeSessionId === session._id 
                      ? "bg-canvas border border-hairline shadow-sm text-ink font-[500]" 
                      : "hover:bg-canvas/60 text-ink-muted border border-transparent"
                  )}
                  onClick={() => setActiveSessionId(session._id)}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden flex-1 mr-2">
                    <PlaySquare className={cn("h-3.5 w-3.5 shrink-0", activeSessionId === session._id ? "text-brand-indigo" : "text-ink-muted/70")} />
                    {editingSessionId === session._id ? (
                      <input
                        type="text"
                        autoFocus
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={() => {
                          if (editTitle.trim() && editTitle !== session.title) renameSession(session._id, editTitle.trim());
                          setEditingSessionId(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') e.target.blur();
                          if (e.key === 'Escape') setEditingSessionId(null);
                        }}
                        className="w-full bg-transparent outline-none text-ink border-b border-brand-indigo/50"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span 
                        className="truncate"
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          setEditTitle(session.title || 'Untitled Session');
                          setEditingSessionId(session._id);
                        }}
                      >
                        {session.title || 'Untitled Session'}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteSession(session._id); }}
                      className="p-1 text-ink-muted hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Main Workspace Area */}
      <div className="flex-1 min-w-0 h-full flex flex-col bg-canvas relative z-10">
        
        {/* Global Toolbar */}
        <div className="h-14 border-b border-hairline flex items-center justify-between px-4 shrink-0 bg-canvas z-20">
          <div className="flex items-center gap-2">
             {!activeSessionId && !activeSession?.isDraft && <span className="text-[14px] font-[500] text-ink">Welcome</span>}
             {activeSession?.isDraft && <span className="text-[14px] font-[500] text-ink">New chat</span>}
             {activeSessionId && (
               <>
                 <span className="text-[14px] font-[500] text-ink">Active Session</span>
                 <span className="text-ink-muted text-[13px] mx-2">/</span>
                 <span className="text-ink-muted text-[13px] truncate max-w-[200px]">{activeSession?.title || 'Untitled'}</span>
               </>
             )}
          </div>
          
          {(activeSessionId || activeSession?.isDraft) && (
            <div className="flex items-center gap-1.5 bg-surface-soft p-1 rounded-md border border-hairline">
              <button 
                onClick={() => setPreviewMode('desktop')}
                className={cn("p-1.5 rounded transition-all", previewMode === 'desktop' ? "bg-canvas shadow-sm text-ink" : "text-ink-muted hover:text-ink")}
                title="Desktop Preview"
              >
                <Monitor className="h-4 w-4" />
              </button>
              <button 
                onClick={() => setPreviewMode('mobile')}
                className={cn("p-1.5 rounded transition-all", previewMode === 'mobile' ? "bg-canvas shadow-sm text-ink" : "text-ink-muted hover:text-ink")}
                title="Mobile Preview"
              >
                <Smartphone className="h-4 w-4" />
              </button>
              <div className="w-[1px] h-4 bg-hairline mx-1" />
              <button className="p-1.5 rounded transition-all text-ink-muted hover:text-ink hover:bg-canvas" title="Export Tokens">
                <Download className="h-4 w-4" />
              </button>
              <button className="p-1.5 rounded transition-all text-ink-muted hover:text-ink hover:bg-canvas" title="View Code">
                <Code2 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {activeSessionId || activeSession?.isDraft ? (
          <Group orientation="horizontal" className="flex-1 w-full min-w-0 min-h-0">
            {/* Conversation Panel */}
            <Panel defaultSize={40} minSize={25} className="flex min-w-0 min-h-0 flex-col bg-canvas relative z-10">
              <div ref={chatScrollRef} data-lenis-prevent className="flex-1 min-w-0 min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain px-6 py-6 custom-scrollbar">
                {isLoadingSession ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3 opacity-50">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="text-[13px]">Loading workspace...</span>
                  </div>
                ) : activeSession?.chatHistory?.length === 0 ? (
                  <div className="flex flex-col h-full items-center justify-center text-center max-w-sm mx-auto">
                    <div className="h-12 w-12 bg-surface-elevated border border-hairline rounded-xl flex items-center justify-center mb-4 shadow-sm">
                      <Wand2 className="h-6 w-6 text-brand-indigo" />
                    </div>
                    <h3 className="text-[16px] font-[500] mb-2">Design Copilot</h3>
                    <p className="text-[14px] text-ink-muted leading-relaxed mb-8">
                      Describe your ideal design system, or paste an inspiration link. I will generate and refine tokens instantly.
                    </p>
                    <div className="grid grid-cols-1 gap-2 w-full">
                      {STARTER_PROMPTS.map((prompt, idx) => (
                        <button
                          key={idx}
                          onClick={() => { setInput(prompt.text); setTimeout(() => textareaRef.current?.focus(), 50); }}
                          className="flex items-center gap-3 p-3 text-left rounded-lg border border-hairline bg-surface-soft hover:bg-surface-elevated hover:border-brand-indigo/30 transition-all text-[13px] text-ink-muted hover:text-ink group"
                        >
                          <span className="text-brand-indigo/70 group-hover:text-brand-indigo transition-colors">{prompt.icon}</span>
                          {prompt.text}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="w-full min-w-0 space-y-6 pb-4">
                    <AnimatePresence initial={false}>
                      {activeSession?.chatHistory?.map((msg, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className={cn(
                            "group flex w-full min-w-0 max-w-[min(90%,65ch)] flex-col",
                            msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                          )}
                        >
                          <span className="text-[11px] font-[500] text-ink-muted uppercase tracking-wider mb-1.5 px-1">
                            {msg.role === 'user' ? 'You' : 'Zenix AI'}
                          </span>
                          <div className={cn(
                            "max-w-full min-w-0 break-words rounded-2xl px-5 py-3.5 text-[14px] leading-[1.6] [overflow-wrap:anywhere]",
                            msg.role === 'user' 
                              ? "w-fit bg-ink text-canvas rounded-tr-sm shadow-sm" 
                              : "playground-ai-response w-full bg-surface-soft text-ink rounded-tl-sm border border-hairline shadow-sm"
                          )}>
                            <ReactMarkdown 
                              remarkPlugins={[remarkGfm]}
                              components={{
                                code(props) {
                                  const {children, className, ...rest} = props
                                  const text = String(children).trim();
                                  const isHex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(text);
                                  
                                  if (isHex) {
                                    return (
                                      <span className="inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded-md bg-canvas border border-hairline text-[0.9em] font-mono shadow-sm mx-0.5 align-baseline text-ink">
                                        <span className="w-3 h-3 rounded-sm border border-black/10 shrink-0" style={{ backgroundColor: text }} />
                                        <span>{text}</span>
                                      </span>
                                    );
                                  }
                                  return <code className={cn("font-mono text-[0.85em] bg-canvas/60 px-1 py-0.5 rounded border border-hairline/50 text-ink", className)} {...rest}>{children}</code>;
                                }
                              }}
                            >
                              {msg.content}
                            </ReactMarkdown>
                          </div>
                        </motion.div>
                      ))}
                      {isSendingMessage && (
                        <motion.div 
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          className="flex items-center gap-3 text-ink-muted text-[13px] font-[500] px-1 py-2"
                        >
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-brand-indigo" />
                          Processing design request...
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div ref={chatEndRef} />
                  </div>
                )}
              </div>
              
              {/* Composer */}
              <div className="p-4 bg-canvas border-t border-hairline/50">
                <div className="relative bg-surface-soft border border-hairline rounded-xl focus-within:border-brand-indigo/40 focus-within:ring-1 focus-within:ring-brand-indigo/40 transition-all shadow-sm">
                  <textarea 
                    ref={textareaRef}
                    value={input}
                    onChange={handleInput}
                    onKeyDown={handleKeyDown}
                    placeholder="Describe your design updates..."
                    className="w-full bg-transparent min-h-[44px] max-h-[200px] py-3.5 pl-4 pr-12 text-[14px] outline-none text-ink placeholder:text-ink-muted resize-none custom-scrollbar"
                    disabled={isSendingMessage}
                    rows={1}
                  />
                  <div className="absolute right-2 bottom-2">
                    <button 
                      onClick={handleSend}
                      disabled={!input.trim() || isSendingMessage}
                      className="p-1.5 bg-ink text-canvas rounded-lg disabled:opacity-40 hover:opacity-90 transition-opacity flex items-center justify-center shadow-sm"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="text-center mt-2">
                  <span className="text-[11px] text-ink-muted/70 font-[400]">Shift + Enter for new line</span>
                </div>
              </div>
            </Panel>

            <Separator className="w-[1px] bg-hairline hover:bg-brand-indigo/50 hover:w-1 active:bg-brand-indigo transition-all flex items-center justify-center cursor-col-resize z-20 group">
                <div className="opacity-0 group-hover:opacity-100 h-8 w-1 bg-brand-indigo rounded-full transition-opacity absolute" />
             </Separator>

            {/* Live Preview Panel */}
            <Panel defaultSize={60} minSize={30} className="bg-surface relative min-w-0 min-h-0 flex flex-col z-10">
              <div className="flex-1 min-h-0 overflow-auto p-4 md:p-8 flex items-center justify-center custom-scrollbar">
                
                {/* Device Frame */}
                <div className={cn(
                  "bg-canvas rounded-xl border border-hairline shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden transition-all duration-500 ease-out flex flex-col",
                  previewMode === 'mobile' ? "w-[375px] h-[812px]" : "w-full h-full"
                )}>
                  <div className="h-8 border-b border-hairline bg-surface-soft flex items-center px-4 shrink-0 gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-ink-muted/30" />
                    <div className="w-2.5 h-2.5 rounded-full bg-ink-muted/30" />
                    <div className="w-2.5 h-2.5 rounded-full bg-ink-muted/30" />
                  </div>
                  <div className="flex-1 min-h-0 bg-canvas overflow-y-auto">
                    <LiveSandbox tokens={activeSession?.tokens} />
                  </div>
                </div>

              </div>
            </Panel>
           </Group>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-canvas">
            <div className="h-16 w-16 bg-surface border border-hairline rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <Layout className="h-8 w-8 text-brand-indigo" />
            </div>
            <h2 className="text-2xl font-[500] text-ink mb-2 tracking-tight">Design Playground</h2>
            <p className="text-ink-muted mb-8 w-full max-w-[50ch] text-[15px] leading-relaxed">
              A professional environment for AI-assisted design engineering. Describe your interface, and watch the tokens generate instantly.
            </p>
            <button 
              onClick={() => createNewSession()}
              className="flex items-center gap-2 px-6 py-3 bg-ink text-canvas rounded-lg text-[14px] font-[500] hover:opacity-90 transition-all shadow-sm hover:shadow active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" />
              Start Workspace
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
