import { useState, useRef } from 'react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useContextStore } from '../store/context.store'
import { generateProjectContext } from '../api/context.api'
import toast from 'react-hot-toast'

export function useContextFlow(ideaId) {
  const { token } = useAuth()
  const { isGenerating, generatedFiles, setGenerating, setGeneratedFiles } = useContextStore()
  const [error, setError] = useState(null)
  const abortControllerRef = useRef(null)

  const triggerContextGeneration = async () => {
    if (!token || !ideaId) return
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    
    const controller = new AbortController()
    abortControllerRef.current = controller
    setGenerating(true)
    setError(null)
    
    try {
      const res = await generateProjectContext(token, ideaId, controller.signal)
      if (res && typeof res === 'object') {
        const fileKeys = [
          { key: 'readme', name: 'README.md' },
          { key: 'agents', name: 'Agents.md' },
          { key: 'build_plan', name: 'build-plan.md' },
          { key: 'architecture', name: 'architecture.md' },
          { key: 'project_overview', name: 'project-overview.md' },
          { key: 'mermaid_diagram', name: 'architecture-flow.mermaid' },
          { key: 'code_standards', name: 'code-standards.md' },
          { key: 'library_docs', name: 'library-docs.md' },
          { key: 'progress_tracker', name: 'progress-tracker.md' },
          { key: 'ui_rules', name: 'ui-rules.md' },
          { key: 'ui_tokens', name: 'ui-tokens.md' },
          { key: 'ui_registry', name: 'ui-registry.md' }
        ]

        const files = fileKeys
          .filter(f => res[f.key])
          .map(f => ({
            name: f.name,
            key: f.key,
            content: typeof res[f.key] === 'string' ? res[f.key] : JSON.stringify(res[f.key], null, 2)
          }))

        if (files.length > 0) {
          setGeneratedFiles(files)
          toast.success('Context files generated successfully!')
        } else {
          toast.success('Context generation completed!')
        }
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        toast.error('Context generation cancelled.')
      } else {
        console.error(err)
        setError(err.message || 'Failed to generate context')
        toast.error('Failed to generate project context.')
      }
    } finally {
      if (abortControllerRef.current === controller) {
        setGenerating(false)
        abortControllerRef.current = null
      }
    }
  }

  const cancelContextGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      setGenerating(false)
      abortControllerRef.current = null
    }
  }

  return {
    isGenerating,
    generatedFiles,
    error,
    triggerContextGeneration,
    cancelContextGeneration,
  }
}
