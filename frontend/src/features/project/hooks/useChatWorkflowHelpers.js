import { getProjectArtifacts } from '@/features/artifacts/api/artifacts.api'
import { generateArtifacts, generateSingleArtifact, processConversation, developerChat } from '../api/ai.api'
import { createIdea } from '../api/ideas.api'
import { updateProject } from '../api/projects.api'
import { useChatStore } from '../store/useChatStore'
import { toast } from 'react-hot-toast'
import {
  DEFAULT_PROJECT_TITLE,
  DEFAULT_PRIMARY_FEATURE_QUESTION,
  DEFAULT_SUBSEQUENT_QUESTION,
  DEFAULT_DEV_CHAT_RESPONSE,
} from '../constants/chat.constants'

// Helper 1: New Idea Submission Flow
export async function handleNewIdeaFlow({
  text,
  token,
  setIdeaId,
  setProject,
  setSpecContent,
  setShowSpecReady,
  syncStateToBackend,
  handleGenerateArtifacts,
  parseAIResponse,
}) {
  const ideaRes = await createIdea(token, { prompt: text })
  const newIdeaId = ideaRes.data?._id || ideaRes._id
  setIdeaId(newIdeaId)

  const convoRes = await processConversation(token, newIdeaId, { history: [] })
  const rawConvo = convoRes?.response || convoRes?.data || convoRes
  const parsedConvo = parseAIResponse(rawConvo)
  const isComplete = rawConvo?.is_complete ?? parsedConvo.is_complete ?? false
  const refinedSpec = rawConvo?.refined_spec || parsedConvo.refined_spec || ''

  const title = rawConvo?.project_title || parsedConvo.project_title || DEFAULT_PROJECT_TITLE
  const description = rawConvo?.project_description || parsedConvo.project_description || text
  setProject(prev => ({ ...prev, project_title: title, project_description: description }))

  const isGreeting = rawConvo?.status === 'greeting' || parsedConvo?.status === 'greeting'
  const greetingText = (rawConvo?.generated_questions || parsedConvo?.generated_questions)?.[0]

  if (isComplete) {
    setSpecContent(refinedSpec)
    setShowSpecReady(true)
    await syncStateToBackend(
      { ideaId: newIdeaId, prompt: text, history: [], currentQuestion: null, refinedSpec: refinedSpec, isComplete: true },
      { project_title: title, project_description: description }
    )
    handleGenerateArtifacts(newIdeaId)
  } else {
    const opts = Array.isArray(parsedConvo.options) ? parsedConvo.options : []
    const qContent = isGreeting ? (greetingText || DEFAULT_PRIMARY_FEATURE_QUESTION) : (parsedConvo.next_question || DEFAULT_PRIMARY_FEATURE_QUESTION)
    const qMsg = {
      id: `q-${Date.now()}`,
      role: 'assistant',
      content: qContent,
      options: opts,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    useChatStore.getState().addMessage(qMsg)
    await syncStateToBackend(
      { ideaId: newIdeaId, prompt: text, history: [], currentQuestion: { question: qMsg.content, options: opts }, refinedSpec: null, isComplete: false },
      { project_title: title, project_description: description }
    )
  }
}

// Helper 2: Completed Project Developer Chat Flow
export async function handleDevChatFlow({
  text,
  token,
  projectId,
  project,
  setArtifacts,
  activeArtifact,
  setActiveArtifact,
  syncStateToBackend,
}) {
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
    content: res?.content || res?.data?.content || DEFAULT_DEV_CHAT_RESPONSE,
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
    devChatHistory: [...(project.wizard_state?.devChatHistory || []), { question: text, answer: aiMessage.content }]
  })
}

// Helper 3: In-Progress Wizard Turn Flow
export async function handleWizardTurnFlow({
  text,
  token,
  ideaId,
  setSpecContent,
  setShowSpecReady,
  syncStateToBackend,
  handleGenerateArtifacts,
  parseAIResponse,
}) {
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
  const isGreeting = res?.status === 'greeting' || parsed?.status === 'greeting'
  const greetingText = (res?.generated_questions || parsed?.generated_questions)?.[0]

  if (parsed.is_complete) {
    setSpecContent(parsed.refined_spec)
    setShowSpecReady(true)
    await syncStateToBackend({ ideaId, prompt: currentPrompt, history: hist, currentQuestion: null, refinedSpec: parsed.refined_spec, isComplete: true })
    handleGenerateArtifacts(ideaId)
  } else {
    const opts = Array.isArray(parsed.options) ? parsed.options : []
    const qContent = isGreeting ? (greetingText || DEFAULT_SUBSEQUENT_QUESTION) : (parsed.next_question || DEFAULT_SUBSEQUENT_QUESTION)
    const qMsg = {
      id: `q-${Date.now()}`,
      role: 'assistant',
      content: qContent,
      options: opts,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    useChatStore.getState().addMessage(qMsg)
    await syncStateToBackend({ ideaId, prompt: currentPrompt, history: hist, currentQuestion: { question: qMsg.content, options: opts }, refinedSpec: null, isComplete: false })
  }
}
