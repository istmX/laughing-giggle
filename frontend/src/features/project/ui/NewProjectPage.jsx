import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PromptInput } from './components/PromptInput'
import { QuestionCard } from './components/QuestionCard'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { createIdea } from '../api/ideas.api'
import { analyzeIdea } from '../api/ai.api'
import { updateProject } from '../api/projects.api'
import toast from 'react-hot-toast'

const QUESTIONS = [
  {
    id: 1,
    title: "Which authentication system would you like to use?",
    options: [
      "Clerk",
      "Better Auth",
      "Auth.js"
    ]
  },
  {
    id: 2,
    title: "What is your preferred database?",
    options: [
      "PostgreSQL",
      "MySQL",
      "MongoDB"
    ]
  },
  {
    id: 3,
    title: "How should we handle styling?",
    options: [
      "Tailwind CSS v4",
      "CSS Modules",
      "Styled Components"
    ]
  },
  {
    id: 4,
    title: "What is your default theme preference?",
    options: [
      "System (Auto)",
      "Light Mode",
      "Dark Mode"
    ]
  }
]

export function NewProjectPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const { token } = useAuth()
  
  const [step, setStep] = useState(0) // 0 = Prompt, 1 = Q1, etc.
  const [prompt, setPrompt] = useState('')
  const [answers, setAnswers] = useState({})
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [ideaId, setIdeaId] = useState(null)

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
      
      // 3. Update the project with the generated title and description
      const title = analyzeRes.project_title || analyzeRes.data?.project_title || 'Untitled Project'
      const description = analyzeRes.project_description || analyzeRes.data?.project_description || val

      await updateProject(token, projectId, {
        project_title: title,
        project_description: description
      })
      
      toast.success('Idea analyzed successfully!')
      setStep(1) // Move to questions
    } catch (err) {
      console.error('Failed to process idea:', err)
      toast.error('Failed to analyze the idea. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleQuestionSubmit = (answer) => {
    setAnswers(prev => ({ ...prev, [step]: answer }))
    if (step < QUESTIONS.length) {
      setStep(prev => prev + 1)
    } else {
      // Finished flow - for now just show completed state
      setStep(QUESTIONS.length + 1)
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

      <div className="w-full max-w-4xl mx-auto relative">
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
              {step <= QUESTIONS.length ? (
                <QuestionCard 
                  currentStep={step}
                  totalSteps={QUESTIONS.length}
                  question={QUESTIONS[step - 1]}
                  onSubmit={handleQuestionSubmit}
                />
              ) : (
                <div className="text-center">
                  <h2 className="text-[40px] font-340 tracking-tight text-ink mb-4">Project Created</h2>
                  <p className="text-body-lg text-ink-muted">Generating context and architecture...</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
