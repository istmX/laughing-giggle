import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { usePreferencesStore } from '../store/preferences.store'

export const ThemeProvider = ({ children }) => {
  const theme = usePreferencesStore((state) => state.theme)
  const location = useLocation()

  useLayoutEffect(() => {
    const root = window.document.documentElement
    
    // Smooth transition trigger
    root.classList.add('theme-transitioning')
    const timer = setTimeout(() => {
      root.classList.remove('theme-transitioning')
    }, 350)

    root.classList.remove('light', 'dark')

    const isDashboard = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/projects/')
    
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const applySystemTheme = (e) => {
        root.classList.remove('light', 'dark')
        root.classList.add(e.matches ? 'dark' : 'light')
      }
      
      applySystemTheme(mediaQuery)
      mediaQuery.addEventListener('change', applySystemTheme)
      
      return () => {
        mediaQuery.removeEventListener('change', applySystemTheme)
        clearTimeout(timer)
      }
    }

    const resolvedTheme = (theme === 'dark' || theme === 'midnight' || theme === 'emerald' || theme === 'sunset') ? 'dark' : 'light'

    if (isDashboard) {
      root.classList.add(resolvedTheme)
    } else {
      // Landing page and other pages support light and dark theme
      root.classList.add(resolvedTheme)
    }

    return () => clearTimeout(timer)
  }, [theme, location.pathname])

  return children
}
