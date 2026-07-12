import { useState, useEffect, useRef } from 'react'
import { getProject } from '../api/projects.api'
import { generateArtifacts, generateSingleArtifact } from '../api/ai.api'
import { getProjectArtifacts } from '@/features/artifacts/api/artifacts.api'
import { useChatStore } from '../store/useChatStore'
import { toast } from 'react-hot-toast'

export function useProjectData(token, projectId) {
  const [project, setProject] = useState(null)
  const [ideaId, setIdeaId] = useState(null)
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [artifacts, setArtifacts] = useState([])
  const [activeArtifact, setActiveArtifact] = useState(null)
  const [isGeneratingArtifacts, setIsGeneratingArtifacts] = useState(false)
  const [isArtifactsOpen, setIsArtifactsOpen] = useState(false)
  const [showSpecReady, setShowSpecReady] = useState(false)
  const [specContent, setSpecContent] = useState(null)

  useEffect(() => {
    let isMounted = true
    const loadProject = async () => {
      try {
        const res = await getProject(token, projectId)
        if (res.data && isMounted) {
          setProject(res.data)
          const ws = res.data.wizard_state

          if (ws?.ideaId) {
            setIdeaId(ws.ideaId)
            const reconstructed = []

            if (ws.prompt) {
              reconstructed.push({
                id: 'prompt-user',
                role: 'user',
                content: ws.prompt,
                timestamp: new Date(res.data.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              })
            }

            if (ws.history?.length > 0) {
              ws.history.forEach((h, i) => {
                reconstructed.push({ id: `hist-ai-${i}`, role: 'assistant', content: h.question, options: undefined, timestamp: '' })
                reconstructed.push({ id: `hist-user-${i}`, role: 'user', content: h.answer, timestamp: '' })
              })
            }

            if (ws.isComplete && ws.refinedSpec) {
              if (!ws.devChatHistory?.length) {
                setSpecContent(ws.refinedSpec)
                setShowSpecReady(true)
              } else {
                setSpecContent(ws.refinedSpec)
              }
            } else if (ws.currentQuestion) {
              reconstructed.push({
                id: 'current-q',
                role: 'assistant',
                content: ws.currentQuestion.question,
                options: ws.currentQuestion.options || [],
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              })
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
            } else if (ws?.isComplete && ws?.ideaId) {
              setIsGeneratingArtifacts(true)
              setIsArtifactsOpen(true)
              ;(async () => {
                try {
                  await generateArtifacts(token, ws.ideaId, { projectId })
                  let pending = await getProjectArtifacts(token, projectId)
                  if (pending?.length > 0 && isMounted) {
                    setArtifacts(pending)
                    setActiveArtifact(pending[0])
                    for (let i = 0; i < pending.length; i++) {
                      if (!isMounted) return
                      try {
                        const r = await generateSingleArtifact(token, projectId, pending[i].file_path)
                        if (r?.artifact && isMounted) {
                          setArtifacts((prev) =>
                            prev.map((a) => (a._id === pending[i]._id ? { ...a, content: r.artifact.content } : a))
                          )
                          if (i === 0) setActiveArtifact(r.artifact)
                        }
                      } catch (e) {
                        console.error('Failed to generate file:', pending[i].file_path, e)
                      }
                    }
                    if (isMounted) toast.success('Project artifacts generated!')
                  }
                } catch (err) {
                  console.error('Async generation failed', err)
                } finally {
                  if (isMounted) setIsGeneratingArtifacts(false)
                }
              })()
            }
          } catch (e) {
            console.error('Failed to fetch artifacts', e)
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
    return () => {
      isMounted = false
    }
  }, [token, projectId])

  return {
    project,
    setProject,
    ideaId,
    setIdeaId,
    isPageLoading,
    setIsPageLoading,
    artifacts,
    setArtifacts,
    activeArtifact,
    setActiveArtifact,
    isGeneratingArtifacts,
    setIsGeneratingArtifacts,
    isArtifactsOpen,
    setIsArtifactsOpen,
    showSpecReady,
    setShowSpecReady,
    specContent,
    setSpecContent,
  }
}
