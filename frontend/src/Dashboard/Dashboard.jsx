import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  FolderOpen,
  Plus,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Bell,
  Search,
  UserCircle,
  PlaySquare,
  Library,
  LayoutTemplate,
  Clock,
  Star,
  FileText,
  History,
  User,
  Sliders,
  Key,
  CreditCard,
  LogOut,
  LayoutDashboard
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { useAuth } from '@/features/auth/hooks/useAuth'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const navGroups = [
  {
    label: 'Projects',
    items: [
      { name: 'All Projects', href: '/dashboard', icon: FolderOpen },
      { name: 'New Project', href: '/dashboard/projects/new', icon: Plus },
    ]
  },
  {
    label: 'Workspace',
    items: [
      { name: 'AI Playground', href: '/dashboard/playground', icon: PlaySquare },
      { name: 'Context Library', href: '/dashboard/context', icon: Library },
      { name: 'Templates', href: '/dashboard/templates', icon: LayoutTemplate },
    ]
  },
  {
    label: 'History',
    items: [
      { name: 'Recent', href: '/dashboard/recent', icon: Clock },
      { name: 'Favorites', href: '/dashboard/favorites', icon: Star },
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
      { name: 'Account', href: '/dashboard/settings/account', icon: User },
      { name: 'Preferences', href: '/dashboard/settings/preferences', icon: Sliders },
      { name: 'API Keys', href: '/dashboard/settings/keys', icon: Key },
      { name: 'Billing', href: '/dashboard/settings/billing', icon: CreditCard },
    ]
  }
]



function renderNavContent({ mobile = false, isSidebarOpen, currentPath }) {
  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-6">
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
            return (
              <Link
                key={item.name}
                to={item.href}
                title={(!isSidebarOpen && !mobile) ? item.name : undefined}
                className={cn(
                  "relative flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium transition-colors",
                  isActive ? "text-ink" : "text-ink-muted hover:text-ink",
                  (!isSidebarOpen && !mobile) && "justify-center px-2"
                )}
              >
              
                {isActive && (
                  <motion.div
                    layoutId={mobile ? "mobile-active-nav" : "desktop-active-nav"}
                    className="absolute inset-0 rounded-md bg-surface-soft"
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
              </Link>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default function DashboardShell() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const { logout, user } = useAuth()
  const currentPath = location.pathname

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden text-foreground font-sans">
      {/* Mobile Sidebar Overlay */}
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
                  className="rounded-md p-2 hover:bg-surface-soft text-ink-muted hover:text-ink transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {renderNavContent({ mobile: true, isSidebarOpen, currentPath })}
              
              <div className="p-4 border-t border-hairline/50 shrink-0">
                <div className="flex items-center justify-between mb-4 px-2">
                  <div className="flex items-center gap-3">
                    <UserCircle className="h-8 w-8 text-ink-muted" />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{user?.name || 'Profile'}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => logout()}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-base font-medium text-destructive hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  Sign out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
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
            className="flex items-center justify-center rounded-md p-1.5 text-ink-muted hover:bg-surface-soft hover:text-ink transition-colors"
            title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isSidebarOpen ? (
              <PanelLeftClose className="h-5 w-5" />
            ) : (
              <PanelLeftOpen className="h-5 w-5" />
            )}
          </button>
        </div>

        {renderNavContent({ mobile: false, isSidebarOpen, currentPath })}

        <div className="p-3 border-t border-hairline/50 shrink-0">
          {isSidebarOpen ? (
             <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 px-3 py-2">
                  <UserCircle className="h-8 w-8 text-ink-muted" />
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-medium truncate">{user?.name || 'Profile'}</span>
                  </div>
                </div>
                <button
                  onClick={() => logout()}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium text-destructive hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="h-5 w-5 shrink-0" />
                  <span className="whitespace-nowrap">Sign out</span>
                </button>
             </div>
          ) : (
            <div className="flex flex-col gap-4 items-center py-2">
              <UserCircle className="h-6 w-6 text-ink-muted" />
              <button
                onClick={() => logout()}
                className="text-destructive hover:text-red-600 transition-colors"
                title="Sign out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-hairline/50 bg-background px-4 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden rounded-md p-2 text-ink-muted hover:bg-surface-soft hover:text-ink transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden sm:flex items-center text-sm text-ink-muted">
              <span>Overview</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-full p-2 text-ink-muted hover:bg-surface-soft hover:text-ink transition-colors">
              <Search className="h-4 w-4" />
            </button>
            <button className="rounded-full p-2 text-ink-muted hover:bg-surface-soft hover:text-ink transition-colors">
              <Bell className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-5xl space-y-6">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-ink">Welcome to Zenix</h1>
              <p className="text-base text-ink-muted mt-1">Select a project or workspace context from the sidebar to get started.</p>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-lg border border-hairline bg-background p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-ink-muted">Metric {i}</h3>
                    <LayoutDashboard className="h-4 w-4 text-ink-muted" />
                  </div>
                  <div className="mt-4">
                    <span className="text-2xl font-semibold text-ink">1,234</span>
                    <span className="ml-2 text-sm text-semantic-success">+12.3%</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-hairline bg-background min-h-[400px] flex flex-col items-center justify-center">
              <div className="text-center text-ink-muted max-w-sm">
                <FolderOpen className="mx-auto h-10 w-10 mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-ink mb-2">No project selected</h3>
                <p className="text-base">Choose a project from the sidebar or create a new one to start working.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
