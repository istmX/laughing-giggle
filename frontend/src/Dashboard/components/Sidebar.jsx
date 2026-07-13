import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useEffect, useRef, useState } from 'react'
import {
  FolderOpen, Plus, X, PanelLeftClose, PanelLeftOpen,
  PlaySquare, LayoutTemplate,
  Clock, Star, FileText, History, User, Sliders,
  LogOut, ChevronDown, Users
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
      { name: 'Recent', href: '/dashboard/recent', icon: Clock },
      { name: 'Favorites', href: '/dashboard/favorites', icon: Star },
      { name: 'Community', href: '/dashboard/community', icon: Users },
    ]
  },
  {
    label: 'Workspace',
    items: [
      { name: 'Playground', href: '/playground', icon: PlaySquare },
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

// ─── User Popover ────────────────────────────────────────────────────────────
function UserPopover({ user, logout, onClose }) {
  const popoverRef = useRef(null)

  useEffect(() => {
    function handleOutside(e) {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [onClose])

  return (
    <motion.div
      ref={popoverRef}
      initial={{ opacity: 0, y: 6, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className="absolute bottom-full left-0 mb-2 w-48 rounded-xl border border-hairline bg-canvas shadow-lg shadow-black/10 overflow-hidden z-50"
    >
      <div className="px-3 py-2.5 border-b border-hairline/60">
        <p className="text-[12px] font-[540] text-ink truncate">{user?.name || 'Account'}</p>
        <p className="text-[11px] text-ink-muted truncate mt-0.5">{user?.email || ''}</p>
      </div>
      <Link
        to="/dashboard/profile"
        onClick={onClose}
        className="flex items-center gap-2 px-3 py-2 text-[12.5px] text-ink-muted hover:text-ink hover:bg-surface-soft transition-colors"
      >
        <User className="h-[13px] w-[13px]" />
        Profile
      </Link>
        <button
          onClick={() => {
            toast((t) => (
              <div className="flex flex-col gap-3">
                <p className="text-body-sm font-500 text-ink">Are you sure you want to sign out?</p>
                <div className="flex justify-end gap-2">
                  <button 
                    onClick={() => toast.dismiss(t.id)}
                    className="px-3 py-1.5 text-button font-480 text-ink-muted hover:text-ink transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => { toast.dismiss(t.id); logout(); }}
                    className="px-3 py-1.5 bg-red-500 text-white text-button font-480 rounded-md hover:bg-red-600 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ), { duration: Infinity, style: { minWidth: '300px' } });
          }}
          className="flex w-full items-center gap-2 px-3 py-2 text-[12.5px] text-destructive hover:bg-destructive/10 transition-colors"
        >
        <LogOut className="h-[13px] w-[13px]" />
        Sign out
      </button>
    </motion.div>
  )
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ user, size = 'sm' }) {
  const dim = size === 'sm' ? 'h-6 w-6 text-[10px]' : 'h-7 w-7 text-[11px]'
  return user?.avatar ? (
    <img
      src={user.avatar}
      alt={user.name}
      className={cn(dim, 'rounded-full object-cover border border-hairline shrink-0')}
    />
  ) : (
    <div className={cn(dim, 'rounded-full bg-surface-soft border border-hairline flex items-center justify-center shrink-0')}>
      <span className="font-[540] text-ink-muted">
        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
      </span>
    </div>
  )
}

// ─── Nav Content (shared desktop + mobile) ────────────────────────────────────
function NavContent({ mobile = false, isSidebarOpen, currentPath, onNavClick, layoutId }) {
  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {navGroups.map((group, gi) => (
        <div key={group.label} className={cn('flex flex-col', gi > 0 && 'mt-5')}>
          {/* Section label */}
          {(isSidebarOpen || mobile) && (
            <motion.span
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -4 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="px-3 mb-1 text-[10px] font-mono tracking-[0.12em] text-ink-muted/60 uppercase"
            >
              {group.label}
            </motion.span>
          )}

          {/* Nav items */}
          {group.items.map((item) => {
            const isActive = currentPath === item.href

            const itemCls = cn(
              'relative flex items-center gap-2.5 px-3 py-[7px] rounded-lg text-[13.5px] font-[480] transition-all w-full text-left select-none',
              isActive
                ? 'bg-surface-soft border border-hairline/80 text-ink'
                : 'text-ink-muted hover:bg-surface-soft hover:text-ink border border-transparent',
              (!isSidebarOpen && !mobile) && 'justify-center px-0'
            )

            return (
              <motion.div key={item.name} whileTap={{ scale: 0.99 }}>
                <Link
                  to={item.href}
                  onClick={onNavClick}
                  title={(!isSidebarOpen && !mobile) ? item.name : undefined}
                  className={itemCls}
                >
                  {/* Pill highlight */}
                  {isActive && (
                    <motion.div
                      layoutId={layoutId}
                      className="absolute inset-0 rounded-lg bg-surface-soft border border-hairline/80"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    />
                  )}

                  <item.icon className="relative z-10 h-[15px] w-[15px] shrink-0" />

                  {(isSidebarOpen || mobile) && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="relative z-10 whitespace-nowrap"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </Link>
              </motion.div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

// ─── Main Sidebar ─────────────────────────────────────────────────────────────
export function Sidebar({ isSidebarOpen, setIsSidebarOpen, isMobileMenuOpen, setIsMobileMenuOpen }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout, user, token } = useAuth()
  const currentPath = location.pathname
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  const handleNewProject = async () => {
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
      {/* ── Mobile Drawer ─────────────────────────────────────── */}
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
              transition={{ type: 'spring', stiffness: 300, damping: 25, bounce: 0 }}
              className="fixed inset-y-0 left-0 z-50 w-[220px] border-r border-hairline bg-canvas flex flex-col shadow-xl md:hidden"
            >
              {/* Mobile header */}
              <div className="flex items-center justify-between h-14 px-3 border-b border-hairline/50 shrink-0">
                <span className="text-[15px] font-[700] tracking-tight font-mono">ZENIX</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleNewProject}
                    title="New project"
                    className="flex items-center justify-center h-6 w-6 rounded-md text-ink-muted hover:text-ink hover:bg-surface-soft transition-colors"
                  >
                    <Plus className="h-[14px] w-[14px]" />
                  </button>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-label="Close mobile menu"
                    className="flex items-center justify-center h-6 w-6 rounded-md hover:bg-surface-soft text-ink-muted hover:text-ink transition-colors"
                  >
                    <X className="h-[14px] w-[14px]" />
                  </button>
                </div>
              </div>

              <NavContent
                mobile
                isSidebarOpen
                currentPath={currentPath}
                onNavClick={() => setIsMobileMenuOpen(false)}
                layoutId="mobile-active-nav"
              />

              {/* Mobile user */}
              <div className="relative px-2 py-2 border-t border-hairline/50 shrink-0">
                <AnimatePresence>
                  {isPopoverOpen && (
                    <UserPopover user={user} logout={logout} onClose={() => setIsPopoverOpen(false)} />
                  )}
                </AnimatePresence>
                <button
                  onClick={() => setIsPopoverOpen((v) => !v)}
                  className="flex items-center gap-2 w-full px-2 py-1.5 rounded-lg hover:bg-surface-soft transition-colors"
                >
                  <Avatar user={user} size="sm" />
                  <span className="text-[12.5px] font-[480] text-ink truncate flex-1 text-left">
                    {user?.name || 'Account'}
                  </span>
                  <ChevronDown className="h-[12px] w-[12px] text-ink-muted shrink-0" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Desktop Sidebar ────────────────────────────────────── */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 220 : 56 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="hidden md:flex flex-col border-r border-hairline bg-canvas h-full overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between h-14 px-3 border-b border-hairline/50 shrink-0">
          <AnimatePresence mode="wait">
            {isSidebarOpen ? (
              <motion.div
                key="logo-full"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="flex items-center gap-2 overflow-hidden"
              >
                <span className="text-[15px] font-[700] tracking-tight font-mono whitespace-nowrap">ZENIX</span>
              </motion.div>
            ) : (
              <motion.div
                key="logo-icon"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex justify-center w-full"
              >
                <div className="h-6 w-6 rounded-sm bg-ink text-canvas flex items-center justify-center shrink-0">
                  <span className="text-[11px] font-[700] font-mono">Z</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {isSidebarOpen && (
            <div className="flex items-center gap-1 shrink-0">
              {/* New project button */}
              <button
                onClick={handleNewProject}
                title="New project"
                className="flex items-center justify-center h-6 w-6 rounded-md text-ink-muted hover:text-ink hover:bg-surface-soft transition-colors"
              >
                <Plus className="h-[14px] w-[14px]" />
              </button>
              {/* Collapse button */}
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="flex items-center justify-center h-6 w-6 rounded-md text-ink-muted hover:bg-surface-soft hover:text-ink transition-colors"
                title="Collapse sidebar"
                aria-label="Collapse sidebar"
              >
                <PanelLeftClose className="h-[14px] w-[14px]" />
              </button>
            </div>
          )}
        </div>

        {/* Collapsed: expand toggle */}
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="shrink-0 flex items-center justify-center h-8 w-full text-ink-muted hover:text-ink hover:bg-surface-soft transition-colors"
            title="Expand sidebar"
            aria-label="Expand sidebar"
          >
            <PanelLeftOpen className="h-[14px] w-[14px]" />
          </button>
        )}

        <NavContent
          mobile={false}
          isSidebarOpen={isSidebarOpen}
          currentPath={currentPath}
          onNavClick={null}
          layoutId="desktop-active-nav"
        />

        {/* Bottom user section */}
        <div className="relative px-2 py-2 border-t border-hairline/50 shrink-0">
          <AnimatePresence>
            {isPopoverOpen && isSidebarOpen && (
              <UserPopover user={user} logout={logout} onClose={() => setIsPopoverOpen(false)} />
            )}
          </AnimatePresence>

          {isSidebarOpen ? (
            <button
              onClick={() => setIsPopoverOpen((v) => !v)}
              className="flex items-center gap-2 w-full px-2 py-1.5 rounded-lg hover:bg-surface-soft transition-colors"
            >
              <Avatar user={user} size="sm" />
              <span className="text-[12.5px] font-[480] text-ink truncate flex-1 text-left">
                {user?.name || 'Account'}
              </span>
              <ChevronDown className="h-[12px] w-[12px] text-ink-muted shrink-0" />
            </button>
          ) : (
            <div className="relative flex justify-center">
              <AnimatePresence>
                {isPopoverOpen && (
                  <UserPopover user={user} logout={logout} onClose={() => setIsPopoverOpen(false)} />
                )}
              </AnimatePresence>
              <button
                onClick={() => setIsPopoverOpen((v) => !v)}
                title={user?.name || 'Account'}
                className="hover:opacity-80 transition-opacity"
              >
                <Avatar user={user} size="sm" />
              </button>
            </div>
          )}
        </div>
      </motion.aside>
    </>
  )
}
