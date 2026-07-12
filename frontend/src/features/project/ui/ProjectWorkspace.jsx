import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft, ArrowUp, Square, RotateCcw, Bot, Loader2, Sparkles,
  CheckCircle2, Menu, X, FileCode2, Download, FileText, Clock
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { getProject, updateProject } from '../api/projects.api'
import { createIdea } from '../api/ideas.api'
import { processConversation, analyzeIdea, generateArtifacts, generateSingleArtifact, developerChat } from '../api/ai.api'
import { getProjectArtifacts, updateArtifact, downloadArtifactsZip } from '@/features/artifacts/api/artifacts.api'
import {
  MessageScrollerProvider,
  MessageScroller,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerButton,
} from '@/components/ui/message-scroller'
import { Sidebar } from '@/Dashboard/components/Sidebar'
import { useChatStore } from '../store/useChatStore'
import { AiIcon } from './components/AiIcon'
import { AiThinking } from './components/AiThinking'
import { EmptyState } from './components/EmptyState'
import { GenerationProgress } from './components/GenerationProgress'
import { SpecReadyPanel } from './components/SpecReadyPanel'
import { toast } from 'react-hot-toast'

// ── helpers ───────────────────────────────────────────────────────────────────

function getFileIcon(filePath = '') {
  // Vibrant solid block backgrounds based on Figma DESIGN.md schema
  if (filePath.includes('agents')) return { bg: 'bg-[#c5b0f4]', color: 'text-white' } // Lilac
  if (filePath.includes('ui') || filePath.includes('tokens') || filePath.includes('design')) return { bg: 'bg-[#dceeb1]', color: 'text-white' } // Lime
  if (filePath.includes('task') || filePath.includes('plan')) return { bg: 'bg-[#f3c9b6]', color: 'text-white' } // Coral
  if (filePath.includes('arch') || filePath.includes('overview') || filePath.includes('structure')) return { bg: 'bg-[#efd4d4]', color: 'text-white' } // Pink
  return { bg: 'bg-[#c8e6cd]', color: 'text-white' } // Mint (default)
}

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

// Strip options from all messages — called on every user send
function clearAllOptions(messages) {
  return messages.map(m => ({ ...m, options: undefined }))
}

// ── main component ────────────────────────────────────────────────────────────

