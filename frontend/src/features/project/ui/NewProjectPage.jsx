import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PromptInput } from './components/PromptInput'
import { OptionButton } from './components/OptionButton'
import { SpecReadyPanel } from './components/SpecReadyPanel'
import { AiIcon } from './components/AiIcon'
import { AiThinking } from './components/AiThinking'
import { ArrowLeft, Sparkles, Check, MessageSquare, ArrowRight, ArrowUp } from 'lucide-react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { createIdea } from '../api/ideas.api'
import { processConversation, analyzeIdea } from '../api/ai.api'
import { updateProject, getProject } from '../api/projects.api'
import { TextShimmerWave } from '@/components/ui/text-shimmer-wave'
import toast from 'react-hot-toast'

export function NewProjectPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()
  
  const [step, setStep] = useState(0) // 0 = Prompt, 1 = Q1, etc., 999 = Already Completed
  const [prompt, setPrompt] = useState('')
  const [history, setHistory] = useState([]) // [{ question, answer }]
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [ideaId, setIdeaId] = useState(null)
  const [chatInput, setChatInput] = useState('')
  const chatInputRef = useRef(null)
  
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [isRefining, setIsRefining] = useState(false)
  const [refinedSpec, setRefinedSpec] = useState('')

  // Fetch project on mount to check if idea is already submitted
  useEffect(() => {
    let isMounted = true;
    
    const checkProjectStatus = async () => {
      try {
        const res = await getProject(token, projectId)
        const project = res.data
        if (project) {
          if (project.wizard_state && project.wizard_state.ideaId) {
            const ws = project.wizard_state
            if (isMounted) {
              setIdeaId(ws.ideaId)
              setPrompt(ws.prompt || '')
              setHistory(ws.history || [])
              setCurrentQuestion(ws.currentQuestion)
              setRefinedSpec(ws.refinedSpec || '')
              
              if (ws.isComplete) {
                navigate(`/projects/${projectId}/chat`, { replace: true })
              } else if (ws.currentQuestion) {
                // Resume to the question they left off on
                setStep((ws.history?.length || 0) + 1)
              } else {
                // ideaId saved but conversation was interrupted before first Q
                // Re-request first question silently
                setStep('recovering')
              }
            }
          } else if (project.wizard_state && project.wizard_state.autoStart && project.wizard_state.prompt) {
            if (isMounted) {
              const ws = { ...project.wizard_state, autoStart: false };
              await updateProject(token, projectId, { wizard_state: ws });
              handlePromptSubmit(project.wizard_state.prompt);
            }
          }
          // If no wizard_state.ideaId, stay at step 0 (prompt input)
        }
      } catch (err) {
        console.error('Failed to fetch project status', err)
      } finally {
        if (isMounted) {
          setIsPageLoading(false)
        }
      }
    }
    
    if (token && projectId) {
      checkProjectStatus()
    }
    
    return () => {
      isMounted = false;
    }
  }, [token, projectId, navigate])

  // Recovery: ideaId is set but no currentQuestion. Re-request first AI question silently.
  useEffect(() => {
    if (step !== 'recovering' || !ideaId || !token) return
    let cancelled = false
    const recover = async () => {
      try {
        const res = await processConversation(token, ideaId, { history: [] })
        const parsed = parseAIResponse(res)
        if (cancelled) return
        if (parsed.is_complete) {
          const newState = { ideaId, prompt, history: [], currentQuestion: null, refinedSpec: parsed.refined_spec, isComplete: true }
          await syncStateToBackend(newState)
          setRefinedSpec(parsed.refined_spec)
          navigate(`/projects/${projectId}/chat`, { replace: true })
        } else {
          const questionObj = {
            key: 'q1',
            question: parsed.next_question || 'What is the primary feature?',
            options: parsed.options || []
          }
          setCurrentQuestion(questionObj)
          const newState = { ideaId, prompt, history: [], currentQuestion: questionObj, refinedSpec: null, isComplete: false }
          await syncStateToBackend(newState)
          setStep(1)
        }
      } catch (err) {
        console.error('Recovery failed', err)
        // Stay on recovering step — user can retry by refreshing
        toast.error('Could not load your question. Please refresh to retry.')
        if (!cancelled) setStep(0)
      }
    }
    recover()
    return () => { cancelled = true }
  }, [step, ideaId, token, prompt, projectId, navigate])

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

  const syncStateToBackend = async (newState) => {
    try {
      await updateProject(token, projectId, { wizard_state: newState })
    } catch (err) {
      console.error('Failed to sync state', err)
    }
  }

  async function handlePromptSubmit(val) {
    setPrompt(val)
    setIsAnalyzing(true)
    
    try {
      const ideaRes = await createIdea(token, { prompt: val })
      const newIdeaId = ideaRes.data?._id || ideaRes._id
      setIdeaId(newIdeaId)
      
      const analyzeRes = await analyzeIdea(token, newIdeaId)
      const parsedAnalysis = parseAIResponse(analyzeRes)
      
      const title = parsedAnalysis.project_title || 'Untitled Project'
      const description = parsedAnalysis.project_description || val

      await updateProject(token, projectId, {
        project_title: title,
        project_description: description
      })
      
      // Save a minimal state BEFORE calling conversation so if it fails, user can resume
      const minimalState = { ideaId: newIdeaId, prompt: val, history: [], currentQuestion: null, refinedSpec: null, isComplete: false }
      await syncStateToBackend(minimalState)

      // Start conversational flow
      const convoRes = await processConversation(token, newIdeaId, { history: [] })
      const parsedConvo = parseAIResponse(convoRes)
      
      if (parsedConvo.is_complete) {
        const newState = { ideaId: newIdeaId, prompt: val, history: [], currentQuestion: null, refinedSpec: parsedConvo.refined_spec, isComplete: true }
        await syncStateToBackend(newState)
        setRefinedSpec(parsedConvo.refined_spec)
        setStep(999)
      } else {
        const questionObj = {
          key: 'q1',
          question: parsedConvo.next_question || 'What is the primary feature?',
          options: parsedConvo.options || []
        }
        setCurrentQuestion(questionObj)
        const newState = { ideaId: newIdeaId, prompt: val, history: [], currentQuestion: questionObj, refinedSpec: null, isComplete: false }
        await syncStateToBackend(newState)
        setStep(1)
      }
      toast.success('Idea analyzed successfully!')
    } catch (err) {
      console.error('Failed to process idea:', err)
      toast.error('Failed to analyze the idea. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleQuestionSubmit = async (answer) => {
    setIsRefining(true)
    try {
      const newHistoryItem = { question: currentQuestion.question, answer }
      const newHistory = [...history, newHistoryItem]
      
      const res = await processConversation(token, ideaId, { history: newHistory })
      const parsed = parseAIResponse(res)
      
      if (parsed.is_complete) {
        // Complete — AI decided it has enough context
        const finalSpec = parsed.refined_spec || 'Project specification completed based on constraints.'
        const newState = { ideaId, prompt, history: newHistory, currentQuestion: null, refinedSpec: finalSpec, isComplete: true }
        await syncStateToBackend(newState)
        
        setHistory(newHistory)
        setRefinedSpec(finalSpec)
        toast.success('Project specification refined successfully!')
        navigate(`/projects/${projectId}/chat`, { replace: true })
      } else {
        // Next question
        const nextQ = {
          key: `q${newHistory.length + 1}`,
          question: parsed.next_question || 'Any other details?',
          options: parsed.options || []
        }
        const newState = { ideaId, prompt, history: newHistory, currentQuestion: nextQ, refinedSpec: null, isComplete: false }
        await syncStateToBackend(newState)
        
        setHistory(newHistory)
        setCurrentQuestion(nextQ)
        setStep(newHistory.length + 1)
      }
    } catch (err) {
      console.error('Failed to process conversation:', err)
      toast.error('Failed to process answer.')
    } finally {
      setIsRefining(false)
    }
  }

  const endOfFlowRef = useRef(null)

  useEffect(() => {
    if (endOfFlowRef.current) {
      endOfFlowRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [step, history, currentQuestion])

  return (
    <div className="min-h-[100dvh] bg-canvas flex flex-col items-center p-6 selection:bg-ink selection:text-canvas overflow-y-auto relative">
      {/* Decorative gradient for the creation page */}
      <div className="absolute top-0 inset-x-0 h-[400px] pointer-events-none opacity-40" style={{
        background: 'radial-gradient(ellipse at 50% -20%, color-mix(in oklch, var(--brand-indigo) 12%, transparent), transparent 70%)'
      }} />

      <div className="fixed top-8 left-8 z-50">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-ink-muted hover:text-ink text-[14px] font-[540] transition-colors bg-canvas/80 backdrop-blur-md py-2.5 px-5 rounded-full border border-hairline shadow-sm">
          <ArrowLeft className="h-[14px] w-[14px]" />
          Dashboard
        </Link>
      </div>

      {/* The main container uses a wider max-width to allow the PromptInput 2-column layout to shine,
          but restricts the chat flow to a readable width once the prompt is submitted. */}
      <div className={`w-full ${step === 0 ? 'max-w-[1200px]' : 'max-w-[760px]'} mx-auto relative px-4 sm:px-0 pt-28 pb-40 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]`}>
        {(step === 'recovering' || isPageLoading) ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <TextShimmerWave 
              className="text-[20px] font-[540] [--base-color:var(--color-ink-muted)] [--base-gradient-color:var(--color-ink)]"
              duration={1.2}
              zDistance={2}
              yDistance={-2}
            >
              Resuming your session...
            </TextShimmerWave>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            
            {/* Step 0: Initial Prompt or Summary */}
            {step === 0 ? (
              <PromptInput onSubmit={handlePromptSubmit} isLoading={isAnalyzing} initialValue={prompt} />
            ) : step === 999 ? (
              <SpecReadyPanel 
                specContent={refinedSpec} 
                onContinue={() => navigate(`/projects/${projectId}/chat`, { replace: true })}
                artifactCount={11}
              />
            ) : (
              <div className="flex flex-col w-full pb-[140px] pt-4">
                
                {/* Initial Prompt as the first user message */}
                <div className="flex justify-end mb-8 w-full group">
                  <div className="max-w-[85%] text-[15px] leading-relaxed text-ink font-normal bg-surface-soft px-5 py-3.5 rounded-[20px] rounded-tr-[4px] border border-hairline/60">
                    {prompt}
                  </div>
                </div>

                {/* History of Q&A */}
                {history.map((item, idx) => (
                  <div key={idx} className="flex flex-col w-full">
                    {/* AI Question */}
                    <div className="flex gap-4 mb-8 w-full">
                      <AiIcon isAnimating={false} />
                      <div className="flex-1 max-w-[85%]">
                        <div className="text-[15px] leading-relaxed text-ink font-normal whitespace-pre-wrap">
                          {item.question}
                        </div>
                      </div>
                    </div>
                    
                    {/* User Answer */}
                    <div className="flex justify-end mb-8 w-full">
                      <div className="max-w-[85%] text-[15px] leading-relaxed text-ink font-normal bg-surface-soft px-5 py-3.5 rounded-[20px] rounded-tr-[4px] border border-hairline/60 whitespace-pre-wrap">
                        {item.answer}
                      </div>
                    </div>
                    
                    {/* Divider after each turn pair */}
                    <div className="w-full h-[1px] bg-hairline/30 mb-8" />
                  </div>
                ))}

                {/* Current Question & Options */}
                {currentQuestion && (
                  <div className="flex flex-col w-full animate-fade-in">
                    <div className="flex gap-4 mb-6 w-full">
                      <AiIcon isAnimating={isRefining} />
                      <div className="flex-1 max-w-[85%]">
                        {isRefining && !currentQuestion.question ? (
                          <div className="py-1"><AiThinking /></div>
                        ) : (
                          <div className="text-[15px] leading-relaxed text-ink font-normal whitespace-pre-wrap">
                            {currentQuestion.question || currentQuestion.title}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Options (if available and not refining) */}
                    {!isRefining && currentQuestion.options && currentQuestion.options.length > 0 && (
                      <div className="flex gap-4 w-full mb-8">
                        <div className="w-6 shrink-0" /> {/* Spacer for icon */}
                        <div className="flex-1 flex flex-col gap-2 max-w-[85%]">
                          {currentQuestion.options.map((opt, i) => (
                            <OptionButton 
                              key={i}
                              label={opt}
                              onClick={() => handleQuestionSubmit(opt)}
                              isSelected={false}
                            />
                          ))}
                          {/* Built-in Decider button for late questions */}
                          {step >= 10 && (
                            <OptionButton 
                              label="Let Zenix decide all remaining questions"
                              onClick={() => handleQuestionSubmit("Let Zenix decide for all remaining")}
                              isSelected={false}
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <div ref={endOfFlowRef} className="h-10" />

                {/* Floating Input Bar */}
                <div className="fixed bottom-0 inset-x-0 pb-8 pt-12 bg-gradient-to-t from-canvas via-canvas/90 to-transparent pointer-events-none z-40">
                  <div className="w-full max-w-[760px] mx-auto px-4 sm:px-0 pointer-events-auto">
                    <div className="relative group">
                      <textarea 
                        ref={chatInputRef}
                        value={chatInput}
                        onChange={(e) => {
                          setChatInput(e.target.value);
                          e.target.style.height = 'auto';
                          e.target.style.height = e.target.scrollHeight + 'px';
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            if (chatInput.trim() && !isRefining) {
                              handleQuestionSubmit(chatInput.trim());
                              setChatInput('');
                              e.target.style.height = 'auto';
                            }
                          }
                        }}
                        disabled={isRefining}
                        placeholder={isRefining ? "Thinking..." : "Type your answer or let Zenix decide..."}
                        className="floating-input w-full min-h-[56px] max-h-[160px] rounded-[28px] bg-canvas border border-hairline shadow-[0_4px_24px_rgba(0,0,0,0.04)] py-[16px] pl-6 pr-14 text-[15px] font-normal text-ink placeholder:text-ink-faint focus:outline-none focus:border-brand-indigo/30 focus:ring-[4px] focus:ring-brand-indigo/5 resize-none transition-all overflow-y-auto disabled:opacity-50"
                      />
                      <button 
                        disabled={!chatInput.trim() || isRefining}
                        onClick={() => {
                          if (chatInput.trim() && !isRefining) {
                            handleQuestionSubmit(chatInput.trim());
                            setChatInput('');
                            if (chatInputRef.current) chatInputRef.current.style.height = 'auto';
                          }
                        }}
                        className="absolute right-2 top-2 h-10 w-10 rounded-full bg-ink flex items-center justify-center text-canvas hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            )}
            </div>
        )}
      </div>
    </div>
  )
}
