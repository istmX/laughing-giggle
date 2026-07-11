import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PromptInput } from './components/PromptInput'
import { QuestionCard } from './components/QuestionCard'
import { ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { createIdea } from '../api/ideas.api'
import { processConversation, analyzeIdea } from '../api/ai.api'
import { updateProject, getProject } from '../api/projects.api'
import { TextShimmerWave } from '@/components/ui/text-shimmer-wave'
import toast from 'react-hot-toast'
import { ProjectChatPage } from './ProjectChatPage'

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
  const [completedProjectData, setCompletedProjectData] = useState(null)

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
  }, [token, projectId])

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
  }, [step, ideaId, token])

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

  const handlePromptSubmit = async (val) => {
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



  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center p-6 selection:bg-ink selection:text-canvas overflow-hidden">
      <div className="absolute top-6 left-6">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-ink-muted hover:text-ink text-body-sm tracking-body-sm font-normal transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </Link>
      </div>

      <div className="w-full max-w-6xl mx-auto relative px-4 sm:px-8">
        <AnimatePresence mode="wait">
          {(step === 'recovering' || isPageLoading) ? (
            <motion.div
              key="recovering"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-[50vh]"
            >
              <TextShimmerWave 
                className="text-body-lg font-semibold [--base-color:var(--color-ink-muted)] [--base-gradient-color:var(--color-ink)]"
                duration={1.2}
                zDistance={2}
                yDistance={-2}
              >
                Resuming your session...
              </TextShimmerWave>
            </motion.div>
          ) : step === 0 ? (
            <motion.div
              key="prompt"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            >
              <PromptInput onSubmit={handlePromptSubmit} isLoading={isAnalyzing} />
            </motion.div>
          ) : step === 999 ? (
            <motion.div
              key="completed"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            >
              <div className="text-center bg-surface p-12 rounded-3xl border border-hairline shadow-sm w-full mx-auto relative z-10">
                <CheckCircle2 className="h-12 w-12 text-ink mx-auto mb-6 opacity-80" />
                <h2 className="text-[32px] font-semibold tracking-tight text-ink mb-4">Brief Already Completed</h2>
                <p className="text-body-lg text-ink-muted mb-8 max-w-lg mx-auto">
                  You have already generated the idea and context for this project.
                </p>
                <div className="bg-canvas border border-hairline rounded-xl p-6 text-left space-y-4 max-h-[400px] overflow-y-auto">
                   <div>
                     <p className="text-sm font-semibold text-ink mb-1">Project Title:</p>
                     <p className="text-ink-muted text-sm">{completedProjectData?.project_title}</p>
                   </div>
                   <hr className="border-hairline" />
                   <div>
                     <p className="text-sm font-semibold text-ink mb-1">Initial Prompt / Idea:</p>
                     <p className="text-ink-muted text-sm whitespace-pre-wrap">{completedProjectData?.project_description}</p>
                   </div>
                   {completedProjectData?.wizard_state?.refinedSpec && (
                     <>
                       <hr className="border-hairline" />
                       <div>
                         <p className="text-sm font-semibold text-ink mb-1">Refined Project Specification:</p>
                         <p className="text-ink-muted text-sm whitespace-pre-wrap">{completedProjectData.wizard_state.refinedSpec}</p>
                       </div>
                     </>
                   )}
                 </div>
                 <div className="mt-8 flex justify-center gap-4">
                   <Link
                     to={`/projects/${projectId}/chat`}
                     className="bg-ink text-canvas hover:opacity-90 px-6 py-3 rounded-full text-body-sm font-medium transition-opacity flex items-center gap-2"
                   >
                     <Sparkles className="h-4 w-4" />
                     Open Developer Chat Sandbox
                   </Link>
                 </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={`q-${step}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            >
              {currentQuestion ? (
                <QuestionCard 
                   key={currentQuestion?.key || step}
                   currentStep={step}
                   question={currentQuestion}
                   onSubmit={handleQuestionSubmit}
                   isLoading={isRefining}
                />
              ) : (
                <div className="text-center bg-surface p-12 rounded-3xl border border-hairline shadow-sm w-full mx-auto relative z-10">
                  <CheckCircle2 className="h-12 w-12 text-ink mx-auto mb-6 opacity-80" />
                  <h2 className="text-[32px] font-semibold tracking-tight text-ink mb-4">Brief Complete</h2>
                  <p className="text-body-lg text-ink-muted mb-8 max-w-lg mx-auto">
                    We've gathered all the necessary context. Your powerful prompt is ready.
                  </p>
                  <div className="bg-canvas border border-hairline rounded-xl p-6 text-left space-y-4 max-h-[400px] overflow-y-auto">
                     <div>
                       <p className="text-sm font-semibold text-ink mb-1">Initial Prompt / Idea:</p>
                       <p className="text-ink-muted text-sm whitespace-pre-wrap">{prompt}</p>
                     </div>
                     <hr className="border-hairline" />
                     <div>
                       <p className="text-sm font-semibold text-ink mb-1">Refined Project Specification:</p>
                       <p className="text-ink-muted text-sm whitespace-pre-wrap">{typeof refinedSpec === 'object' ? JSON.stringify(refinedSpec, null, 2) : refinedSpec}</p>
                     </div>
                   </div>
                   <div className="mt-8 flex justify-center gap-4">
                     <Link
                       to={`/projects/${projectId}/chat`}
                       className="bg-ink text-canvas hover:opacity-90 px-6 py-3 rounded-full text-body-sm font-medium transition-opacity flex items-center gap-2"
                     >
                       <Sparkles className="h-4 w-4" />
                       Open Developer Chat Sandbox
                     </Link>
                   </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
