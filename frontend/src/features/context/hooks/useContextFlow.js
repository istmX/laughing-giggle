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
    setGeneratedFiles([]) // Reset previous files on start
    
    try {
      const response = await generateProjectContext(token, ideaId, controller.signal)
      if (!response.ok) {
        throw new Error('Failed to generate project context.')
      }
      
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      
      const fileKeysMap = {
        agents: 'Agents.md',
        design: 'design.md',
        architecture: 'architecture.md',
        project_overview: 'project-overview.md'
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() // retain incomplete line in buffer
        
        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed.startsWith('data: ')) continue
          const rawData = trimmed.substring(6)
          try {
            const parsed = JSON.parse(rawData)
            if (parsed.key && parsed.content) {
              const name = fileKeysMap[parsed.key] || parsed.key
              
              setGeneratedFiles(prev => {
                const exists = prev.some(f => f.key === parsed.key)
                if (exists) {
                  return prev.map(f => f.key === parsed.key ? { ...f, content: parsed.content } : f)
                } else {
                  return [...prev, { name, key: parsed.key, content: parsed.content }]
                }
              })
              
              if (parsed.status === 'failed') {
                toast.error(`Failed to generate ${name}`)
              } else {
                toast.success(`${name} generated!`)
              }
            }
          } catch (e) {
            console.error('Error parsing SSE line:', trimmed, e)
          }
        }
      }
      
      toast.success('Context generation completed!')
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
