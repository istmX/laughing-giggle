import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import {
  FolderOpen, Plus, X, PanelLeftClose, PanelLeftOpen,
  PlaySquare, Library, LayoutTemplate,
  Clock, Star, FileText, History, User, Sliders,
  Key, CreditCard, LogOut
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { createProject } from '@/features/project/api/projects.api'

const navGroups = [
  {
    label: 'Projects',
    items: [
      { name: 'All Projects', href: '/dashboard', icon: FolderOpen },
      { name: 'Recent Projects', href: '/dashboard/recent', icon: Clock },
      { name: 'Favorites', href: '/dashboard/favorites', icon: Star },
    ]
  },
  {
    label: 'Workspace',
    items: [
      { name: 'AI Playground', href: '/dashboard/playground', icon: PlaySquare },
      { name: 'Templates', href: '/dashboard/templates', icon: LayoutTemplate },
    ]
  },
  {
    label: 'Resources',
    items: [
      { name: 'Documentation', href: '/dashboard/docs', icon: FileText },
      { name: 'Changelog', href: '/dashboard/changelog', icon: History },
    ]
  },
  {
    label: 'Settings',
    items: [
      { name: 'Account', href: '/dashboard/profile', icon: User },
      { name: 'Preferences', href: '/dashboard/settings/preferences', icon: Sliders },
    ]
  }
]

function renderNavContent({ mobile = false, isSidebarOpen, currentPath, handleAction, closeMobileMenu }) {
  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {navGroups.map((group) => (
        <div key={group.label} className="flex flex-col space-y-1">
      
          {(isSidebarOpen || mobile) && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="px-3 text-xs font-semibold uppercase tracking-wider text-ink-muted mb-1"
            >
              {group.label}
            </motion.span>
          )}

          {/* Links */}
          {group.items.map((item) => {
            const isActive = currentPath === item.href
            
            const ItemContent = (
              <>
                {isActive && (
                  <motion.div
                    layoutId={mobile ? "mobile-active-nav" : "desktop-active-nav"}
                    className="absolute inset-0 rounded-full bg-ink"
                    initial={false}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                
                <item.icon className="relative z-10 h-5 w-5 shrink-0" />
                
                {(isSidebarOpen || mobile) && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative z-10 whitespace-nowrap"
                  >
                    {item.name}
                  </motion.span>
                )}
              </>
            )

            const className = cn(
              "relative flex items-center gap-3 rounded-full px-4 py-[10px] text-[16px] font-[480] transition-colors w-full text-left",
              isActive ? "text-canvas" : "text-ink-muted hover:bg-surface-soft hover:text-ink",
              (!isSidebarOpen && !mobile) && "justify-center px-2"
            )

            if (item.actionId) {
              return (
                <button
                  key={item.name}
                  onClick={() => handleAction(item.actionId)}
                  title={(!isSidebarOpen && !mobile) ? item.name : undefined}
                  className={className}
                >
                  {ItemContent}
                </button>
              )
            }

            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={closeMobileMenu}
                title={(!isSidebarOpen && !mobile) ? item.name : undefined}
                className={className}
              >
                {ItemContent}
              </Link>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export function Sidebar({ isSidebarOpen, setIsSidebarOpen, isMobileMenuOpen, setIsMobileMenuOpen }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, user, token } = useAuth()
  const currentPath = location.pathname

  const handleAction = async (actionId) => {
    if (actionId === 'new_project') {
      try {
        const res = await createProject(token, { project_title: 'Untitled Project' })
        if (res?.data?._id) {
          navigate(`/projects/${res.data._id}`)
          if (isMobileMenuOpen) setIsMobileMenuOpen(false)
        }
      } catch (err) {
        console.error('Failed to create project', err)
      }
    }
  }

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false)
    }
    if (isMobileMenuOpen) {
      window.addEventListener('keydown', handleEscape)
    }
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isMobileMenuOpen, setIsMobileMenuOpen])

  return (
    <>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-50 w-72 border-r border-hairline bg-background flex flex-col shadow-xl md:hidden"
            >
              <div className="flex items-center justify-between h-16 px-4 border-b border-hairline/50 shrink-0">
                <span className="text-xl font-bold tracking-tight">ZENIX</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close mobile menu"
                  className="rounded-md p-2 hover:bg-surface-soft text-ink-muted hover:text-ink transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {renderNavContent({ mobile: true, isSidebarOpen, currentPath, handleAction, closeMobileMenu: () => setIsMobileMenuOpen(false) })}
              
              <div className="p-4 border-t border-hairline/50 shrink-0">
                <div className="flex items-center justify-between mb-4 px-2">
                  <Link to="/dashboard/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 w-full p-2 rounded-md hover:bg-surface-soft transition-colors cursor-pointer">
                    {user?.avatar ? (
                      <img 
                        src={user.avatar}
                        alt={user.name}
                        className="h-8 w-8 rounded-full bg-surface-soft object-cover border border-hairline shrink-0"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-surface-soft border border-hairline flex items-center justify-center shrink-0">
                        <span className="text-xs font-medium text-ink-muted">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-ink">{user?.name || 'Profile'}</span>
                    </div>
                  </Link>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to sign out?')) {
                      logout()
                    }
                  }}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-base font-medium text-destructive hover:bg-destructive/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/30"
                >
                  <LogOut className="h-5 w-5" />
                  Sign out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 72 }}
        className="hidden md:flex flex-col border-r border-hairline bg-background h-full"
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-hairline/50 shrink-0">
          <AnimatePresence mode="wait">
            {isSidebarOpen ? (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="text-xl font-bold tracking-tight overflow-hidden whitespace-nowrap"
              >
                ZENIX
              </motion.span>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full flex justify-center"
              >
                <div className="h-6 w-6 rounded bg-ink" />
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex items-center justify-center rounded-md p-1.5 text-ink-muted hover:bg-surface-soft hover:text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30"
            title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isSidebarOpen ? (
              <PanelLeftClose className="h-5 w-5" />
            ) : (
              <PanelLeftOpen className="h-5 w-5" />
            )}
          </button>
        </div>

        {renderNavContent({ mobile: false, isSidebarOpen, currentPath, handleAction })}

        <div className="p-3 border-t border-hairline/50 shrink-0">
          {isSidebarOpen ? (
             <div className="flex flex-col gap-2">
                <Link to="/dashboard/profile" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-surface-soft transition-colors cursor-pointer">
                  {user?.avatar ? (
                    <img 
                      src={user.avatar}
                      alt={user.name}
                      className="h-8 w-8 rounded-full bg-surface-soft object-cover border border-hairline shrink-0"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-surface-soft border border-hairline flex items-center justify-center shrink-0">
                      <span className="text-xs font-medium text-ink-muted">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                    </div>
                  )}
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-medium truncate text-ink">{user?.name || 'Profile'}</span>
                  </div>
                </Link>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to sign out?')) {
                      logout()
                    }
                  }}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium text-destructive hover:bg-destructive/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/30"
                >
                  <LogOut className="h-5 w-5 shrink-0" />
                  <span className="whitespace-nowrap">Sign out</span>
                </button>
             </div>
          ) : (
            <div className="flex flex-col gap-4 items-center py-2">
              <Link to="/dashboard/profile" title="Profile" className="hover:opacity-80 transition-opacity">
                {user?.avatar ? (
                  <img 
                    src={user.avatar}
                    alt={user.name}
                    className="h-6 w-6 rounded-full bg-surface-soft object-cover border border-hairline"
                  />
                ) : (
                  <div className="h-6 w-6 rounded-full bg-surface-soft border border-hairline flex items-center justify-center">
                    <span className="text-[10px] font-medium text-ink-muted">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                  </div>
                )}
              </Link>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to sign out?')) {
                    logout()
                  }
                }}
                className="text-destructive hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive/30 rounded-md p-1"
                title="Sign out"
                aria-label="Sign out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </motion.aside>
    </>
  )
}
