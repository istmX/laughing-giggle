import { useState } from 'react'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useContextStore } from '../store/context.store'
import { generateProjectContext } from '../api/context.api'
import toast from 'react-hot-toast'

export function useContextFlow(projectId, ideaId) {
  const { token } = useAuth()
  const { isGenerating, generatedFiles, setGenerating, setGeneratedFiles } = useContextStore()
  const [error, setError] = useState(null)

  const triggerContextGeneration = async () => {
    if (!token || !ideaId) return
    setGenerating(true)
    setError(null)
    try {
      const res = await generateProjectContext(token, ideaId)
      // Assume response returns generated files
      if (res?.data?.files) {
        setGeneratedFiles(res.data.files)
        toast.success('Context files generated successfully!')
      } else {
        toast.success('Context generation initiated!')
      }
    } catch (err) {
      console.error(err)
      setError(err.message || 'Failed to generate context')
      toast.error('Failed to generate project context.')
    } finally {
      setGenerating(false)
    }
  }

  return {
    isGenerating,
    generatedFiles,
    error,
    triggerContextGeneration,
  }
}
