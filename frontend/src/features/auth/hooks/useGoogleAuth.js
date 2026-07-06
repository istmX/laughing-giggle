import { useEffect, useRef, useState } from 'react'

import { getGoogleClientId } from '@/features/auth/api/auth.api'

const GOOGLE_SCRIPT_ID = 'google-identity-services'

const loadGoogleScript = () => {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Google sign-in is only available in the browser'))
  }

  if (window.google?.accounts?.id) {
    return Promise.resolve(window.google)
  }

  return new Promise((resolve, reject) => {
    const existingScript = document.getElementById(GOOGLE_SCRIPT_ID)

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.google), { once: true })
      existingScript.addEventListener('error', () => reject(new Error('Failed to load Google sign-in')),
        { once: true })
      return
    }

    const script = document.createElement('script')
    script.id = GOOGLE_SCRIPT_ID
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => resolve(window.google)
    script.onerror = () => reject(new Error('Failed to load Google sign-in'))
    document.head.appendChild(script)
  })
}

const useGoogleAuth = ({ onCredential }) => {
  const [ready, setReady] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(() => (getGoogleClientId() ? '' : 'Google sign-in is not configured'))
  const pendingRef = useRef(null)
  const onCredentialRef = useRef(onCredential)

  useEffect(() => {
    onCredentialRef.current = onCredential
  }, [onCredential])

  useEffect(() => {
    const clientId = getGoogleClientId()

    if (!clientId) {
      return
    }

    let cancelled = false

    const initializeGoogle = async () => {
      try {
        await loadGoogleScript()

        if (cancelled) {
          return
        }

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response) => {
            const pending = pendingRef.current
            pendingRef.current = null

            if (!pending) {
              return
            }

            try {
              setError('')

              if (!response?.credential) {
                throw new Error('Google sign-in did not return a credential')
              }

              await onCredentialRef.current?.(response.credential)
              pending.resolve()
            } catch (signInError) {
              pending.reject(signInError)
            } finally {
              setLoading(false)
            }
          },
        })

        setReady(true)
      } catch (initializationError) {
        if (!cancelled) {
          setError(
            initializationError instanceof Error
              ? initializationError.message
              : 'Unable to start Google sign-in',
          )
        }
      }
    }

    initializeGoogle()

    return () => {
      cancelled = true
      pendingRef.current = null
    }
  }, [])

  const signInWithGoogle = () => {
    if (!ready) {
      return Promise.reject(new Error(error || 'Google sign-in is still loading'))
    }

    if (!window.google?.accounts?.id) {
      return Promise.reject(new Error('Google sign-in is unavailable'))
    }

    setLoading(true)
    setError('')

    return new Promise((resolve, reject) => {
      pendingRef.current = { resolve, reject }

      try {
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            const pending = pendingRef.current
            pendingRef.current = null
            setLoading(false)

            pending?.reject(new Error('Google sign-in was closed before completion'))
          }
        })
      } catch (promptError) {
        pendingRef.current = null
        setLoading(false)
        reject(promptError)
      }
    })
  }

  return {
    ready,
    loading,
    error,
    signInWithGoogle,
  }
}

export { useGoogleAuth }