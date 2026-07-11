import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Send, User, Bot, Loader2, Sparkles, CheckCircle2, Menu, PanelRightClose, PanelRightOpen, X, FileCode2, Download, ChevronDown } from 'lucide-react'
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
import { TextShimmerWave } from '@/components/ui/text-shimmer-wave'
import { Sidebar } from '@/Dashboard/components/Sidebar'
import { useChatStore } from '../store/useChatStore'

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
  const [isFileMenuOpen, setIsFileMenuOpen] = useState(false)
  
  const [sidebarWidth, setSidebarWidth] = useState(400)
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
    const newWidth = Math.min(Math.max(startWidth.current + dx, 320), 800)
    setSidebarWidth(newWidth)
  }
  
  const handleMouseUp = () => {
    isDragging.current = false
    document.body.style.cursor = ''
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }
  
  const inputRef = useRef(null)

  // Focus input on mount
  useEffect(() => {
    if (!isPageLoading && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isPageLoading])

  const parseAIResponse = (res) => {
    try {
      if (typeof res === 'object' && !res.content && (res.project_title || res.next_question || res.is_complete !== undefined)) return res;
      let content = res.content || res.data?.content || res;
      if (typeof content !== 'string') return content;
      content = content.replace(/```json/gi, '').replace(/```/g, '').trim();
      const startObj = content.indexOf('{');
      const startArr = content.indexOf('[');
      const endObj = content.lastIndexOf('}');
      const endArr = content.lastIndexOf(']');
      let start = -1, end = -1;
      if (startObj !== -1 && (startArr === -1 || startObj < startArr)) {
        start = startObj; end = endObj;
      } else if (startArr !== -1) {
        start = startArr; end = endArr;
      }
      if (start !== -1 && end !== -1 && end > start) {
        content = content.substring(start, end + 1);
      }
      return JSON.parse(content);
    } catch (e) {
      console.error("Failed to parse AI response:", e, res);
      return {};
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
            
            // Reconstruct messages from history
            const reconstructed = []
            
            // 1. Initial Prompt
            if (ws.prompt) {
              reconstructed.push({
                id: 'prompt-user',
                role: 'user',
                content: ws.prompt,
                timestamp: new Date(res.data.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              })
            }
            
            // 2. History Q&A
            if (ws.history && ws.history.length > 0) {
              ws.history.forEach((h, i) => {
                reconstructed.push({
                  id: `hist-ai-${i}`,
                  role: 'assistant',
                  content: h.question,
                  timestamp: ''
                })
                reconstructed.push({
                  id: `hist-user-${i}`,
                  role: 'user',
                  content: h.answer,
                  timestamp: ''
                })
              })
            }
            
            // 3. Current State
            if (ws.refinedSpec) {
              reconstructed.push({
                id: 'refined-spec',
                role: 'user',
                isSpec: true,
                content: ws.refinedSpec,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              })
            } else if (ws.currentQuestion) {
              reconstructed.push({
                id: 'current-q',
                role: 'assistant',
                content: ws.currentQuestion.question,
                options: ws.currentQuestion.options || [],
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              })
            }
            
            // 4. Dev Chat History
            if (ws.devChatHistory && ws.devChatHistory.length > 0) {
              ws.devChatHistory.forEach((h, i) => {
                reconstructed.push({
                  id: `dev-user-${i}`,
                  role: 'user',
                  content: h.question,
                  timestamp: ''
                })
                reconstructed.push({
                  id: `dev-ai-${i}`,
                  role: 'assistant',
                  content: h.answer,
                  timestamp: ''
                })
              })
            }
            
            useChatStore.getState().setMessages(reconstructed)
          }
          // Fetch artifacts
          try {
            const artifactRes = await getProjectArtifacts(token, projectId)
            if (artifactRes && artifactRes.length > 0) {
              setArtifacts(artifactRes)
              setActiveArtifact(artifactRes[0])
              setIsArtifactsOpen(true)
            } else if (res.data.wizard_state?.isComplete && res.data.wizard_state?.ideaId) {
              setIsGeneratingArtifacts(true)
              setIsArtifactsOpen(true)
              
              const newArtRes = await generateArtifacts(token, res.data.wizard_state.ideaId, { projectId })
              let pendingArtifacts = await getProjectArtifacts(token, projectId);
              
              if (pendingArtifacts && pendingArtifacts.length > 0) {
                setArtifacts(pendingArtifacts)
                setActiveArtifact(pendingArtifacts[0])
                
                // Sequentially generate each pending artifact
                for (let i = 0; i < pendingArtifacts.length; i++) {
                  try {
                    const singleRes = await generateSingleArtifact(token, projectId, pendingArtifacts[i].file_path);
                    if (singleRes && singleRes.artifact) {
                      setArtifacts(prev => prev.map(a => a._id === pendingArtifacts[i]._id ? { ...a, content: singleRes.artifact.content } : a));
                      if (i === 0) setActiveArtifact(singleRes.artifact); // Update active if it's the first one
                    }
                  } catch (e) {
                    console.error("Failed to generate file:", pendingArtifacts[i].file_path, e);
                  }
                }
                toast.success("Project artifacts generated successfully!")
              }
              setIsGeneratingArtifacts(false)
            }
          } catch (e) {
            console.error("Failed to fetch artifacts", e)
          }

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
    try {
      await updateProject(token, projectId, { wizard_state: newState, ...updates })
    } catch (err) {
      console.error('Failed to sync state', err)
    }
  }

  const handleGenerateArtifacts = async (currentIdeaId) => {
    setIsGeneratingArtifacts(true)
    setIsArtifactsOpen(true) // Open it so user sees the loading state
    try {
      await generateArtifacts(token, currentIdeaId, { projectId })
      const pendingArtifacts = await getProjectArtifacts(token, projectId)
      if (pendingArtifacts && pendingArtifacts.length > 0) {
        setArtifacts(pendingArtifacts)
        setActiveArtifact(pendingArtifacts[0])
        
        for (let i = 0; i < pendingArtifacts.length; i++) {
          try {
            const singleRes = await generateSingleArtifact(token, projectId, pendingArtifacts[i].file_path);
            if (singleRes && singleRes.artifact) {
              setArtifacts(prev => prev.map(a => a._id === pendingArtifacts[i]._id ? { ...a, content: singleRes.artifact.content } : a));
              if (i === 0) setActiveArtifact(singleRes.artifact);
            }
          } catch (e) {
            console.error("Failed to generate file:", pendingArtifacts[i].file_path, e);
          }
        }
      }
      toast.success("Project artifacts generated successfully!")
    } catch (e) {
      console.error(e)
      toast.error("Failed to generate artifacts.")
    } finally {
      setIsGeneratingArtifacts(false)
    }
  }

  const handleSend = async (overrideValue = null) => {
    const text = overrideValue !== null ? overrideValue : inputValue
    if (!text.trim() || isProcessing) return

    setInputValue('')
    setIsProcessing(true)

    const userMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    // Remove options from the last assistant message
    useChatStore.setState(prev => {
      const newMsgs = [...prev.messages]
      if (newMsgs.length > 0 && newMsgs[newMsgs.length - 1].role === 'assistant') {
        newMsgs[newMsgs.length - 1].options = undefined
      }
      return { messages: [...newMsgs, userMessage] }
    })

    try {
      if (!ideaId) {
        // Step 1: Create Idea & Analyze
        const ideaRes = await createIdea(token, { prompt: text })
        const newIdeaId = ideaRes.data?._id || ideaRes._id
        setIdeaId(newIdeaId)
        
        const analyzeRes = await analyzeIdea(token, newIdeaId)
        const parsedAnalysis = parseAIResponse(analyzeRes)
        
        const title = parsedAnalysis.project_title || 'Untitled Project'
        const description = parsedAnalysis.project_description || text
        setProject(prev => ({ ...prev, project_title: title }))

        // Step 2: Start Conversation
        const convoRes = await processConversation(token, newIdeaId, { history: [] })
        const parsedConvo = parseAIResponse(convoRes)
        
        if (parsedConvo.is_complete) {
          const specMsg = {
            id: `spec-${Date.now()}`,
            role: 'user',
            isSpec: true,
            content: parsedConvo.refined_spec,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
          addMessage(specMsg)
          await syncStateToBackend(
            { ideaId: newIdeaId, prompt: text, history: [], currentQuestion: null, refinedSpec: parsedConvo.refined_spec, isComplete: true },
            { project_title: title, project_description: description }
          )
          handleGenerateArtifacts(newIdeaId)
        } else {
          const opts = parsedConvo.options && Array.isArray(parsedConvo.options) ? parsedConvo.options : [];
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
        // Developer Chat
        const hist = []
        const currentMsgs = useChatStore.getState().messages;
        for (let i = 0; i < currentMsgs.length - 1; i += 2) {
          if (currentMsgs[i].role === 'user' && currentMsgs[i+1]?.role === 'assistant') {
            hist.push({ question: currentMsgs[i].content, answer: currentMsgs[i+1].content })
          }
        }
        
        const res = await developerChat(token, projectId, { prompt: text, history: hist })
        
        const aiMessage = {
          id: `dev-${Date.now()}`,
          role: 'assistant',
          content: res?.content || res?.data?.content || "No response received.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        addMessage(aiMessage)

        // If the AI updated any artifacts in real-time, sync them to the UI
        const updatedArtifacts = res?.updatedArtifacts || res?.data?.updatedArtifacts;
        if (updatedArtifacts && Array.isArray(updatedArtifacts) && updatedArtifacts.length > 0) {
          setArtifacts(prev => prev.map(a => {
            const update = updatedArtifacts.find(u => u.file_path === a.file_path);
            return update ? { ...a, content: update.content } : a;
          }));
          
          if (activeArtifact) {
            const activeUpdate = updatedArtifacts.find(u => u.file_path === activeArtifact.file_path);
            if (activeUpdate) {
              setActiveArtifact(prev => ({ ...prev, content: activeUpdate.content }));
            }
          }
        }
        
        // Save developer chat history to wizard_state in DB
        await syncStateToBackend({
          ...project.wizard_state,
          devChatHistory: [...(project.wizard_state.devChatHistory || []), { question: text, answer: aiMessage.content }]
        })
      } else {
        // Continue conversation
        // Rebuild history from messages
        const hist = []
        const currentMsgs = useChatStore.getState().messages;
        let currentPrompt = ''
        if (currentMsgs.length > 0) currentPrompt = currentMsgs[0].content
        
        for (let i = 1; i < currentMsgs.length - 1; i += 2) {
          if (currentMsgs[i].role === 'assistant' && currentMsgs[i+1]?.role === 'user') {
            hist.push({ question: currentMsgs[i].content, answer: currentMsgs[i+1].content })
          }
        }
        hist.push({ 
          question: currentMsgs[currentMsgs.length - 1].content, 
          answer: text 
        })
        
        const res = await processConversation(token, ideaId, { history: hist })
        const parsed = parseAIResponse(res)
        
        if (parsed.is_complete) {
          const specMsg = {
            id: `spec-${Date.now()}`,
            role: 'user',
            isSpec: true,
            content: parsed.refined_spec,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
          addMessage(specMsg)
          await syncStateToBackend({ 
            ideaId, prompt: currentPrompt, history: hist, currentQuestion: null, refinedSpec: parsed.refined_spec, isComplete: true 
          })
          handleGenerateArtifacts(ideaId)
        } else {
          const opts = parsed.options && Array.isArray(parsed.options) ? parsed.options : [];
          const qMsg = {
            id: `q-${Date.now()}`,
            role: 'assistant',
            content: parsed.next_question || 'Any other details?',
            options: opts,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
          addMessage(qMsg)
          await syncStateToBackend({ 
            ideaId, prompt: currentPrompt, history: hist, currentQuestion: { question: qMsg.content, options: opts }, refinedSpec: null, isComplete: false 
          })
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
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = (e) => {
    setInputValue(e.target.value)
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 200)}px`
    }
  }

  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-ink-muted" />
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
      
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-canvas">
        {/* Header */}
        <header className="flex h-14 items-center gap-3 border-b border-hairline/50 bg-background px-4 shrink-0">
          <button
            type="button"
            className="md:hidden -ml-1 p-2 text-ink-muted hover:bg-surface-soft hover:text-ink rounded-md transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="font-medium text-ink text-sm flex items-center gap-2 flex-1">
            <Link to="/dashboard" className="text-ink-muted hover:text-ink transition-colors">
              Projects
            </Link>
            <span className="text-ink-muted/50">/</span>
            <span>{project?.project_title || 'New Project'}</span>
          </div>
          
          <button
            onClick={() => setIsArtifactsOpen(!isArtifactsOpen)}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 ${
              isArtifactsOpen 
                ? 'bg-surface-soft text-ink' 
                : 'text-ink-muted bg-canvas hover:bg-surface-soft hover:text-ink border border-hairline'
            }`}
            aria-label="Toggle artifacts sidebar"
          >
            {isArtifactsOpen ? (
              <>
                <PanelRightClose className="h-4 w-4" />
                <span>Artifacts</span>
              </>
            ) : (
              <>
                <PanelRightOpen className="h-4 w-4" />
                <span>Artifacts</span>
              </>
            )}
          </button>
        </header>

        {/* Main Chat Area */}
        <div className="flex-1 min-h-0 relative flex flex-col">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-2xl mx-auto w-full text-center mt-[-5%]">
            <h1 className="text-4xl font-medium tracking-tight text-ink mb-4">What do you want to build?</h1>
            <p className="text-base text-ink-muted mb-10 max-w-md mx-auto">
              Describe your project idea in detail. Zenix will ask clarifying questions to generate a perfect specification.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              {[
                "A real-time collaborative markdown editor",
                "A fitness tracking app with social features",
                "An inventory management dashboard",
                "A personal finance tracker with receipt scanning"
              ].map((suggestion, i) => (
                <button
                  key={i}
                  onClick={() => setInputValue(suggestion)}
                  className="text-left px-5 py-4 rounded-xl border border-hairline bg-canvas hover:bg-surface-soft transition-colors text-sm text-ink-muted hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : !messages.some(m => m.isSpec) ? (
          <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-4xl mx-auto w-full text-center mt-[-5%]">
            {messages.filter(m => m.role === 'assistant').slice(-1).map(msg => (
              <div key={msg.id} className="w-full flex flex-col items-center">
                <div className="h-12 w-12 rounded-full flex items-center justify-center bg-ink text-canvas mb-6 shadow-lg">
                  <Bot className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-medium tracking-tight text-ink mb-10 max-w-3xl leading-relaxed whitespace-pre-line">{msg.content}</h2>
                
                {msg.options && msg.options.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-3 w-full max-w-xl">
                    {msg.options.map((opt, idx) => (
                      <button
                        key={idx}
                        disabled={isProcessing}
                        onClick={() => handleSend(opt)}
                        className="px-5 py-3 rounded-xl border border-hairline bg-canvas hover:bg-surface-soft text-sm font-medium text-ink transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 w-full sm:w-auto"
                      >
                        {opt}
                      </button>
                    ))}
                    {!msg.options.some(o => o.toLowerCase().includes('zenix decide')) && (
                      <button
                        disabled={isProcessing}
                        onClick={() => handleSend("Let Zenix decide")}
                        className="px-5 py-3 rounded-xl bg-ink hover:opacity-90 text-sm font-medium text-canvas transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 w-full sm:w-auto shadow-md"
                      >
                        <Sparkles className="h-4 w-4" /> Let Zenix decide
                      </button>
                    )}
                  </div>
                )}
                
                {isProcessing && (
                  <div className="mt-12 flex flex-col items-center justify-center">
                    <TextShimmerWave className="text-sm font-medium" duration={1.2}>
                      Zenix is thinking...
                    </TextShimmerWave>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <MessageScrollerProvider autoScroll={true} defaultScrollPosition="end">
            <MessageScroller className="h-full">
              <MessageScrollerViewport className="px-4 py-6">
                <MessageScrollerContent className="max-w-5xl mx-auto space-y-6 pb-24 w-full px-4">
                  {messages.map((msg, i) => (
                    <MessageScrollerItem
                      key={msg.id}
                      messageId={msg.id}
                      scrollAnchor={msg.role === 'user'}
                      className="w-full"
                    >
                      <div className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start gap-4'}`}>
                        {msg.role === 'assistant' && (
                          <div className="h-8 w-8 rounded-full flex items-center justify-center shrink-0 bg-ink text-canvas mt-1">
                            <Bot className="h-4 w-4" />
                          </div>
                        )}
                        
                        <div className={`flex flex-col gap-3 ${msg.role === 'user' ? 'max-w-[75%] items-end' : 'max-w-[85%] items-start'}`}>
                          {msg.isSpec ? (
                            <div className="bg-[#f4ecd6] rounded-[24px] p-8 sm:p-12 w-full prose prose-base sm:prose-lg prose-p:leading-relaxed prose-pre:bg-white/50 prose-pre:text-ink prose-headings:font-medium text-ink mt-2">
                              <div className="flex items-center gap-2 text-ink font-semibold mb-6 pb-4 border-b border-ink/10 uppercase tracking-widest text-xs font-mono">
                                <CheckCircle2 className="h-4 w-4" />
                                Project Specification
                              </div>
                              <div className="text-ink whitespace-pre-wrap leading-relaxed">
                                {typeof msg.content === 'object' ? JSON.stringify(msg.content, null, 2) : msg.content}
                              </div>
                            </div>
                          ) : (
                            <div className={`${
                              msg.role === 'user' 
                                ? 'bg-surface-soft text-ink rounded-[24px] px-6 py-4 text-base' 
                                : 'text-ink text-base leading-relaxed py-1'
                            }`}>
                              <span className="whitespace-pre-wrap">{msg.content}</span>
                            </div>
                          )}

                          {/* Options Chips */}
                          {msg.options && msg.options.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {msg.options.map((opt, idx) => (
                                <button
                                  key={idx}
                                  disabled={isProcessing}
                                  onClick={() => handleSend(opt)}
                                  className="px-4 py-2 rounded-full border border-hairline bg-canvas hover:bg-surface-soft text-sm font-medium text-ink transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
                                >
                                  {opt}
                                </button>
                              ))}
                              {!msg.options.some(o => o.toLowerCase().includes('zenix decide')) && (
                                <button
                                  disabled={isProcessing}
                                  onClick={() => handleSend("Let Zenix decide")}
                                  className="px-4 py-2 rounded-full bg-ink hover:opacity-90 text-sm font-medium text-canvas transition-opacity disabled:opacity-50 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
                                >
                                  <Sparkles className="h-3.5 w-3.5" /> Let Zenix decide
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </MessageScrollerItem>
                  ))}

                  {isProcessing && (
                    <div className="flex items-start gap-4">
                      <div className="h-8 w-8 rounded-full flex items-center justify-center shrink-0 bg-ink text-canvas mt-1">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="text-ink text-base leading-relaxed py-2 flex items-center gap-2">
                        <span className="flex gap-1">
                          <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0 }} className="h-1.5 w-1.5 rounded-full bg-ink" />
                          <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }} className="h-1.5 w-1.5 rounded-full bg-ink" />
                          <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }} className="h-1.5 w-1.5 rounded-full bg-ink" />
                        </span>
                      </div>
                    </div>
                  )}
                </MessageScrollerContent>
              </MessageScrollerViewport>
              <MessageScrollerButton />
            </MessageScroller>
          </MessageScrollerProvider>
        )}
      </div>

      {/* Input Area */}
      <div className="px-4 py-4 bg-background shrink-0 pb-8 w-full max-w-5xl mx-auto">
        <div className="relative flex items-end gap-2 bg-canvas border border-hairline rounded-[24px] p-2 shadow-sm focus-within:border-ink/20 focus-within:shadow-md transition-all">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
            placeholder={project?.wizard_state?.isComplete ? "Ask Zenix Developer..." : "Message Zenix..."}
            className="flex-1 bg-transparent resize-none border-none outline-none text-base text-ink placeholder:text-ink-muted/70 max-h-40 min-h-[24px] py-3 px-4 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] disabled:opacity-50 w-full focus:ring-0"
            rows={1}
            style={{ height: '48px' }}
          />
          <button
            onClick={() => handleSend(null)}
            disabled={!inputValue.trim() || isProcessing}
            aria-label="Send message"
            className="h-10 w-10 rounded-full bg-ink text-canvas hover:opacity-90 disabled:opacity-30 disabled:bg-surface-soft disabled:text-ink-muted transition-all flex items-center justify-center shrink-0 mb-1 mr-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <div className="text-center mt-3">
          <span className="text-[11px] text-ink-muted/70 font-medium">Zenix AI can make mistakes. Review the generated output carefully.</span>
        </div>
      </div>
      </main>

      {/* Artifacts Sidebar */}
      <AnimatePresence>
        {isArtifactsOpen && (
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            style={{ width: typeof window !== 'undefined' && window.innerWidth >= 768 ? sidebarWidth : '100%' }}
            className="absolute inset-0 z-40 sm:inset-y-0 sm:right-0 sm:left-auto md:relative md:flex-shrink-0 border-l border-hairline/50 bg-background shadow-2xl md:shadow-none flex flex-col max-w-full"
          >
            {/* Drag Handle (Desktop only) */}
            <div 
              className="absolute top-0 bottom-0 left-0 w-1.5 cursor-col-resize hover:bg-ink/20 active:bg-ink/30 transition-colors z-50 hidden md:block"
              onMouseDown={handleMouseDown}
            />
            {/* Artifacts Header */}
            <header className="flex h-14 items-center justify-between border-b border-hairline/50 px-4 shrink-0 bg-canvas/50 backdrop-blur-sm">
              <div className="flex items-center gap-2 font-medium text-ink text-sm">
                <FileCode2 className="h-4 w-4 text-ink-muted" />
                Artifacts
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={async () => {
                    setIsDownloading(true);
                    try {
                      await downloadArtifactsZip(token, projectId);
                      toast.success("Downloaded successfully!");
                    } catch(e) {
                      toast.error("Failed to download ZIP");
                    } finally {
                      setIsDownloading(false);
                    }
                  }}
                  disabled={isDownloading || artifacts.length === 0}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-ink-muted hover:text-ink hover:bg-surface-soft rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 disabled:opacity-50"
                  aria-label="Download all artifacts as ZIP"
                  title="Download ZIP"
                >
                  {isDownloading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                  <span className="hidden sm:inline">ZIP</span>
                </button>
                <button
                  onClick={() => setIsArtifactsOpen(false)}
                  className="p-1.5 text-ink-muted hover:bg-surface-soft hover:text-ink rounded-md transition-colors md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
                  aria-label="Close artifacts sidebar"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </header>

            {/* Artifacts Content */}
            <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col">
              {isGeneratingArtifacts ? (
                <div className="flex-1 p-4 flex flex-col items-center justify-center text-center">
                  <Loader2 className="h-6 w-6 animate-spin text-ink-muted mb-4" />
                  <h3 className="text-sm font-medium text-ink mb-1">Generating Architecture</h3>
                  <p className="text-xs text-ink-muted max-w-[200px]">
                    Zenix is writing your agents and context files based on the specification...
                  </p>
                </div>
              ) : artifacts.length === 0 ? (
                <div className="flex-1 p-4 flex flex-col items-center justify-center text-center">
                  <div className="h-12 w-12 rounded-2xl bg-canvas border border-hairline flex items-center justify-center mb-4 text-ink-muted/50">
                    <FileCode2 className="h-6 w-6" />
                  </div>
                  <h3 className="text-sm font-medium text-ink mb-1">No artifacts yet</h3>
                  <p className="text-xs text-ink-muted max-w-[200px]">
                    Generated documents, code snippets, and structured output will appear here.
                  </p>
                </div>
              ) : (
                <div className="flex-1 flex flex-col">
                  <div className="p-3 border-b border-hairline/50 bg-canvas">
                    <div className="relative">
                      <button
                        onClick={() => setIsFileMenuOpen(!isFileMenuOpen)}
                        className="w-full flex items-center justify-between bg-canvas border border-hairline rounded-lg py-2 pl-3 pr-3 text-sm font-medium text-ink hover:border-ink/30 focus:outline-none focus:ring-2 focus:ring-ink/20 focus:border-ink/30 transition-all shadow-sm"
                      >
                        <span className="truncate pr-4">{activeArtifact?.file_path || 'Select a file...'}</span>
                        <ChevronDown className={`h-4 w-4 text-ink-muted transition-transform ${isFileMenuOpen ? 'rotate-180' : ''}`} />
                      </button>
                      
                      <AnimatePresence>
                        {isFileMenuOpen && (
                          <>
                            <div 
                              className="fixed inset-0 z-40"
                              onClick={() => setIsFileMenuOpen(false)}
                            />
                            <motion.div 
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -4 }}
                              transition={{ duration: 0.15, ease: "easeOut" }}
                              className="absolute top-full left-0 right-0 mt-1 z-50 bg-canvas border border-hairline rounded-lg shadow-lg max-h-64 overflow-y-auto py-1"
                            >
                              {artifacts.map(a => (
                                <button
                                  key={a._id}
                                  onClick={() => {
                                    setActiveArtifact(a);
                                    setIsFileMenuOpen(false);
                                  }}
                                  className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                                    activeArtifact?._id === a._id 
                                      ? 'bg-ink text-canvas font-medium' 
                                      : 'text-ink hover:bg-surface-soft'
                                  }`}
                                >
                                  <span className="block truncate">{a.file_path}</span>
                                </button>
                              ))}
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  {activeArtifact && (
                    <div className="flex-1 p-4 relative flex flex-col">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-semibold text-ink-muted">Edit {activeArtifact.file_path}</span>
                        {isSavingArtifact && <Loader2 className="h-3 w-3 animate-spin text-ink-muted" />}
                      </div>
                      <textarea
                        className="w-full h-full flex-1 bg-canvas rounded-xl p-4 resize-none border border-hairline outline-none text-sm text-ink font-mono focus:border-ink/30 focus:ring-4 focus:ring-ink/5 transition-all shadow-sm leading-relaxed"
                        value={activeArtifact.content}
                        onChange={(e) => {
                          const newContent = e.target.value;
                          setActiveArtifact({ ...activeArtifact, content: newContent });
                          
                          // Optionally debounce save to backend
                          if (window.saveTimeout) clearTimeout(window.saveTimeout);
                          window.saveTimeout = setTimeout(async () => {
                            setIsSavingArtifact(true);
                            try {
                              await updateArtifact(token, activeArtifact._id, { content: newContent });
                              setArtifacts(prev => prev.map(a => a._id === activeArtifact._id ? { ...a, content: newContent } : a));
                            } catch (error) {
                              toast.error("Failed to save artifact");
                            } finally {
                              setIsSavingArtifact(false);
                            }
                          }, 1000);
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  )
}
