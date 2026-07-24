import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { LiveSandbox } from './LiveSandbox'
import * as api from '../api/playground.api'

export const PlaygroundPreview = () => {
  const { sessionId } = useParams()
  const { token } = useAuth()
  const [tokens, setTokens] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTokens = async () => {
      if (sessionId === 'draft') {
        try {
          const draftData = localStorage.getItem('zenix_playground_draft_tokens')
          if (draftData) {
            setTokens(JSON.parse(draftData))
          }
        } catch (err) {
          console.error('Failed to parse draft tokens', err)
        } finally {
          setLoading(false)
        }
        return
      }

      if (!token || !sessionId) {
        setLoading(false)
        return
      }

      try {
        const res = await api.getSession(token, sessionId)
        const session = res?.data?.session || res?.session || res?.data || res
        setTokens(session?.tokens || {})
      } catch (err) {
        console.error('Failed to load session tokens', err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchTokens()
  }, [token, sessionId])

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-canvas">
        <div className="flex flex-col items-center gap-3">
          <span className="text-sm font-medium text-ink opacity-80 animate-pulse">Loading design tokens preview...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen bg-canvas overflow-y-auto" data-lenis-prevent="true">
      <LiveSandbox tokens={tokens} />
    </div>
  )
}
export default PlaygroundPreview
