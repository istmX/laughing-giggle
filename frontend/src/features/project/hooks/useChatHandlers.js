import { getProjectArtifacts } from '@/features/artifacts/api/artifacts.api'
import { generateArtifacts, generateSingleArtifact } from '../api/ai.api'
import { updateProject } from '../api/projects.api'
import { useChatStore } from '../store/useChatStore'
import { toast } from 'react-hot-toast'
import {
  handleNewIdeaFlow,
  handleDevChatFlow,
  handleWizardTurnFlow,
} from './useChatWorkflowHelpers'

// Strip options from all messages — called on every user send
function clearAllOptions(messages) {
  return messages.map(m => ({ ...m, options: undefined }))
}

export function useChatHandlers({
  token,
  projectId,
  ideaId,
  setIdeaId,
  project,
  setProject,
  artifacts,
  setArtifacts,
  activeArtifact,
  setActiveArtifact,
  setIsGeneratingArtifacts,
  setIsArtifactsOpen,
  setShowSpecReady,
  setSpecContent,
  setIsProcessing,
  setLastFailedMessage,
  setInputValue,
  inputValue,
  isProcessing,
  abortControllerRef,
  inputRef,
}) {
  const parseAIResponse = (res) => {
    try {
      if (!res) return {}
      if (typeof res === 'object' && !res.content && (res.project_title || res.next_question || res.is_complete !== undefined)) return res
      let content = res.content || res.data?.content || res
      if (typeof content !== 'string') return typeof content === 'object' ? content : {}
      content = content.replace(/```json/gi, '').replace(/```/g, '').trim()
      const startObj = content.indexOf('{')
      const startArr = content.indexOf('[')
      const endObj = content.lastIndexOf('}')
      const endArr = content.lastIndexOf(']')
      let start = -1, end = -1
      if (startObj !== -1 && (startArr === -1 || startObj < startArr)) { start = startObj; end = endObj }
      else if (startArr !== -1) { start = startArr; end = endArr }
      if (start !== -1 && end !== -1 && end > start) content = content.substring(start, end + 1)
      const parsed = JSON.parse(content)
      return typeof parsed === 'object' && parsed !== null ? parsed : {}
    } catch (e) {
      console.error('Failed to parse AI response:', e, res)
      return {}
    }
  }

  const syncStateToBackend = async (newState, updates = {}) => {
    try { await updateProject(token, projectId, { wizard_state: newState, ...updates }) }
    catch (err) { console.error('Failed to sync state', err) }
  }

  const handleGenerateArtifacts = async (currentIdeaId) => {
    setIsGeneratingArtifacts(true)
    setIsArtifactsOpen(true)
    try {
      await generateArtifacts(token, currentIdeaId, { projectId })
      const pending = await getProjectArtifacts(token, projectId)
      if (pending?.length > 0) {
        setArtifacts(pending)
        setActiveArtifact(pending[0])
        
        const results = await Promise.allSettled(
          pending.map(item => generateSingleArtifact(token, projectId, item.file_path))
        )
        
        const updatedList = pending.map((item, idx) => {
          const res = results[idx]
          if (res.status === 'fulfilled' && res.value?.artifact) {
            return { ...item, content: res.value.artifact.content }
          }
          return item
        })

        setArtifacts(updatedList)
        if (updatedList.length > 0) setActiveArtifact(updatedList[0])
      }
      toast.success('Project artifacts generated!')
    } catch (e) {
      console.error(e)
      toast.error('Failed to generate artifacts.')
    } finally { setIsGeneratingArtifacts(false) }
  }

  const handleSend = async (overrideValue = null) => {
    const text = overrideValue !== null ? overrideValue : inputValue
    if (!text.trim() || isProcessing) return

    setLastFailedMessage(null)
    setInputValue('')
    if (inputRef.current) inputRef.current.style.height = 'auto'
    setIsProcessing(true)

    const controller = new AbortController()
    abortControllerRef.current = controller

    const userMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    useChatStore.setState(prev => ({
      messages: [...clearAllOptions(prev.messages), userMessage]
    }))

    try {
      if (!ideaId) {
        await handleNewIdeaFlow({
          text,
          token,
          setIdeaId,
          setProject,
          setSpecContent,
          setShowSpecReady,
          syncStateToBackend,
          handleGenerateArtifacts,
          parseAIResponse,
        })
      } else if (project?.wizard_state?.isComplete) {
        await handleDevChatFlow({
          text,
          token,
          projectId,
          project,
          setArtifacts,
          activeArtifact,
          setActiveArtifact,
          syncStateToBackend,
        })
      } else {
        await handleWizardTurnFlow({
          text,
          token,
          ideaId,
          setSpecContent,
          setShowSpecReady,
          syncStateToBackend,
          handleGenerateArtifacts,
          parseAIResponse,
        })
      }
    } catch (err) {
      if (err?.name === 'AbortError' || controller.signal.aborted) return
      console.error('Failed to process message:', err)
      toast.error('Something went wrong. Try again.')
      setLastFailedMessage(text)
    } finally {
      abortControllerRef.current = null
      setIsProcessing(false)
      if (inputRef.current) inputRef.current.focus()
    }
  }

  return {
    handleSend
  }
}
