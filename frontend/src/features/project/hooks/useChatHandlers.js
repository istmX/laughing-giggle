import { getProjectArtifacts } from '@/features/artifacts/api/artifacts.api'
import { generateArtifacts, generateSingleArtifact, analyzeIdea, processConversation, developerChat } from '../api/ai.api'
import { createIdea } from '../api/ideas.api'
import { updateProject } from '../api/projects.api'
import { useChatStore } from '../store/useChatStore'
import { toast } from 'react-hot-toast'

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
      if (typeof res === 'object' && !res.content && (res.project_title || res.next_question || res.is_complete !== undefined)) return res
      let content = res.content || res.data?.content || res
      if (typeof content !== 'string') return content
      content = content.replace(/```json/gi, '').replace(/```/g, '').trim()
      const startObj = content.indexOf('{')
      const startArr = content.indexOf('[')
      const endObj = content.lastIndexOf('}')
      const endArr = content.lastIndexOf(']')
      let start = -1, end = -1
      if (startObj !== -1 && (startArr === -1 || startObj < startArr)) { start = startObj; end = endObj }
      else if (startArr !== -1) { start = startArr; end = endArr }
      if (start !== -1 && end !== -1 && end > start) content = content.substring(start, end + 1)
      return JSON.parse(content)
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
        for (let i = 0; i < pending.length; i++) {
          try {
            const r = await generateSingleArtifact(token, projectId, pending[i].file_path)
            if (r?.artifact) {
              setArtifacts(prev => prev.map(a => a._id === pending[i]._id ? { ...a, content: r.artifact.content } : a))
              if (i === 0) setActiveArtifact(r.artifact)
            }
          } catch (e) { console.error('Failed to generate file:', pending[i].file_path, e) }
        }
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
        const ideaRes = await createIdea(token, { prompt: text })
        const newIdeaId = ideaRes.data?._id || ideaRes._id
        setIdeaId(newIdeaId)
        const analyzeRes = await analyzeIdea(token, newIdeaId)
        const parsedAnalysis = parseAIResponse(analyzeRes)

        const convoRes = await processConversation(token, newIdeaId, { history: [] })
        const parsedConvo = parseAIResponse(convoRes)
        const title = parsedConvo.project_title || parsedAnalysis.project_title || 'Untitled Project'
        const description = parsedConvo.project_description || parsedAnalysis.project_description || text
        setProject(prev => ({ ...prev, project_title: title, project_description: description }))


        if (parsedConvo.is_complete) {
          setSpecContent(parsedConvo.refined_spec)
          setShowSpecReady(true)
          await syncStateToBackend(
            { ideaId: newIdeaId, prompt: text, history: [], currentQuestion: null, refinedSpec: parsedConvo.refined_spec, isComplete: true },
            { project_title: title, project_description: description }
          )
          handleGenerateArtifacts(newIdeaId)
        } else {
          const opts = Array.isArray(parsedConvo.options) ? parsedConvo.options : []
          const qMsg = {
            id: `q-${Date.now()}`,
            role: 'assistant',
            content: parsedConvo.next_question || 'What is the primary feature?',
            options: opts,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
          useChatStore.getState().addMessage(qMsg)
          await syncStateToBackend(
            { ideaId: newIdeaId, prompt: text, history: [], currentQuestion: { question: qMsg.content, options: opts }, refinedSpec: null, isComplete: false },
            { project_title: title, project_description: description }
          )
        }


      } else if (project?.wizard_state?.isComplete) {
        const hist = []
        const currentMsgs = useChatStore.getState().messages
        for (let i = 0; i < currentMsgs.length - 1; i += 2) {
          if (currentMsgs[i].role === 'user' && currentMsgs[i + 1]?.role === 'assistant') {
            hist.push({ question: currentMsgs[i].content, answer: currentMsgs[i + 1].content })
          }
        }
        const res = await developerChat(token, projectId, { prompt: text, history: hist })
        const aiMessage = {
          id: `dev-${Date.now()}`,
          role: 'assistant',
          content: res?.content || res?.data?.content || 'No response received.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
        useChatStore.getState().addMessage(aiMessage)

        const updatedArtifacts = res?.updatedArtifacts || res?.data?.updatedArtifacts
        if (Array.isArray(updatedArtifacts) && updatedArtifacts.length > 0) {
          aiMessage.affectedFiles = updatedArtifacts.map(a => a.file_path)
          setArtifacts(prev => prev.map(a => {
            const u = updatedArtifacts.find(u => u.file_path === a.file_path)
            return u ? { ...a, content: u.content } : a
          }))
          if (activeArtifact) {
            const activeUpdate = updatedArtifacts.find(u => u.file_path === activeArtifact.file_path)
            if (activeUpdate) setActiveArtifact(prev => ({ ...prev, content: activeUpdate.content }))
          }
        }
        await syncStateToBackend({
          ...project.wizard_state,
          devChatHistory: [...(project.wizard_state.devChatHistory || []), { question: text, answer: aiMessage.content }]
        })

      } else {
        const hist = []
        const currentMsgs = useChatStore.getState().messages
        let currentPrompt = currentMsgs[0]?.content || ''
        for (let i = 1; i < currentMsgs.length - 1; i += 2) {
          if (currentMsgs[i].role === 'assistant' && currentMsgs[i + 1]?.role === 'user') {
            hist.push({ question: currentMsgs[i].content, answer: currentMsgs[i + 1].content })
          }
        }
        hist.push({ question: currentMsgs[currentMsgs.length - 1]?.content || '', answer: text })

        const res = await processConversation(token, ideaId, { history: hist })
        const parsed = parseAIResponse(res)

        if (parsed.is_complete) {
          setSpecContent(parsed.refined_spec)
          setShowSpecReady(true)
          await syncStateToBackend({ ideaId, prompt: currentPrompt, history: hist, currentQuestion: null, refinedSpec: parsed.refined_spec, isComplete: true })
          handleGenerateArtifacts(ideaId)
        } else {
          const opts = Array.isArray(parsed.options) ? parsed.options : []
          const qMsg = {
            id: `q-${Date.now()}`,
            role: 'assistant',
            content: parsed.next_question || 'Any other details?',
            options: opts,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
          useChatStore.getState().addMessage(qMsg)
          await syncStateToBackend({ ideaId, prompt: currentPrompt, history: hist, currentQuestion: { question: qMsg.content, options: opts }, refinedSpec: null, isComplete: false })
        }
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
