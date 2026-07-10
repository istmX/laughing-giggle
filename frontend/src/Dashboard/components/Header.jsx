import { useLocation } from 'react-router-dom'
import { Menu } from 'lucide-react'

function getPageTitle(pathname) {
  if (pathname === '/dashboard') return 'Overview'
  if (pathname === '/dashboard/projects/new') return 'New Project'
  if (pathname === '/dashboard/playground') return 'AI Playground'
  if (pathname === '/dashboard/context') return 'Context Library'
  if (pathname === '/dashboard/templates') return 'Templates'
  if (pathname === '/dashboard/recent') return 'Recent History'
  if (pathname === '/dashboard/favorites') return 'Favorites'
  if (pathname === '/dashboard/docs') return 'Documentation'
  if (pathname === '/dashboard/changelog') return 'Changelog'
  
  if (pathname.startsWith('/dashboard/settings/')) {
    const section = pathname.split('/').pop()
    if (!section) return 'Settings'
    return `Settings / ${section.charAt(0).toUpperCase() + section.slice(1)}`
  }
  
  // Fallback for unknown routes
  const parts = pathname.split('/').filter(Boolean)
  const lastPart = parts[parts.length - 1] || 'Dashboard'
  return lastPart.charAt(0).toUpperCase() + lastPart.slice(1).replace(/-/g, ' ')
}

export function Header({ setIsMobileMenuOpen }) {
  const location = useLocation()
  const title = getPageTitle(location.pathname)

  return (
    <header className="flex h-16 items-center justify-between border-b border-hairline/50 bg-background px-4 shrink-0">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden rounded-md p-2 text-ink-muted hover:bg-surface-soft hover:text-ink transition-colors"
          aria-label="Open mobile menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden sm:flex items-center text-sm font-medium text-ink-muted">
          <span>{title}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {/* Decorative/non-functional notification and search icons were removed here to follow hardening principles (no dead-ends). */}
      </div>
    </header>
  )
}
