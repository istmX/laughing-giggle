import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PromptInput } from './components/PromptInput'
import { QuestionCard } from './components/QuestionCard'
import { ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { createIdea } from '../api/ideas.api'
import { analyzeIdea, generateQuestions } from '../api/ai.api'
import { updateProject } from '../api/projects.api'
import toast from 'react-hot-toast'

export function NewProjectPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()
  
  const [step, setStep] = useState(() => {
    const saved = localStorage.getItem(`project_wizard_${projectId}`)
    if (saved) return JSON.parse(saved).step || 0
    return 0
  })
  const [prompt, setPrompt] = useState(() => {
    const saved = localStorage.getItem(`project_wizard_${projectId}`)
    if (saved) return JSON.parse(saved).prompt || ''
    return ''
  })
  const [answers, setAnswers] = useState(() => {
    const saved = localStorage.getItem(`project_wizard_${projectId}`)
    if (saved) return JSON.parse(saved).answers || {}
    return {}
  })
  const [aiQuestions, setAiQuestions] = useState(() => {
    const saved = localStorage.getItem(`project_wizard_${projectId}`)
    if (saved) return JSON.parse(saved).aiQuestions || []
    return []
  })
  const [ideaId, setIdeaId] = useState(() => {
    const saved = localStorage.getItem(`project_wizard_${projectId}`)
    if (saved) return JSON.parse(saved).ideaId || null
    return null
  })
  
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Persist state changes
  useEffect(() => {
    localStorage.setItem(`project_wizard_${projectId}`, JSON.stringify({
      step, prompt, answers, aiQuestions, ideaId
    }))
  }, [step, prompt, answers, aiQuestions, ideaId, projectId])

  const parseAIResponse = (res) => {
    try {
      if (typeof res === 'object' && !res.content && (res.project_title || res.questions)) return res;
      
      let content = res.content || res.data?.content || res;
      if (typeof content !== 'string') return content;
      
      content = content.replace(/```json/gi, '').replace(/```/g, '').trim();
      
      // Find the first '{' or '[' and last '}' or ']'
      const startObj = content.indexOf('{');
      const startArr = content.indexOf('[');
      const endObj = content.lastIndexOf('}');
      const endArr = content.lastIndexOf(']');
      
      let start = -1;
      let end = -1;
      
      if (startObj !== -1 && (startArr === -1 || startObj < startArr)) {
        start = startObj;
        end = endObj;
      } else if (startArr !== -1) {
        start = startArr;
        end = endArr;
      }
      
      if (start !== -1 && end !== -1 && end > start) {
        content = content.substring(start, end + 1);
      }
      
      const parsed = JSON.parse(content);
      
      // If the LLM returned an array directly instead of { questions: [...] }
      if (Array.isArray(parsed)) {
        return { questions: parsed };
      }
      return parsed;
    } catch (e) {
      console.error("Failed to parse AI response:", e, res);
      return {};
    }
  }

  const handlePromptSubmit = async (val) => {
    setPrompt(val)
    setIsAnalyzing(true)
    
    try {
      // 1. Save the idea prompt
      const ideaRes = await createIdea(token, { prompt: val })
      const newIdeaId = ideaRes.data?._id || ideaRes._id
      setIdeaId(newIdeaId)
      
      // 2. Analyze the idea using AI
      const analyzeRes = await analyzeIdea(token, newIdeaId)
      const parsedAnalysis = parseAIResponse(analyzeRes)
      
      // 3. Update the project with the generated title and description
      const title = parsedAnalysis.project_title || 'Untitled Project'
      const description = parsedAnalysis.project_description || val

      await updateProject(token, projectId, {
        project_title: title,
        project_description: description
      })
      
      // 4. Generate clarification questions
      const questionsRes = await generateQuestions(token, newIdeaId)
      const parsedQuestionsRes = parseAIResponse(questionsRes)
      const fetchedQuestions = parsedQuestionsRes.questions || []
      setAiQuestions(fetchedQuestions)
      
      toast.success('Idea analyzed and questions generated!')
      
      // Fallback if no questions were generated
      if (fetchedQuestions.length === 0) {
        setStep(1) // this will trigger the dummy screen since length is 0
      } else {
        setStep(1) // Move to first question
      }
    } catch (err) {
      console.error('Failed to process idea:', err)
      toast.error('Failed to analyze the idea. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleQuestionSubmit = (answer) => {
    setAnswers(prev => ({ ...prev, [step]: answer }))
    if (step < aiQuestions.length) {
      setStep(prev => prev + 1)
    } else {
      // Finished flow - show the dummy screen
      setStep(aiQuestions.length + 1)
      console.log('Finished', { prompt, answers: { ...answers, [step]: answer } })
    }
  }

  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center p-6 selection:bg-ink selection:text-canvas overflow-hidden">
      <div className="absolute top-6 left-6">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-ink-muted hover:text-ink text-body-sm tracking-body-sm font-330 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </Link>
      </div>

      <div className="w-full max-w-6xl mx-auto relative px-4 sm:px-8">
        <AnimatePresence mode="wait">
          {step === 0 ? (
            <motion.div
              key="prompt"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            >
              <PromptInput onSubmit={handlePromptSubmit} isLoading={isAnalyzing} />
            </motion.div>
          ) : (
            <motion.div
              key={`q-${step}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
            >
              {step <= aiQuestions.length && aiQuestions.length > 0 ? (
                <QuestionCard 
                  currentStep={step}
                  totalSteps={aiQuestions.length}
                  question={aiQuestions[step - 1]}
                  onSubmit={handleQuestionSubmit}
                />
              ) : (
                <div className="text-center bg-surface p-12 rounded-3xl border border-hairline shadow-sm w-full mx-auto relative z-10">
                  <CheckCircle2 className="h-12 w-12 text-ink mx-auto mb-6 opacity-80" />
                  <h2 className="text-[32px] font-340 tracking-tight text-ink mb-4">Brief Complete</h2>
                  <p className="text-body-lg text-ink-muted mb-8 max-w-lg mx-auto">
                    We've gathered all the necessary context. Your polished prompt is ready.
                  </p>
                  <div className="bg-canvas border border-hairline rounded-xl p-6 text-left max-h-[300px] overflow-y-auto">
                    <p className="text-sm font-semibold text-ink mb-4">Original Prompt:</p>
                    <p className="text-ink-muted text-sm whitespace-pre-wrap">{prompt}</p>
                    
                    <div className="h-px bg-hairline my-6" />
                    
                    <p className="text-sm font-semibold text-ink mb-4">Clarification Answers:</p>
                    <pre className="text-ink-muted text-xs whitespace-pre font-mono overflow-x-auto">
                      {JSON.stringify(answers, null, 2)}
                    </pre>
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
