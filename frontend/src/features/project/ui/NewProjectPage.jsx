import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PromptInput } from './components/PromptInput'
import { QuestionCard } from './components/QuestionCard'
import { ArrowLeft, Sparkles, Check, MessageSquare, ArrowRight } from 'lucide-react'
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
            ) : (
              <div className="bg-surface-elevated rounded-[24px] border border-hairline p-8 sm:p-10 animate-fade-in shadow-sm">
                <div className="flex items-center gap-4 mb-5">
                  <div className="h-8 w-8 rounded-full bg-ink flex items-center justify-center shrink-0">
                    <Check className="h-4 w-4 text-canvas" />
                  </div>
                  <h3 className="text-[17px] font-[540] text-ink tracking-tight">Project foundation</h3>
                </div>
                <p className="text-[16px] text-ink-muted whitespace-pre-wrap ml-12 leading-[1.65] font-[480] w-full max-w-[60ch] block">{prompt}</p>
              </div>
            )}

            {/* History of Q&A */}
            {history.map((item, idx) => (
              <div key={idx} className="bg-surface-elevated rounded-[24px] border border-hairline p-8 sm:p-10 animate-fade-in shadow-sm">
                <div className="flex flex-col gap-8">
                  <div className="flex items-start gap-4">
                    <div className="h-8 w-8 rounded-full bg-brand-indigo/10 flex items-center justify-center shrink-0 mt-1">
                      <MessageSquare className="h-4 w-4 text-brand-indigo" />
                    </div>
                    <div>
                      <h4 className="text-[14px] font-[600] tracking-wider uppercase text-ink mb-2 font-mono">Zenix</h4>
                      <p className="text-[17px] font-[480] text-ink-muted leading-[1.6] w-full max-w-[60ch] block">{item.question}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 ml-[48px]">
                    <div className="h-8 w-8 rounded-full bg-ink flex items-center justify-center shrink-0 mt-1">
                      <span className="text-[11px] font-[700] font-mono text-canvas">U</span>
                    </div>
                    <div className="bg-canvas border border-hairline rounded-[20px] p-6 flex-1 shadow-sm">
                      <p className="text-[16px] font-[480] text-ink whitespace-pre-wrap leading-[1.65] w-full max-w-[60ch] block">{item.answer}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Current Question */}
            {step > 0 && step !== 999 && currentQuestion && (
              <div className="bg-canvas rounded-[24px] border-2 border-brand-indigo/20 p-8 sm:p-10 animate-fade-in shadow-md relative overflow-hidden mt-2">
                <div className="absolute top-0 left-0 w-[4px] h-full bg-brand-indigo rounded-l-[24px]"></div>
                <QuestionCard 
                  key={currentQuestion?.key || step}
                  currentStep={step}
                  question={currentQuestion}
                  onSubmit={handleQuestionSubmit}
                  isLoading={isRefining}
                />
              </div>
            )}

            {/* Completion */}
            {(step === 999 || (!currentQuestion && step > 0 && step !== 'recovering')) && (
              <div className="bg-brand-indigo/5 rounded-[32px] border border-brand-indigo/20 p-10 sm:p-16 text-center animate-fade-in relative overflow-hidden mt-6 shadow-sm">
                <Sparkles className="h-14 w-14 text-brand-indigo mx-auto mb-6 opacity-80" />
                <h2 className="text-[36px] font-[340] tracking-tight text-ink mb-4">Context is ready</h2>
                <p className="text-[18px] text-ink-muted mb-10 mx-auto font-[480] w-full max-w-[60ch] block">
                  We've gathered all the necessary details. Your project is ready to be built.
                </p>
                
                <div className="mt-6 flex justify-center">
                  <Link
                    to={`/projects/${projectId}/chat`}
                    className="bg-ink text-canvas hover:opacity-90 px-10 py-[18px] rounded-[40px] text-[17px] font-[540] tracking-tight transition-all flex items-center gap-3 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95"
                  >
                    Open Developer Sandbox
                    <ArrowRight className="h-[18px] w-[18px]" strokeWidth={2.5} />
                  </Link>
                </div>
              </div>
            )}
            
            <div ref={endOfFlowRef} className="h-20" />
          </div>
        )}
      </div>
    </div>
  )
}
