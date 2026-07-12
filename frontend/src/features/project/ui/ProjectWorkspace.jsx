import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft, ArrowUp, Send, Bot, Loader2, Sparkles, CheckCircle2, Menu,
  X, FileCode2, Download, File, FileCog, FileText, Clock
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
import { toast } from 'react-hot-toast'

// ── helpers ──────────────────────────────────────────────────────────────────

function getFileIcon(filePath = '') {
  if (filePath.includes('agents')) return { bg: 'bg-violet-100', color: 'text-violet-600' }
  if (filePath.includes('ui') || filePath.includes('tokens')) return { bg: 'bg-pink-100', color: 'text-pink-600' }
  if (filePath.includes('task') || filePath.includes('plan')) return { bg: 'bg-amber-100', color: 'text-amber-700' }
  if (filePath.includes('arch') || filePath.includes('overview')) return { bg: 'bg-blue-100', color: 'text-blue-600' }
  return { bg: 'bg-emerald-100', color: 'text-emerald-600' }
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

  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isArtifactsOpen, setIsArtifactsOpen] = useState(false)
  const [artifacts, setArtifacts] = useState([])
  const [activeArtifact, setActiveArtifact] = useState(null)
  const [isGeneratingArtifacts, setIsGeneratingArtifacts] = useState(false)
  const [isSavingArtifact, setIsSavingArtifact] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

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
    const newWidth = Math.min(Math.max(startWidth.current + dx, 300), 760)
    setSidebarWidth(newWidth)
  }
  const handleMouseUp = () => {
    isDragging.current = false
    document.body.style.cursor = ''
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  const inputRef = useRef(null)
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

  // Load project state
  useEffect(() => {
    let isMounted = true
    const loadProject = async () => {
      try {
        const res = await getProject(token, projectId)
        if (res.data && isMounted) {
          setProject(res.data)
          if (res.data.wizard_state?.ideaId) {
            const ws = res.data.wizard_state
            setIdeaId(ws.ideaId)
            const reconstructed = []
            if (ws.prompt) reconstructed.push({ id: 'prompt-user', role: 'user', content: ws.prompt, timestamp: new Date(res.data.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })
            if (ws.history?.length > 0) {
              ws.history.forEach((h, i) => {
                reconstructed.push({ id: `hist-ai-${i}`, role: 'assistant', content: h.question, timestamp: '' })
                reconstructed.push({ id: `hist-user-${i}`, role: 'user', content: h.answer, timestamp: '' })
              })
            }
            if (ws.refinedSpec) {
              reconstructed.push({ id: 'refined-spec', role: 'user', isSpec: true, content: ws.refinedSpec, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })
            } else if (ws.currentQuestion) {
              reconstructed.push({ id: 'current-q', role: 'assistant', content: ws.currentQuestion.question, options: ws.currentQuestion.options || [], timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })
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
            } else if (res.data.wizard_state?.isComplete && res.data.wizard_state?.ideaId) {
              setIsGeneratingArtifacts(true)
              setIsArtifactsOpen(true)
              ;(async () => {
                try {
                  await generateArtifacts(token, res.data.wizard_state.ideaId, { projectId })
                  let pendingArtifacts = await getProjectArtifacts(token, projectId)
                  if (pendingArtifacts?.length > 0) {
                    if (!isMounted) return
                    setArtifacts(pendingArtifacts)
                    setActiveArtifact(pendingArtifacts[0])
                    for (let i = 0; i < pendingArtifacts.length; i++) {
                      if (!isMounted) return
                      try {
                        const singleRes = await generateSingleArtifact(token, projectId, pendingArtifacts[i].file_path)
                        if (singleRes?.artifact && isMounted) {
                          setArtifacts(prev => prev.map(a => a._id === pendingArtifacts[i]._id ? { ...a, content: singleRes.artifact.content } : a))
                          if (i === 0) setActiveArtifact(singleRes.artifact)
                        }
                      } catch (e) { console.error('Failed to generate file:', pendingArtifacts[i].file_path, e) }
                    }
                    if (isMounted) toast.success('Project artifacts generated successfully!')
                  }
                } catch (err) { console.error('Failed during async generation', err) }
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
      const pendingArtifacts = await getProjectArtifacts(token, projectId)
      if (pendingArtifacts?.length > 0) {
        setArtifacts(pendingArtifacts)
        setActiveArtifact(pendingArtifacts[0])
        for (let i = 0; i < pendingArtifacts.length; i++) {
          try {
            const singleRes = await generateSingleArtifact(token, projectId, pendingArtifacts[i].file_path)
            if (singleRes?.artifact) {
              setArtifacts(prev => prev.map(a => a._id === pendingArtifacts[i]._id ? { ...a, content: singleRes.artifact.content } : a))
              if (i === 0) setActiveArtifact(singleRes.artifact)
            }
          } catch (e) { console.error('Failed to generate file:', pendingArtifacts[i].file_path, e) }
        }
      }
      toast.success('Project artifacts generated successfully!')
    } catch (e) {
      console.error(e)
      toast.error('Failed to generate artifacts.')
    } finally { setIsGeneratingArtifacts(false) }
  }

  const handleSend = async (overrideValue = null) => {
    const text = overrideValue !== null ? overrideValue : inputValue
    if (!text.trim() || isProcessing) return
    setInputValue('')
    if (inputRef.current) { inputRef.current.style.height = 'auto' }
    setIsProcessing(true)
    const userMessage = { id: `msg-${Date.now()}`, role: 'user', content: text, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    useChatStore.setState(prev => {
      const newMsgs = [...prev.messages]
      if (newMsgs.length > 0 && newMsgs[newMsgs.length - 1].role === 'assistant') newMsgs[newMsgs.length - 1].options = undefined
      return { messages: [...newMsgs, userMessage] }
    })
    try {
      if (!ideaId) {
        const ideaRes = await createIdea(token, { prompt: text })
        const newIdeaId = ideaRes.data?._id || ideaRes._id
        setIdeaId(newIdeaId)
        const analyzeRes = await analyzeIdea(token, newIdeaId)
        const parsedAnalysis = parseAIResponse(analyzeRes)
        const title = parsedAnalysis.project_title || 'Untitled Project'
        const description = parsedAnalysis.project_description || text
        setProject(prev => ({ ...prev, project_title: title }))
        const convoRes = await processConversation(token, newIdeaId, { history: [] })
        const parsedConvo = parseAIResponse(convoRes)
        if (parsedConvo.is_complete) {
          const specMsg = { id: `spec-${Date.now()}`, role: 'user', isSpec: true, content: parsedConvo.refined_spec, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
          addMessage(specMsg)
          await syncStateToBackend({ ideaId: newIdeaId, prompt: text, history: [], currentQuestion: null, refinedSpec: parsedConvo.refined_spec, isComplete: true }, { project_title: title, project_description: description })
          handleGenerateArtifacts(newIdeaId)
        } else {
          const opts = Array.isArray(parsedConvo.options) ? parsedConvo.options : []
          const qMsg = { id: `q-${Date.now()}`, role: 'assistant', content: parsedConvo.next_question || 'What is the primary feature?', options: opts, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
          addMessage(qMsg)
          await syncStateToBackend({ ideaId: newIdeaId, prompt: text, history: [], currentQuestion: { question: qMsg.content, options: opts }, refinedSpec: null, isComplete: false }, { project_title: title, project_description: description })
        }
      } else if (project?.wizard_state?.isComplete) {
        const hist = []
        const currentMsgs = useChatStore.getState().messages
        for (let i = 0; i < currentMsgs.length - 1; i += 2) {
          if (currentMsgs[i].role === 'user' && currentMsgs[i + 1]?.role === 'assistant') hist.push({ question: currentMsgs[i].content, answer: currentMsgs[i + 1].content })
        }
        const res = await developerChat(token, projectId, { prompt: text, history: hist })
        const aiMessage = { id: `dev-${Date.now()}`, role: 'assistant', content: res?.content || res?.data?.content || 'No response received.', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        addMessage(aiMessage)
        const updatedArtifacts = res?.updatedArtifacts || res?.data?.updatedArtifacts
        if (Array.isArray(updatedArtifacts) && updatedArtifacts.length > 0) {
          setArtifacts(prev => prev.map(a => { const u = updatedArtifacts.find(u => u.file_path === a.file_path); return u ? { ...a, content: u.content } : a }))
          if (activeArtifact) {
            const activeUpdate = updatedArtifacts.find(u => u.file_path === activeArtifact.file_path)
            if (activeUpdate) setActiveArtifact(prev => ({ ...prev, content: activeUpdate.content }))
          }
        }
        await syncStateToBackend({ ...project.wizard_state, devChatHistory: [...(project.wizard_state.devChatHistory || []), { question: text, answer: aiMessage.content }] })
      } else {
        const hist = []
        const currentMsgs = useChatStore.getState().messages
        let currentPrompt = ''
        if (currentMsgs.length > 0) currentPrompt = currentMsgs[0].content
        for (let i = 1; i < currentMsgs.length - 1; i += 2) {
          if (currentMsgs[i].role === 'assistant' && currentMsgs[i + 1]?.role === 'user') hist.push({ question: currentMsgs[i].content, answer: currentMsgs[i + 1].content })
        }
        hist.push({ question: currentMsgs[currentMsgs.length - 1].content, answer: text })
        const res = await processConversation(token, ideaId, { history: hist })
        const parsed = parseAIResponse(res)
        if (parsed.is_complete) {
          const specMsg = { id: `spec-${Date.now()}`, role: 'user', isSpec: true, content: parsed.refined_spec, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
          addMessage(specMsg)
          await syncStateToBackend({ ideaId, prompt: currentPrompt, history: hist, currentQuestion: null, refinedSpec: parsed.refined_spec, isComplete: true })
          handleGenerateArtifacts(ideaId)
        } else {
          const opts = Array.isArray(parsed.options) ? parsed.options : []
          const qMsg = { id: `q-${Date.now()}`, role: 'assistant', content: parsed.next_question || 'Any other details?', options: opts, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
          addMessage(qMsg)
          await syncStateToBackend({ ideaId, prompt: currentPrompt, history: hist, currentQuestion: { question: qMsg.content, options: opts }, refinedSpec: null, isComplete: false })
        }
      }
    } catch (err) {
      console.error('Failed to process message:', err)
      toast.error('Failed to process. Please try again.')
    } finally {
      setIsProcessing(false)
      if (inputRef.current) inputRef.current.focus()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const handleInput = (e) => {
    setInputValue(e.target.value)
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 180)}px`
    }
  }

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

  // ── render ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-dvh w-full bg-background overflow-hidden text-foreground font-sans" data-lenis-prevent="true">
      {/* ── Nav Sidebar ─────────────────────────────────────── */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* ── Main area ───────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-canvas relative">
        {/* Header */}
        <header className="flex h-12 items-center gap-3 border-b border-hairline/60 bg-canvas/95 backdrop-blur-sm px-4 shrink-0 z-10">
          {/* Mobile menu */}
          <button
            type="button"
            className="md:hidden -ml-1 p-1.5 text-ink-muted hover:bg-surface-soft hover:text-ink rounded-md transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-4 w-4" />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 flex-1 min-w-0 text-[13px]">
            <Link to="/dashboard" className="text-ink-muted hover:text-ink transition-colors shrink-0 flex items-center gap-1">
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
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[12px] font-medium rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/20 ${
                isArtifactsOpen
                  ? 'bg-surface-soft text-ink border border-hairline/80'
                  : 'text-ink-muted hover:bg-surface-soft hover:text-ink border border-hairline/60'
              }`}
              aria-label="Toggle artifacts"
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

        {/* ── Chat area ──────────────────────────────────────── */}
        <div className="flex-1 min-h-0 relative flex flex-col">
          {messages.length === 0 ? (
            /* Empty state */
            <EmptyState onSuggestion={(s) => setInputValue(s)} />
          ) : !messages.some(m => m.isSpec) ? (
            /* Interview mode — center the last AI question */
            <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-3xl mx-auto w-full pb-36">
              {messages.filter(m => m.role === 'assistant').slice(-1).map(msg => (
                <div key={msg.id} className="w-full flex flex-col items-center text-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.35 }}
                    className="mb-6"
                  >
                    <AiIcon isAnimating={isProcessing} />
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.08 }}
                    className="text-xl font-medium tracking-tight text-ink mb-8 max-w-2xl leading-[1.5] whitespace-pre-line"
                  >
                    {msg.content}
                  </motion.h2>

                  {msg.options?.length > 0 && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.15 } } }}
                      className="flex flex-wrap justify-center gap-2.5 w-full max-w-xl"
                    >
                      {msg.options.map((opt, idx) => (
                        <motion.button
                          key={idx}
                          variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } }}
                          whileHover={{ y: -1 }}
                          disabled={isProcessing}
                          onClick={() => handleSend(opt)}
                          className="px-4 py-2.5 rounded-full border border-hairline bg-canvas hover:bg-surface-soft hover:border-ink/25 text-[13px] font-medium text-ink transition-all disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/20 shadow-sm"
                        >
                          {opt}
                        </motion.button>
                      ))}
                      {!msg.options.some(o => o.toLowerCase().includes('zenix decide')) && (
                        <motion.button
                          variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } }}
                          whileHover={{ y: -1 }}
                          disabled={isProcessing}
                          onClick={() => handleSend('Let Zenix decide')}
                          className="px-4 py-2.5 rounded-full bg-ink hover:opacity-90 text-[13px] font-medium text-canvas transition-all disabled:opacity-50 flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/20 shadow-md"
                        >
                          <Sparkles className="h-3.5 w-3.5" /> Let Zenix decide
                        </motion.button>
                      )}
                    </motion.div>
                  )}

                  {isProcessing && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-10">
                      <AiThinking />
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            /* Conversation mode — full chat history */
            <MessageScrollerProvider autoScroll={true} defaultScrollPosition="end">
              <MessageScroller className="h-full">
                <MessageScrollerViewport className="px-4 pt-6">
                  <MessageScrollerContent className="max-w-3xl mx-auto pb-44 w-full space-y-1">
                    {messages.map((msg, i) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="w-full"
                      >
                        <MessageScrollerItem messageId={msg.id} scrollAnchor={msg.role === 'user'} className="w-full">

                          {msg.isSpec ? (
                            /* Spec block */
                            <div className="rounded-xl border border-block-lilac/60 bg-block-cream/60 p-6 sm:p-8 w-full mt-4 mb-2">
                              <div className="flex items-center gap-2 text-ink font-semibold mb-5 pb-4 border-b border-ink/10 uppercase tracking-[0.08em] text-[10px] font-mono">
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                                Project Specification Complete
                              </div>
                              <div className="notion-markdown">
                                <pre className="whitespace-pre-wrap text-[14px] leading-relaxed font-sans text-ink">
                                  {typeof msg.content === 'object' ? JSON.stringify(msg.content, null, 2) : msg.content}
                                </pre>
                              </div>
                            </div>
                          ) : msg.role === 'user' ? (
                            /* User message */
                            <div className="flex justify-end py-3">
                              <div className="max-w-[70%] text-right">
                                <p className="text-[15px] text-ink leading-[1.65] font-[340]">
                                  {msg.content}
                                </p>
                                {msg.timestamp && (
                                  <span className="text-[11px] text-ink-muted/60 font-mono mt-1 block">{msg.timestamp}</span>
                                )}
                              </div>
                            </div>
                          ) : (
                            /* AI message */
                            <div className="flex items-start gap-3 py-4">
                              <div className="shrink-0 mt-0.5">
                                <AiIcon isAnimating={isProcessing && i === messages.length - 1} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-[15px] text-ink leading-[1.65] font-[330]">
                                  {msg.content}
                                </p>
                                {/* Option chips for historical messages */}
                                {msg.options?.length > 0 && (
                                  <motion.div
                                    initial="hidden"
                                    animate="visible"
                                    variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } } }}
                                    className="flex flex-wrap gap-2 mt-3"
                                  >
                                    {msg.options.map((opt, idx) => (
                                      <motion.button
                                        key={idx}
                                        variants={{ hidden: { opacity: 0, y: 4 }, visible: { opacity: 1, y: 0 } }}
                                        disabled={isProcessing}
                                        onClick={() => handleSend(opt)}
                                        className="px-3.5 py-1.5 rounded-full border border-hairline bg-canvas hover:bg-surface-soft text-[12px] font-medium text-ink transition-all disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/20"
                                      >
                                        {opt}
                                      </motion.button>
                                    ))}
                                    {!msg.options.some(o => o.toLowerCase().includes('zenix decide')) && (
                                      <motion.button
                                        variants={{ hidden: { opacity: 0, y: 4 }, visible: { opacity: 1, y: 0 } }}
                                        disabled={isProcessing}
                                        onClick={() => handleSend('Let Zenix decide')}
                                        className="px-3.5 py-1.5 rounded-full bg-ink hover:opacity-90 text-[12px] font-medium text-canvas transition-all disabled:opacity-50 flex items-center gap-1.5"
                                      >
                                        <Sparkles className="h-3 w-3" /> Let Zenix decide
                                      </motion.button>
                                    )}
                                  </motion.div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Divider after each message */}
                          {i < messages.length - 1 && (
                            <hr className="border-hairline/30 mx-0" />
                          )}
                        </MessageScrollerItem>
                      </motion.div>
                    ))}

                    {/* AI thinking */}
                    {isProcessing && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-3 py-4">
                        <AiIcon isAnimating />
                        <AiThinking />
                      </motion.div>
                    )}

                    {/* Artifact generation status in chat */}
                    {isGeneratingArtifacts && (
                      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-3 py-4">
                        <AiIcon isAnimating />
                        <div className="flex-1">
                          <GenerationProgress artifacts={artifacts} />
                        </div>
                      </motion.div>
                    )}
                  </MessageScrollerContent>
                </MessageScrollerViewport>
                <MessageScrollerButton />
              </MessageScroller>
            </MessageScrollerProvider>
          )}

          {/* ── Floating Input ────────────────────────────────── */}
          <div className="absolute bottom-0 left-0 right-0 pb-6 px-4 pointer-events-none">
            <div className="max-w-3xl mx-auto pointer-events-auto">
              <div className="floating-input flex items-end gap-2 px-4 py-3">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={handleInput}
                  onKeyDown={handleKeyDown}
                  disabled={isProcessing}
                  placeholder={project?.wizard_state?.isComplete ? 'Ask Zenix Developer…' : 'What would you like to build?'}
                  className="flex-1 bg-transparent resize-none border-none outline-none text-[15px] text-ink placeholder:text-ink-muted/60 max-h-[160px] min-h-[24px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] disabled:opacity-50 w-full focus:ring-0 leading-relaxed"
                  rows={1}
                  style={{ height: '24px' }}
                />
                <button
                  onClick={() => handleSend(null)}
                  disabled={!inputValue.trim() || isProcessing}
                  aria-label="Send message"
                  className="h-8 w-8 rounded-full bg-ink text-canvas hover:opacity-85 disabled:opacity-30 disabled:bg-surface-soft disabled:text-ink-muted transition-all flex items-center justify-center shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
                >
                  {isProcessing
                    ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    : <ArrowUp className="h-3.5 w-3.5" />
                  }
                </button>
              </div>
              <p className="text-center mt-2 text-[10px] text-ink-muted/50 font-mono">
                Zenix AI can make mistakes. Review the generated output carefully.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* ── Artifacts Sidebar ──────────────────────────────────── */}
      <AnimatePresence>
        {isArtifactsOpen && (
          <motion.aside
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            style={{ width: typeof window !== 'undefined' && window.innerWidth >= 768 ? sidebarWidth : '100%' }}
            className="absolute inset-0 z-40 sm:inset-y-0 sm:right-0 sm:left-auto md:relative md:flex-shrink-0 border-l border-hairline/60 bg-canvas shadow-2xl md:shadow-none flex flex-col max-w-full"
          >
            {/* Drag handle */}
            <div
              className="absolute top-0 bottom-0 left-0 w-1.5 cursor-col-resize hover:bg-ink/10 active:bg-ink/20 transition-colors z-50 hidden md:block"
              onMouseDown={handleMouseDown}
            />

            {/* Panel header */}
            <header className="flex h-12 items-center justify-between border-b border-hairline/60 px-4 shrink-0 bg-canvas">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-[540] text-ink">Context Files</span>
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
                    try { await downloadArtifactsZip(token, projectId); toast.success('Downloaded successfully!') }
                    catch { toast.error('Failed to download ZIP') }
                    finally { setIsDownloading(false) }
                  }}
                  disabled={isDownloading || artifacts.length === 0}
                  className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-medium text-ink-muted hover:text-ink hover:bg-surface-soft rounded-md transition-colors disabled:opacity-40 font-mono"
                  title="Download ZIP"
                >
                  {isDownloading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Download className="h-3 w-3" />}
                  <span className="hidden sm:inline">ZIP</span>
                </button>
                <button
                  onClick={() => setIsArtifactsOpen(false)}
                  className="p-1.5 text-ink-muted hover:bg-surface-soft hover:text-ink rounded-md transition-colors md:hidden"
                  aria-label="Close artifacts"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </header>

            {/* Panel content */}
            <div className="flex-1 overflow-hidden flex flex-col">
              {isGeneratingArtifacts ? (
                /* Generation progress list */
                <div className="flex-1 p-4 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  <GenerationProgress artifacts={artifacts} />
                </div>
              ) : artifacts.length === 0 ? (
                /* Empty artifact state */
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                  <div className="h-10 w-10 rounded-xl bg-surface-soft border border-hairline flex items-center justify-center mb-3">
                    <FileCode2 className="h-5 w-5 text-ink-muted/50" />
                  </div>
                  <p className="text-[13px] font-medium text-ink mb-1">No context files yet</p>
                  <p className="text-[12px] text-ink-muted max-w-[180px] leading-relaxed">
                    Files will appear here once the AI generates your project context.
                  </p>
                </div>
              ) : (
                /* File explorer + editor */
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
                          onClick={() => setActiveArtifact(a)}
                          className={`artifact-card w-full text-left ${isActive ? 'active' : ''}`}
                        >
                          {/* File type icon */}
                          <div className={`h-7 w-7 rounded-md ${bg} flex items-center justify-center shrink-0`}>
                            <FileText className={`h-3.5 w-3.5 ${color}`} />
                          </div>
                          {/* File info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-[480] text-ink truncate">
                              {a.file_path?.split('/').pop() || 'file'}
                            </p>
                            <p className="text-[11px] text-ink-muted font-mono truncate">
                              {a.file_path?.includes('/') ? a.file_path.split('/').slice(0, -1).join('/') : ''}
                            </p>
                          </div>
                          {/* Status badge */}
                          <div className="shrink-0">
                            {isReady
                              ? <span className="artifact-status-ready">Ready</span>
                              : <span className="artifact-status-generating">Generating</span>
                            }
                          </div>
                        </motion.button>
                      )
                    })}
                  </div>

                  {/* Editor */}
                  <AnimatePresence mode="wait">
                    {activeArtifact && (
                      <motion.div
                        key={activeArtifact._id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2 }}
                        className="flex-1 flex flex-col min-h-0 p-3"
                      >
                        <div className="flex items-center justify-between mb-2 px-1">
                          <span className="text-[11px] font-mono text-ink-muted">{activeArtifact.file_path}</span>
                          {isSavingArtifact && <Loader2 className="h-3 w-3 animate-spin text-ink-muted" />}
                        </div>
                        <textarea
                          className="flex-1 w-full bg-canvas rounded-xl p-4 resize-none border border-hairline outline-none text-[13px] text-ink font-mono focus:border-ink/25 focus:ring-2 focus:ring-ink/5 transition-all leading-relaxed notion-markdown [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
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
