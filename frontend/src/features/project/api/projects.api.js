import { authFetch } from '@/features/auth/api/auth.api'

export const createProject = async (token, payload = { project_title: "Untitled Project" }) => {
  return authFetch('/projects', {
    method: 'POST',
    token,
    body: JSON.stringify(payload)
  })
}

export const saveProjectIdea = async (token, prompt) => {
  return authFetch('/ideas', {
    method: 'POST',
    token,
    body: JSON.stringify({ prompt })
  })
}

export const createBrief = async (token, ideaId) => {
  return authFetch('/brief', {
    method: 'POST',
    token,
    body: JSON.stringify({ idea: ideaId })
  })
}

export const updateBrief = async (token, briefId, answers) => {
  return authFetch(`/brief/${briefId}`, {
    method: 'PATCH',
    token,
    body: JSON.stringify({ answers })
  })
}

export const analyzeIdea = async (token, ideaId) => {
  return authFetch(`/ai/analyze/${ideaId}`, {
    method: 'POST',
    token,
  })
}

export const generateQuestions = async (token, ideaId) => {
  return authFetch(`/ai/questions/${ideaId}`, {
    method: 'POST',
    token,
  })
}

export const updateProject = async (token, projectId, data) => {
  return authFetch(`/projects/${projectId}`, {
    method: 'PATCH',
    token,
    body: JSON.stringify(data)
  })
}

export const getProjects = async (token) => {
  return authFetch(`/projects`, {
    method: 'GET',
    token,
  })
}

export const deleteProject = async (token, projectId) => {
  return authFetch(`/projects/${projectId}`, {
    method: 'DELETE',
    token,
  })
}
