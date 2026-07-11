import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Send, User, Bot, Loader2 } from 'lucide-react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { getProject } from '../api/projects.api'
import {
  MessageScrollerProvider,
  MessageScroller,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerButton,
} from '@/components/ui/message-scroller'
import toast from 'react-hot-toast'

export function ProjectChatPage() {
  const { projectId } = useParams()
  const { token } = useAuth()
  const intervalRef = useRef(null)

  // Clear interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)

  // Fetch the project to get the refinedSpec (AI prompt)
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await getProject(token, projectId)
        if (res.data) {
          setProject(res.data)
          const spec = res.data.wizard_state?.refinedSpec || ''
          setInputValue(spec) // Pre-fill input with the refined spec
          
          // Initial greeting message
          setMessages([
            {
              id: 'greeting',
              role: 'assistant',
              content: `Welcome to the developer playground for **${res.data.project_title || 'your project'}**! I have pre-filled your custom AI Prompts and Specification in the input box below. Feel free to refine it or test out queries.`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          ])
        }
      } catch (err) {
        console.error('Failed to load project details:', err)
        toast.error('Could not fetch project details.')
      } finally {
        setLoading(false)
      }
    }

    if (token && projectId) {
      fetchProject()
    }
  }, [token, projectId])

  const handleSend = () => {
    if (!inputValue.trim() || isStreaming) return

    const userMessageId = `msg-${Date.now()}`
    const newUserMessage = {
      id: userMessageId,
      role: 'user',
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, newUserMessage])
    setInputValue('')
    setIsStreaming(true)

    // Simulate streaming reply
    const assistantMessageId = `msg-reply-${Date.now()}`
    const fullReply = `I've received your specification. Here is a simulated analysis of your target build plan:
    
- **Tech Stack**: Next.js (Vite), Node.js, Express, MongoDB.
- **Color Scheme**: Zenix default monochromatic palette.
- **Typography Scale**: Inter (headings and user controls).

Your requirements have been cataloged. You can trigger the context engine to build out the full structure anytime!`
    
    // Add empty assistant turn
    setMessages((prev) => [
      ...prev,
      {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ])

    let index = 0
    intervalRef.current = setInterval(() => {
      setMessages((prev) => {
        return prev.map((m) => {
          if (m.id === assistantMessageId) {
            const nextContent = fullReply.substring(0, index + 3)
            return { ...m, content: nextContent }
          }
          return m
        })
      })
      index += 3
      if (index >= fullReply.length) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
        setIsStreaming(false)
      }
    }, 15)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-ink-muted" />
      </div>
    )
  }

  return (
    <div className="h-screen bg-canvas flex flex-col overflow-hidden">
      {/* Top Header */}
      <header className="border-b border-hairline bg-surface/80 backdrop-blur px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link
            to={`/projects/${projectId}`}
            className="p-2 -ml-2 rounded-full hover:bg-canvas text-ink-muted hover:text-ink transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-body-sm font-540 text-ink tracking-tight">
              {project?.project_title || 'Dating Site for Developers'}
            </h1>
            <p className="text-caption text-ink-muted">Developer Chat Sandbox</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-caption text-ink-muted">AI Spec Engine Active</span>
        </div>
      </header>

      {/* Message Scroller Container */}
      <div className="flex-1 min-h-0 relative max-w-4xl w-full mx-auto px-4 md:px-0 py-4">
        <MessageScrollerProvider autoScroll={true} defaultScrollPosition="end">
          <MessageScroller className="h-full">
            <MessageScrollerViewport className="pr-2 space-y-4">
              <MessageScrollerContent className="space-y-4 pb-24">
                {messages.map((msg) => (
                  <MessageScrollerItem
                    key={msg.id}
                    messageId={msg.id}
                    scrollAnchor={msg.role === 'user'}
                  >
                    <div
                      className={`flex gap-4 p-5 rounded-2xl border transition-all ${
                        msg.role === 'user'
                          ? 'bg-surface/50 border-hairline/80 ml-12'
                          : 'bg-surface border-hairline mr-12'
                      }`}
                    >
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                          msg.role === 'user' ? 'bg-ink text-canvas' : 'bg-canvas border border-hairline text-ink-muted'
                        }`}
                      >
                        {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-caption font-540 text-ink">
                            {msg.role === 'user' ? 'You' : 'Zenix Architect'}
                          </span>
                          <span className="text-[10px] text-ink-muted">{msg.timestamp}</span>
                        </div>
                        <div className="text-body-sm text-ink-muted whitespace-pre-wrap leading-relaxed">
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  </MessageScrollerItem>
                ))}
                
                {isStreaming && (
                  <div className="flex items-center gap-2 text-caption text-ink-muted pl-16">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Streaming response...</span>
                  </div>
                )}
              </MessageScrollerContent>
            </MessageScrollerViewport>
            <MessageScrollerButton />
          </MessageScroller>
        </MessageScrollerProvider>
      </div>

      {/* Input Area */}
      <div className="border-t border-hairline bg-surface/50 p-4 shrink-0">
        <div className="max-w-4xl mx-auto flex items-end gap-3 bg-surface border border-hairline rounded-2xl p-2 pl-4 shadow-sm">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="Type a message or edit the spec..."
            className="flex-1 bg-transparent resize-none border-none outline-none text-body-sm text-ink-muted placeholder:text-ink-muted/50 max-h-32 py-2 pr-2 scrollbar-none font-sans"
            rows={2}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isStreaming}
            className="h-10 w-10 rounded-xl bg-ink text-canvas hover:opacity-90 disabled:opacity-30 transition-all flex items-center justify-center shrink-0"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