export function ProjectWorkspace() {
  const { projectId } = useParams()
  const { token } = useAuth()

  const [project, setProject] = useState(null)
  const [ideaId, setIdeaId] = useState(null)
  const { messages, setMessages, addMessage } = useChatStore()
  const [inputValue, setInputValue] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(true)

  // UI state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isArtifactsOpen, setIsArtifactsOpen] = useState(false)
  const [artifacts, setArtifacts] = useState([])
  const [activeArtifact, setActiveArtifact] = useState(null)
  const [isGeneratingArtifacts, setIsGeneratingArtifacts] = useState(false)
  const [isSavingArtifact, setIsSavingArtifact] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  // spec-ready interstitial: shown after spec generates, before dev chat
  const [showSpecReady, setShowSpecReady] = useState(false)
  const [specContent, setSpecContent] = useState(null)

  // retry: store last failed message so user can retry
  const [lastFailedMessage, setLastFailedMessage] = useState(null)

  // abort controller for in-flight cancellation
  const abortControllerRef = useRef(null)

  // resizable artifacts panel
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

  const inputRef = useRef(null)

  // Auto-focus input once loaded
  useEffect(() => {
    if (!isPageLoading && inputRef.current) inputRef.current.focus()
  }, [isPageLoading])

  const parseAIResponse = (res) => {
    try {
      if (typeof res === 'object' && !res.content && (res.project_title || res.next_question || res.is_complete !== undefined)) return res
      let content = res.content || res.data?.content || res
      if (typeof content !== 'string') return content
      content = content.replace(/```json/gi, '').replace(/```/g, '').trim()
      const startObj = content.indexOf('{')
      const startArr = content.indexOf('[')
      const endObj = content.lastIndexOf('}')
      const endArr = content.lastIndexOf(']')
      let start = -1, end = -1
      if (startObj !== -1 && (startArr === -1 || startObj < startArr)) { start = startObj; end = endObj }
      else if (startArr !== -1) { start = startArr; end = endArr }
      if (start !== -1 && end !== -1 && end > start) content = content.substring(start, end + 1)
      return JSON.parse(content)
    } catch (e) {
      console.error('Failed to parse AI response:', e, res)
      return {}
    }
  }

  // Load project + history + artifacts
  useEffect(() => {
    let isMounted = true
    const loadProject = async () => {
      try {
        const res = await getProject(token, projectId)
        if (res.data && isMounted) {
          setProject(res.data)
          const ws = res.data.wizard_state

          if (ws?.ideaId) {
            setIdeaId(ws.ideaId)
            const reconstructed = []

            if (ws.prompt) {
              reconstructed.push({ id: 'prompt-user', role: 'user', content: ws.prompt, timestamp: new Date(res.data.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })
            }

            if (ws.history?.length > 0) {
              ws.history.forEach((h, i) => {
                // Reconstruct interview history without options (already answered)
                reconstructed.push({ id: `hist-ai-${i}`, role: 'assistant', content: h.question, options: undefined, timestamp: '' })
                reconstructed.push({ id: `hist-user-${i}`, role: 'user', content: h.answer, timestamp: '' })
              })
            }

            if (ws.isComplete && ws.refinedSpec) {
              // Don't add spec as a message — show spec-ready panel instead if not in dev chat yet
              if (!ws.devChatHistory?.length) {
                setSpecContent(ws.refinedSpec)
                setShowSpecReady(true)
              } else {
                // Already progressed to dev chat — just set spec as a hidden state
                setSpecContent(ws.refinedSpec)
              }
            } else if (ws.currentQuestion) {
              // Ongoing interview — show current question in thread
              reconstructed.push({
                id: 'current-q',
                role: 'assistant',
                content: ws.currentQuestion.question,
                options: ws.currentQuestion.options || [],
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              })
            }

            if (ws.devChatHistory?.length > 0) {
              ws.devChatHistory.forEach((h, i) => {
                reconstructed.push({ id: `dev-user-${i}`, role: 'user', content: h.question, timestamp: '' })
                reconstructed.push({ id: `dev-ai-${i}`, role: 'assistant', content: h.answer, timestamp: '' })
              })
            }

            useChatStore.getState().setMessages(reconstructed)
          }

          // Fetch artifacts
          try {
            const artifactRes = await getProjectArtifacts(token, projectId)
            if (artifactRes?.length > 0) {
              setArtifacts(artifactRes)
              setActiveArtifact(artifactRes[0])
              setIsArtifactsOpen(true)
            } else if (ws?.isComplete && ws?.ideaId) {
              setIsGeneratingArtifacts(true)
              setIsArtifactsOpen(true)
              ;(async () => {
                try {
                  await generateArtifacts(token, ws.ideaId, { projectId })
                  let pending = await getProjectArtifacts(token, projectId)
                  if (pending?.length > 0 && isMounted) {
                    setArtifacts(pending)
                    setActiveArtifact(pending[0])
                    for (let i = 0; i < pending.length; i++) {
                      if (!isMounted) return
                      try {
                        const r = await generateSingleArtifact(token, projectId, pending[i].file_path)
                        if (r?.artifact && isMounted) {
                          setArtifacts(prev => prev.map(a => a._id === pending[i]._id ? { ...a, content: r.artifact.content } : a))
                          if (i === 0) setActiveArtifact(r.artifact)
                        }
                      } catch (e) { console.error('Failed to generate file:', pending[i].file_path, e) }
                    }
                    if (isMounted) toast.success('Project artifacts generated!')
                  }
                } catch (err) { console.error('Async generation failed', err) }
                finally { if (isMounted) setIsGeneratingArtifacts(false) }
              })()
            }
          } catch (e) { console.error('Failed to fetch artifacts', e) }
        }
      } catch (err) {
        console.error('Failed to load project', err)
        toast.error('Could not load project')
      } finally {
        if (isMounted) setIsPageLoading(false)
      }
    }
    if (token && projectId) loadProject()
    return () => { isMounted = false }
  }, [token, projectId])

  const syncStateToBackend = async (newState, updates = {}) => {
    try { await updateProject(token, projectId, { wizard_state: newState, ...updates }) }
    catch (err) { console.error('Failed to sync state', err) }
  }

  const handleGenerateArtifacts = async (currentIdeaId) => {
    setIsGeneratingArtifacts(true)
    setIsArtifactsOpen(true)
    try {
      await generateArtifacts(token, currentIdeaId, { projectId })
      const pending = await getProjectArtifacts(token, projectId)
      if (pending?.length > 0) {
        setArtifacts(pending)
        setActiveArtifact(pending[0])
        for (let i = 0; i < pending.length; i++) {
          try {
            const r = await generateSingleArtifact(token, projectId, pending[i].file_path)
            if (r?.artifact) {
              setArtifacts(prev => prev.map(a => a._id === pending[i]._id ? { ...a, content: r.artifact.content } : a))
              if (i === 0) setActiveArtifact(r.artifact)
            }
          } catch (e) { console.error('Failed to generate file:', pending[i].file_path, e) }
        }
      }
      toast.success('Project artifacts generated!')
    } catch (e) {
      console.error(e)
      toast.error('Failed to generate artifacts.')
    } finally { setIsGeneratingArtifacts(false) }
  }

  // Cancel in-flight request
  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setIsProcessing(false)
    if (inputRef.current) inputRef.current.focus()
  }

  const handleSend = async (overrideValue = null, isRetry = false) => {
    const text = overrideValue !== null ? overrideValue : inputValue
    if (!text.trim() || isProcessing) return

    setLastFailedMessage(null)
    setInputValue('')
    if (inputRef.current) inputRef.current.style.height = 'auto'
    setIsProcessing(true)

    // Create a fresh AbortController for this request
    const controller = new AbortController()
    abortControllerRef.current = controller

    const userMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    // Add user message and strip ALL option chips from previous messages
    useChatStore.setState(prev => ({
      messages: [...clearAllOptions(prev.messages), userMessage]
    }))

    try {
      if (!ideaId) {
        // ── Step 1: Create idea + analyze
        const ideaRes = await createIdea(token, { prompt: text })
        const newIdeaId = ideaRes.data?._id || ideaRes._id
        setIdeaId(newIdeaId)
        const analyzeRes = await analyzeIdea(token, newIdeaId)
        const parsedAnalysis = parseAIResponse(analyzeRes)
        const title = parsedAnalysis.project_title || 'Untitled Project'
        const description = parsedAnalysis.project_description || text
        setProject(prev => ({ ...prev, project_title: title }))

        // ── Step 2: Start conversation
        const convoRes = await processConversation(token, newIdeaId, { history: [] })
        const parsedConvo = parseAIResponse(convoRes)

        if (parsedConvo.is_complete) {
          // Interview done in one shot — show spec-ready panel
          setSpecContent(parsedConvo.refined_spec)
          setShowSpecReady(true)
          await syncStateToBackend(
            { ideaId: newIdeaId, prompt: text, history: [], currentQuestion: null, refinedSpec: parsedConvo.refined_spec, isComplete: true },
            { project_title: title, project_description: description }
          )
          handleGenerateArtifacts(newIdeaId)
        } else {
          const opts = Array.isArray(parsedConvo.options) ? parsedConvo.options : []
          const qMsg = {
            id: `q-${Date.now()}`,
            role: 'assistant',
            content: parsedConvo.next_question || 'What is the primary feature?',
            options: opts,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
          addMessage(qMsg)
          await syncStateToBackend(
            { ideaId: newIdeaId, prompt: text, history: [], currentQuestion: { question: qMsg.content, options: opts }, refinedSpec: null, isComplete: false },
            { project_title: title, project_description: description }
          )
        }

      } else if (project?.wizard_state?.isComplete) {
        // ── Developer chat mode
        const hist = []
        const currentMsgs = useChatStore.getState().messages
        for (let i = 0; i < currentMsgs.length - 1; i += 2) {
          if (currentMsgs[i].role === 'user' && currentMsgs[i + 1]?.role === 'assistant') {
            hist.push({ question: currentMsgs[i].content, answer: currentMsgs[i + 1].content })
          }
        }
        const res = await developerChat(token, projectId, { prompt: text, history: hist })
        const aiMessage = {
          id: `dev-${Date.now()}`,
          role: 'assistant',
          content: res?.content || res?.data?.content || 'No response received.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
        addMessage(aiMessage)

        // Sync any artifact updates
        const updatedArtifacts = res?.updatedArtifacts || res?.data?.updatedArtifacts
        if (Array.isArray(updatedArtifacts) && updatedArtifacts.length > 0) {
          setArtifacts(prev => prev.map(a => {
            const u = updatedArtifacts.find(u => u.file_path === a.file_path)
            return u ? { ...a, content: u.content } : a
          }))
          if (activeArtifact) {
            const activeUpdate = updatedArtifacts.find(u => u.file_path === activeArtifact.file_path)
            if (activeUpdate) setActiveArtifact(prev => ({ ...prev, content: activeUpdate.content }))
          }
        }
        await syncStateToBackend({
          ...project.wizard_state,
          devChatHistory: [...(project.wizard_state.devChatHistory || []), { question: text, answer: aiMessage.content }]
        })

      } else {
        // ── Continue interview conversation
        const hist = []
        const currentMsgs = useChatStore.getState().messages
        let currentPrompt = currentMsgs[0]?.content || ''
        for (let i = 1; i < currentMsgs.length - 1; i += 2) {
          if (currentMsgs[i].role === 'assistant' && currentMsgs[i + 1]?.role === 'user') {
            hist.push({ question: currentMsgs[i].content, answer: currentMsgs[i + 1].content })
          }
        }
        hist.push({ question: currentMsgs[currentMsgs.length - 1]?.content || '', answer: text })

        const res = await processConversation(token, ideaId, { history: hist })
        const parsed = parseAIResponse(res)

        if (parsed.is_complete) {
          // Interview complete — show spec-ready panel
          setSpecContent(parsed.refined_spec)
          setShowSpecReady(true)
          await syncStateToBackend({ ideaId, prompt: currentPrompt, history: hist, currentQuestion: null, refinedSpec: parsed.refined_spec, isComplete: true })
          handleGenerateArtifacts(ideaId)
        } else {
          const opts = Array.isArray(parsed.options) ? parsed.options : []
          const qMsg = {
            id: `q-${Date.now()}`,
            role: 'assistant',
            content: parsed.next_question || 'Any other details?',
            options: opts,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
          addMessage(qMsg)
          await syncStateToBackend({ ideaId, prompt: currentPrompt, history: hist, currentQuestion: { question: qMsg.content, options: opts }, refinedSpec: null, isComplete: false })
        }
      }
    } catch (err) {
      // Don't show error for user-initiated cancellation
      if (err?.name === 'AbortError' || controller.signal.aborted) {
        return
      }
      console.error('Failed to process message:', err)
      toast.error('Something went wrong. Try again.')
      setLastFailedMessage(text)
    } finally {
      abortControllerRef.current = null
      setIsProcessing(false)
      if (inputRef.current) inputRef.current.focus()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  // Auto-grow textarea, clamped to max-h-[120px] so it never covers the chat
  const handleInput = (e) => {
    setInputValue(e.target.value)
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      // Clamp: 24px min, 120px max — keeps input from obscuring chat messages
      const clamped = Math.min(inputRef.current.scrollHeight, 120)
      inputRef.current.style.height = `${clamped}px`
    }
  }

  // Determine chat state
  const hasMessages = messages.length > 0
  const isInInterview = hasMessages && !project?.wizard_state?.isComplete && !showSpecReady
  const isInDevChat = hasMessages && project?.wizard_state?.isComplete && !showSpecReady

  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-lg ai-icon-gradient flex items-center justify-center ai-icon-thinking">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-xs text-ink-muted font-mono">Loading workspace…</span>
        </div>
      </div>
    )
  }

  // ── render ────────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-dvh w-full bg-background overflow-hidden text-foreground font-sans" data-lenis-prevent="true">
      {/* ── Nav Sidebar ──────────────────────────────────────── */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* ── Main area ────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-canvas relative">

        {/* Header */}
        <header className="flex h-12 items-center gap-3 border-b border-hairline/60 bg-canvas/95 backdrop-blur-sm px-4 shrink-0 z-10">
          {/* Mobile menu */}
          <button
            type="button"
            className="md:hidden -ml-1 p-1.5 text-ink-muted hover:bg-surface-soft hover:text-ink rounded-md transition-colors cursor-pointer"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-4 w-4" />
          </button>

          {/* Breadcrumb */}
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

          {/* Right meta */}
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
              <FileCode2 className="h-3.5 w-3.5" />
              <span>Context</span>
              {artifacts.length > 0 && (
                <span className="inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-ink text-canvas text-[10px] font-mono">
                  {artifacts.length}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* ── Chat area ────────────────────────────────────────── */}
        <div className="flex-1 min-h-0 relative flex flex-col">

          {/* ── UNIFIED CONVERSATION THREAD ── */}
          {/* One MessageScrollerProvider for ALL states — no layout jumps */}
          <MessageScrollerProvider autoScroll={true} defaultScrollPosition="end">
            <MessageScroller className="h-full">
              <MessageScrollerViewport className="px-4 pt-6">
                <MessageScrollerContent className="max-w-3xl mx-auto pb-44 w-full">

                  {/* Empty state — overlaid inside the scroll area when no messages */}
                  {!hasMessages && (
                    <div className="min-h-[60vh] flex items-center justify-center">
                      <EmptyState onSuggestion={(s) => setInputValue(s)} />
                    </div>
                  )}

                  {/* ── Message list ── */}
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
                          /* ── User message — right-aligned, font-normal (400) ── */
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
                          /* ── AI message — left-aligned with icon, font-light (300) ── */
                          <div className="flex items-start gap-3 py-4">
                            <div className="shrink-0 mt-0.5">
                              <AiIcon isAnimating={isProcessing && i === messages.length - 1} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[15px] text-ink leading-[1.65] font-light">
                                {msg.content}
                              </p>

                              {/* Option chips — only rendered if not yet answered */}
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

                        {/* Divider between messages (not after the last one) */}
                        {i < messages.length - 1 && (
                          <hr className="border-hairline/60" />
                        )}
                      </MessageScrollerItem>
                    </motion.div>
                  ))}

                  {/* AI thinking indicator */}
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

                  {/* Artifact generation progress (inside chat thread) */}
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

          {/* ── Spec-ready panel — overlays the chat area ── */}
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

          {/* ── Floating Input ────────────────────────────────── */}
          {/* Hidden behind the spec-ready panel when it's showing */}
          <div className={`absolute bottom-0 left-0 right-0 pb-6 px-4 z-10 pointer-events-none transition-opacity duration-200 ${showSpecReady ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <div className="max-w-3xl mx-auto pointer-events-auto">

              {/* Retry bar — shown after a failed send */}
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
                      onClick={() => handleSend(lastFailedMessage, true)}
                      className="flex items-center gap-1.5 text-[12px] font-medium text-ink hover:opacity-70 transition-opacity cursor-pointer shrink-0 ml-3"
                    >
                      <RotateCcw className="h-3 w-3" />
                      Retry
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Input pill */}
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

                {/* Stop / Send button */}
                {isProcessing ? (
                  <button
                    onClick={handleCancel}
                    aria-label="Stop generation"
                    title="Stop"
                    className="h-8 w-8 rounded-full bg-ink text-canvas hover:opacity-80 transition-all flex items-center justify-center shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
                  >
                    <Square className="h-3 w-3 fill-current" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleSend(null)}
                    disabled={!inputValue.trim()}
                    aria-label="Send message"
                    className="h-8 w-8 rounded-full bg-ink text-canvas hover:opacity-85 disabled:opacity-30 disabled:bg-surface-soft disabled:text-ink-muted transition-all flex items-center justify-center shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              {/* Hint text */}
              <p className="text-center mt-2 text-[11px] text-ink-muted/45 font-mono">
                Zenix AI can make mistakes. Review output carefully.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* ── Artifacts Sidebar ─────────────────────────────────── */}
      <AnimatePresence>
        {isArtifactsOpen && (
          <motion.aside
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            style={{ width: typeof window !== 'undefined' && window.innerWidth >= 768 ? sidebarWidth : '100%' }}
            className="absolute inset-0 z-40 sm:inset-y-0 sm:right-0 sm:left-auto md:relative md:flex-shrink-0 border-l border-hairline/60 bg-canvas shadow-xl md:shadow-none flex flex-col max-w-full"
          >
            {/* Drag handle */}
            <div
              className="absolute top-0 bottom-0 left-0 w-1.5 cursor-col-resize hover:bg-ink/10 active:bg-ink/20 transition-colors z-50 hidden md:block"
              onMouseDown={handleMouseDown}
            />

            {/* Panel header */}
            <header className="flex h-12 items-center justify-between border-b border-hairline/60 px-4 shrink-0 bg-canvas">
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
                  onClick={async () => {
                    setIsDownloading(true)
                    try { await downloadArtifactsZip(token, projectId); toast.success('Downloaded!') }
                    catch { toast.error('Failed to download ZIP') }
                    finally { setIsDownloading(false) }
                  }}
                  disabled={isDownloading || artifacts.length === 0}
                  className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-medium text-ink-muted hover:text-ink hover:bg-surface-soft rounded-md transition-colors disabled:opacity-40 font-mono cursor-pointer"
                  title="Download ZIP"
                >
                  {isDownloading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Download className="h-3 w-3" />}
                  <span className="hidden sm:inline">ZIP</span>
                </button>
                <button
                  onClick={() => setIsArtifactsOpen(false)}
                  className="p-1.5 text-ink-muted hover:bg-surface-soft hover:text-ink rounded-md transition-colors md:hidden cursor-pointer"
                  aria-label="Close artifacts"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </header>

            {/* Panel content */}
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
                    Files will appear once the AI generates your project context.
                  </p>
                </div>
              ) : (
                <div className="flex-1 flex flex-col min-h-0">
                  {/* File list */}
                  <div className="shrink-0 p-3 space-y-1.5 border-b border-hairline/50 max-h-[45%] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {artifacts.map(a => {
                      const { bg, color } = getFileIcon(a.file_path || '')
                      const isReady = a.content && a.content !== 'Pending generation...'
                      const isActive = activeArtifact?._id === a._id
                      return (
                        <motion.button
                          key={a._id}
                          whileHover={{ x: 1 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => setActiveArtifact(a)}
                          className={`artifact-card w-full text-left cursor-pointer border ${isActive ? 'border-ink bg-surface-soft shadow-sm' : 'border-hairline bg-canvas'}`}
                        >
                          <div className={`h-8 w-8 rounded-lg ${bg.replace('bg-[', 'bg-').split(' ')[0]} flex items-center justify-center shrink-0 shadow-sm`}>
                            <FileText className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-medium text-ink truncate">
                              {a.file_path?.split('/').pop() || 'file'}
                            </p>
                            <p className="text-[11px] text-ink-muted font-mono truncate">
                              {a.file_path?.includes('/') ? a.file_path.split('/').slice(0, -1).join('/') : ''}
                            </p>
                          </div>
                          <div className="shrink-0 flex items-center gap-2">
                            {/* Color-matching status dot indicator */}
                            <span className={`h-1.5 w-1.5 rounded-full ${isReady ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-ping'}`} />
                            {isReady
                              ? <span className="artifact-status-ready">Ready</span>
                              : <span className="artifact-status-generating">Generating</span>
                            }
                          </div>
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
                            <span className="text-[11px] font-mono font-medium text-ink-muted truncate max-w-[150px]">{activeArtifact.file_path}</span>
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
                          onChange={(e) => {
                            const newContent = e.target.value
                            setActiveArtifact({ ...activeArtifact, content: newContent })
                            if (window.saveTimeout) clearTimeout(window.saveTimeout)
                            window.saveTimeout = setTimeout(async () => {
                              setIsSavingArtifact(true)
                              try {
                                await updateArtifact(token, activeArtifact._id, { content: newContent })
                                setArtifacts(prev => prev.map(a => a._id === activeArtifact._id ? { ...a, content: newContent } : a))
                              } catch { toast.error('Failed to save artifact') }
                              finally { setIsSavingArtifact(false) }
                            }, 1000)
                          }}
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
    </div>
  )
}
