import { useEffect, useState, useRef } from 'react'
import { Plus, Trash2, Send, PlaySquare, ArrowLeft, Loader2 } from 'lucide-react'
import { usePlayground } from '../hooks/usePlayground'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

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
      {/* Sidebar */}
      <div className="w-64 border-r border-hairline bg-surface flex flex-col shrink-0">
        <div className="p-4 border-b border-hairline flex items-center justify-between">
          <Link to="/dashboard" className="text-ink-muted hover:text-ink transition-colors" title="Back to Dashboard">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h2 className="font-[540] text-ink">Playground</h2>
          <button 
            onClick={() => createNewSession()}
            className="p-1.5 hover:bg-surface-soft rounded-md transition-colors text-ink"
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
                    ? "bg-surface-elevated border border-hairline" 
                    : "hover:bg-surface-soft border border-transparent"
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
        {activeSessionId ? (
          <>
            {/* Chat Area */}
            <div className="flex-1 flex flex-col min-w-0 border-r border-hairline bg-canvas relative">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {isLoadingSession ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin text-ink-muted" />
                  </div>
                ) : (
                  <>
                    {activeSession?.chatHistory?.map((msg, i) => (
                      <div 
                        key={i} 
                        className={cn(
                          "max-w-[85%] rounded-2xl p-4 text-[15px]",
                          msg.role === 'user' 
                            ? "bg-surface-elevated ml-auto text-ink border border-hairline" 
                            : "bg-surface-soft text-ink mr-auto"
                        )}
                      >
                        {msg.content}
                      </div>
                    ))}
                    {isSendingMessage && (
                      <div className="bg-surface-soft text-ink mr-auto max-w-[85%] rounded-2xl p-4 text-[15px] flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> Thinking...
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
                    placeholder="Describe your design..."
                    className="w-full bg-surface border border-hairline rounded-full pl-4 pr-12 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink/50 transition-all text-ink placeholder:text-ink-muted"
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
            </div>

            {/* Preview Area */}
            <div className="flex-1 bg-white relative min-w-0 flex flex-col">
              <div className="h-12 border-b border-hairline bg-surface-soft flex items-center px-4 shrink-0 border-solid">
                <span className="text-sm font-[540] text-ink">Live Preview</span>
              </div>
              <div className="flex-1 overflow-auto bg-white">
                {activeSession?.previewHtml ? (
                  <iframe 
                    srcDoc={activeSession.previewHtml} 
                    className="w-full h-full border-none"
                    sandbox="allow-scripts"
                    title="preview"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-ink-muted text-sm">
                    No preview available yet.
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="h-16 w-16 bg-surface border border-hairline rounded-2xl flex items-center justify-center mb-6">
              <PlaySquare className="h-8 w-8 text-ink-muted" />
            </div>
            <h2 className="text-2xl font-[540] text-ink mb-2">AI Playground</h2>
            <p className="text-ink-muted mb-8 max-w-md">
              Create a new session to start designing and generating UI components with AI.
            </p>
            <button 
              onClick={() => createNewSession()}
              className="px-6 py-3 bg-ink text-canvas rounded-lg text-[15px] font-[540] hover:opacity-90 transition-opacity"
            >
              Start New Session
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
