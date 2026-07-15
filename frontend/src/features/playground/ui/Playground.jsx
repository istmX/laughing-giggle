import { useEffect, useState, useRef } from 'react'
import { Plus, Trash2, Send, PlaySquare, ArrowLeft, Loader2, GripVertical, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { usePlayground } from '../hooks/usePlayground'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels'
import { LiveSandbox } from './LiveSandbox'

export const Playground = () => {
  const {
    sessions,
    activeSession,
    activeSessionId,
    isLoadingSessions,
    isLoadingSession,
    isSendingMessage,
    loadSessions,
    loadSession,
    createNewSession,
    deleteSession,
    sendMessage,
    setActiveSessionId
  } = usePlayground()

  const [input, setInput] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const chatEndRef = useRef(null)

  useEffect(() => {
    loadSessions()
  }, [loadSessions])

  useEffect(() => {
    if (activeSessionId && (!activeSession || activeSession._id !== activeSessionId)) {
      loadSession(activeSessionId)
    }
  }, [activeSessionId, loadSession, activeSession])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeSession?.chatHistory])

  const handleSend = (e) => {
    e.preventDefault()
    if (!input.trim() || isSendingMessage) return
    sendMessage(input.trim())
    setInput('')
  }

  return (
    <div className="flex h-screen w-full bg-canvas overflow-hidden">
      {/* Sidebar Toggle Button (when closed) */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="absolute top-4 left-4 z-50 p-2 bg-surface-elevated border border-hairline rounded-md shadow-sm text-ink hover:bg-canvas transition-colors"
          title="Open Sidebar"
        >
          <PanelLeftOpen className="h-4 w-4" />
        </button>
      )}

      {/* Sidebar */}
      {isSidebarOpen && (
        <div className="w-64 border-r border-hairline bg-surface-soft flex flex-col shrink-0">
          <div className="p-4 border-b border-hairline flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link to="/dashboard" className="text-ink-muted hover:text-ink transition-colors" title="Back to Dashboard">
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-ink-muted hover:text-ink transition-colors"
                title="Hide Sidebar"
              >
                <PanelLeftClose className="h-4 w-4" />
              </button>
            </div>
            <h2 className="font-[540] text-ink text-sm">Zenix Copilot</h2>
            <button 
              onClick={() => createNewSession()}
              className="p-1.5 hover:bg-canvas rounded-md transition-colors text-ink"
              title="New Session"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {isLoadingSessions ? (
            <div className="p-4 text-center text-sm text-ink-muted">Loading...</div>
          ) : sessions.length === 0 ? (
            <div className="p-4 text-center text-sm text-ink-muted">No sessions yet</div>
          ) : (
            sessions.map((session) => (
              <div 
                key={session._id}
                className={cn(
                  "group flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors",
                  activeSessionId === session._id 
                    ? "bg-canvas border border-hairline shadow-sm" 
                    : "hover:bg-canvas/50 border border-transparent"
                )}
                onClick={() => setActiveSessionId(session._id)}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <PlaySquare className="h-4 w-4 shrink-0 text-ink-muted" />
                  <span className="text-sm truncate text-ink font-[480]">{session.title || 'Untitled Session'}</span>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteSession(session._id)
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 text-destructive rounded transition-all"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      )}

      {/* Main Content */}
      <div className="flex-1 h-full overflow-hidden">
        {activeSessionId ? (
          <PanelGroup orientation="horizontal">
            {/* Chat Area (The Studio) */}
            <Panel defaultSize={35} minSize={25} className="flex flex-col min-w-0 bg-canvas relative">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {isLoadingSession ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin text-ink-muted" />
                  </div>
                ) : (
                  <>
                    <div className="text-center py-6">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-soft border border-hairline mb-3">
                        <PlaySquare className="h-6 w-6 text-brand-indigo" />
                      </div>
                      <h3 className="font-[540] text-lg text-ink">Design Copilot</h3>
                      <p className="text-ink-muted text-sm mt-1 max-w-[40ch] mx-auto block">
                        Describe the look and feel you want, and I will update the design tokens in real-time.
                      </p>
                    </div>

                    {activeSession?.chatHistory?.map((msg, i) => (
                      <div 
                        key={i} 
                        className={cn(
                          "max-w-[85%] rounded-2xl p-4 text-[15px]",
                          msg.role === 'user' 
                            ? "bg-surface-elevated ml-auto text-ink border border-hairline shadow-sm" 
                            : "bg-surface-soft text-ink mr-auto"
                        )}
                      >
                        {msg.content}
                      </div>
                    ))}
                    {isSendingMessage && (
                      <div className="bg-surface-soft text-ink mr-auto max-w-[85%] rounded-2xl p-4 text-[15px] flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-brand-indigo" /> Thinking...
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </>
                )}
              </div>
              
              <div className="p-4 bg-canvas border-t border-hairline">
                <form 
                  onSubmit={handleSend}
                  className="relative flex items-center"
                >
                  <input 
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="E.g., Make it feel more editorial with a serif font..."
                    className="w-full bg-surface-soft border border-hairline rounded-full pl-4 pr-12 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-brand-indigo/30 focus:border-brand-indigo/50 transition-all text-ink placeholder:text-ink-muted"
                    disabled={isSendingMessage}
                  />
                  <button 
                    type="submit"
                    disabled={!input.trim() || isSendingMessage}
                    className="absolute right-2 p-2 bg-ink text-canvas rounded-full disabled:opacity-50 hover:opacity-90 transition-opacity"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </Panel>

            <PanelResizeHandle className="w-1 bg-hairline-soft hover:bg-brand-indigo/50 active:bg-brand-indigo transition-colors flex items-center justify-center cursor-col-resize z-10 relative">
              <div className="absolute flex items-center justify-center h-8 w-4 bg-surface rounded-full border border-hairline shadow-sm">
                <GripVertical className="h-3 w-3 text-ink-muted" />
              </div>
            </PanelResizeHandle>

            {/* Preview Area (The Canvas) */}
            <Panel defaultSize={65} minSize={30} className="bg-[#f7f7f5] relative min-w-0 flex flex-col">
              <div className="h-14 border-b border-[#e6e6e6] bg-[#ffffff] flex items-center justify-between px-4 shrink-0 shadow-sm z-10">
                <span className="text-sm font-[540] text-[#000000]">Live Sandbox</span>
                <button className="px-4 py-1.5 text-sm font-[540] bg-[#000000] text-[#ffffff] rounded-full hover:opacity-90 transition-opacity">
                  Publish System
                </button>
              </div>
              <div className="flex-1 overflow-auto bg-[#ffffff]">
                <LiveSandbox tokens={activeSession?.tokens} />
              </div>
            </Panel>
          </PanelGroup>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-surface-soft">
            <div className="h-16 w-16 bg-canvas border border-hairline rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <PlaySquare className="h-8 w-8 text-brand-indigo" />
            </div>
            <h2 className="text-2xl font-[540] text-ink mb-2">Zenix Copilot</h2>
            <p className="text-ink-muted mb-8 w-full max-w-[60ch] block">
              Create a new session to start designing and generating UI components with your AI Copilot.
            </p>
            <button 
              onClick={() => createNewSession()}
              className="px-6 py-3 bg-ink text-canvas rounded-full text-[15px] font-[540] hover:opacity-90 transition-opacity shadow-sm"
            >
              Start New Session
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
