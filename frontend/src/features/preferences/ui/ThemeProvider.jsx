import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { usePreferencesStore } from '../store/preferences.store'

export const ThemeProvider = ({ children }) => {
  const theme = usePreferencesStore((state) => state.theme)
  const location = useLocation()

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark', 'theme-midnight', 'theme-emerald')

    const isDashboard = location.pathname.startsWith('/dashboard')
    if (!isDashboard) {
      root.classList.add('light')
      return
    }

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const applySystemTheme = (e) => {
        root.classList.remove('light', 'dark', 'theme-midnight', 'theme-emerald')
        root.classList.add(e.matches ? 'dark' : 'light')
      }
      
      applySystemTheme(mediaQuery)
      mediaQuery.addEventListener('change', applySystemTheme)
      
      return () => mediaQuery.removeEventListener('change', applySystemTheme)
    }

    if (theme === 'midnight') {
      root.classList.add('dark', 'theme-midnight')
      return
    }

    if (theme === 'emerald') {
      root.classList.add('dark', 'theme-emerald')
      return
    }

    root.classList.add(theme)
  }, [theme, location.pathname])

  return children
}
