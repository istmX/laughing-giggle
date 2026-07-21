import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  BadgeCheck,
  Compass,
  LayoutTemplate,
  Loader2,
  MapPin,
  RefreshCw,
  Search,
  Users,
  X,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import { useAuth } from '@/features/auth/hooks/useAuth'

import { exploreApi } from '../api/explore.api'

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

const cardColors = ['bg-block-mint', 'bg-block-lilac', 'bg-block-cream', 'bg-block-pink', 'bg-block-coral']

function isOnline(lastActiveAt) {
  if (!lastActiveAt) return false
  const difference = Date.now() - new Date(lastActiveAt).getTime()
  return difference >= 0 && difference < 5 * 60 * 1000
}

function CreatorSkeleton() {
  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] border border-hairline bg-canvas" aria-hidden="true">
      <div className="h-24 animate-pulse bg-surface-soft" />
      <div className="space-y-4 p-5">
        <div className="-mt-12 size-16 animate-pulse rounded-full border-4 border-canvas bg-hairline" />
        <div className="h-5 w-2/3 animate-pulse rounded bg-surface-soft" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-surface-soft" />
        <div className="h-10 animate-pulse rounded bg-surface-soft" />
        <div className="h-px bg-hairline" />
        <div className="h-4 w-full animate-pulse rounded bg-surface-soft" />
      </div>
    </div>
  )
}

function CreatorCard({ user, index }) {
  const avatarUrl = user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.username || user._id)}`
  const templateCount = user.templateCount ?? user.templates?.length ?? 0

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.28, delay: Math.min(index * 0.04, 0.2), ease: [0.16, 1, 0.3, 1] }}
      className="h-full"
    >
      <Link to={`/u/${user.username || user._id}`} className="group block h-full rounded-[var(--radius-lg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30 focus-visible:ring-offset-2">
        <article className="flex h-full min-h-[292px] flex-col overflow-hidden rounded-[var(--radius-lg)] border border-hairline bg-canvas transition-transform duration-200 group-hover:-translate-y-1 group-hover:border-ink/25 group-hover:shadow-[0_8px_0_rgba(31,29,61,0.08)]">
          <div className={`${cardColors[index % cardColors.length]} relative h-24 shrink-0 overflow-hidden p-5`}>
            <div className="absolute -right-7 -top-12 size-36 rounded-full border-[14px] border-ink/10" aria-hidden="true" />
            <div className="absolute bottom-[-3.5rem] right-16 size-20 rotate-12 bg-white/25" aria-hidden="true" />
            <div className="relative flex items-center justify-between">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/45 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ink/65">
                <Compass className="size-3" aria-hidden="true" />
                Creator
              </span>
              {user.isVerified && <BadgeCheck className="size-5 text-ink" aria-label="Verified creator" />}
            </div>
          </div>

          <div className="flex flex-1 flex-col p-5">
            <div className="-mt-12 mb-4 flex items-end justify-between gap-3">
              <div className="relative shrink-0">
                <img src={avatarUrl} alt="" className="size-16 rounded-full border-4 border-canvas bg-surface-soft object-cover" />
                {isOnline(user.lastActiveAt) && (
                  <span className="absolute bottom-0 right-0 size-4 rounded-full border-2 border-canvas bg-semantic-success" title="Online now" aria-label="Online now" />
                )}
              </div>
              <span className="mb-1 text-[12px] font-[var(--font-weight-480)] text-ink-muted transition-colors group-hover:text-ink">View profile <span aria-hidden="true">↗</span></span>
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-[18px] font-[var(--font-weight-540)] tracking-[-0.02em] text-ink">{user.name || user.username || 'Zenix creator'}</h2>
              <p className="mt-0.5 truncate font-mono text-[11px] text-ink-muted">@{user.username || 'creator'}</p>
              {user.location && (
                <div className="mt-2 flex min-w-0 items-center gap-1.5 text-[11px] text-ink-muted">
                  <MapPin className="size-3 shrink-0" aria-hidden="true" />
                  <span className="truncate">{user.location}</span>
                </div>
              )}
            </div>

            <p className="mt-4 line-clamp-2 min-h-10 text-[13px] leading-5 text-ink-muted">
              {user.bio || 'Building thoughtful products and sharing useful context with the community.'}
            </p>

            <div className="mt-auto flex items-center gap-5 border-t border-hairline pt-4 text-[12px] text-ink-muted">
              <span className="inline-flex items-center gap-1.5"><Users className="size-3.5" aria-hidden="true" />{user.followers?.length || user.followersCount || 0} followers</span>
              <span className="inline-flex items-center gap-1.5"><LayoutTemplate className="size-3.5" aria-hidden="true" />{templateCount} templates</span>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  )
}

function EmptyState({ hasQuery, query, onClear }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center overflow-hidden rounded-[var(--radius-lg)] border border-dashed border-hairline bg-surface-soft px-6 py-16 text-center">
      <div className="relative flex size-16 items-center justify-center rounded-full bg-block-mint text-ink">
        <Users className="size-7" strokeWidth={1.5} aria-hidden="true" />
        <span className="absolute -right-1 -top-1 size-4 rounded-full bg-block-coral" aria-hidden="true" />
      </div>
      <h2 className="mt-5 text-[20px] font-[var(--font-weight-540)] tracking-[-0.02em] text-ink">
        {hasQuery ? 'No creators found' : 'The community is getting ready'}
      </h2>
      <p className="mt-2 max-w-[42ch] text-[14px] leading-6 text-ink-muted">
        {hasQuery ? `Nothing matches “${query}”. Try a different name or username.` : 'Public creators will appear here as the Zenix community grows.'}
      </p>
      {hasQuery && (
        <button type="button" onClick={onClear} className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-[13px] font-[var(--font-weight-480)] text-canvas transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30">
          Clear search
        </button>
      )}
    </div>
  )
}

export function CommunityPage() {
  const { user: currentUser } = useAuth()
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState(null)
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    let isCancelled = false
    const trimmedQuery = debouncedQuery.trim()
    const isSearch = Boolean(trimmedQuery)

    const fetchUsers = async () => {
      setError(null)
      if (isSearch) setIsSearching(true)
      else setIsLoading(true)

      try {
        const data = isSearch
          ? await exploreApi.searchUsers(trimmedQuery)
          : await exploreApi.getTopUsers()
        if (!isCancelled) setUsers(data.users || [])
      } catch {
        if (!isCancelled) setError('We could not load creators right now.')
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
          setIsSearching(false)
        }
      }
    }

    fetchUsers()
    return () => { isCancelled = true }
  }, [debouncedQuery, retryKey])

  const visibleUsers = useMemo(() => users.filter((item) => item._id !== currentUser?._id && item.id !== currentUser?.id), [users, currentUser])
  const hasQuery = Boolean(query.trim())
  const isBusy = isLoading || isSearching

  return (
    <div className="h-full min-h-0 w-full overflow-y-auto overflow-x-hidden">
      <div className="mx-auto w-full max-w-7xl px-4 pb-24 pt-4 sm:px-6 md:px-8 md:pt-8">
      <section className="relative overflow-hidden rounded-[var(--radius-lg)] bg-block-mint p-6 sm:p-8" aria-labelledby="community-title">
        <div className="relative z-10 max-w-2xl sm:pr-44">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-ink/65">
            <Users className="size-3.5" aria-hidden="true" />
            Zenix community
          </div>
          <h1 id="community-title" className="mt-4 max-w-[18ch] text-[clamp(2rem,4vw,3.5rem)] font-[var(--font-weight-340)] leading-[1.02] tracking-[-0.04em] text-ink">
            Find your people.
          </h1>
          <p className="mt-3 max-w-[54ch] text-[14px] leading-6 text-ink/70">
            Meet creators who turn rough ideas into thoughtful products, systems, and reusable templates.
          </p>
        </div>
        <div className="relative z-10 mt-6 flex items-center gap-3 sm:absolute sm:bottom-8 sm:right-8 sm:mt-0">
          <div className="text-left sm:text-right">
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink/60">Discover</p>
            <p className="mt-1 text-[22px] font-[var(--font-weight-540)] tracking-[-0.03em] text-ink">Creators</p>
          </div>
        </div>
        <div className="absolute -right-16 -top-20 size-64 rounded-full border-[18px] border-ink/10" aria-hidden="true" />
      </section>

      <section className="mt-8" aria-label="Find creators">
        <div className="relative max-w-2xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search creators by name or username"
            aria-label="Search creators by name or username"
            className="h-12 w-full rounded-full border border-hairline bg-canvas pl-11 pr-12 text-[14px] text-ink outline-none transition-colors placeholder:text-ink-muted focus:border-ink/35 focus:ring-2 focus:ring-ink/10"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} aria-label="Clear creator search" className="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-surface-soft hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30">
              <X className="size-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </section>

      <section className="mt-10" aria-labelledby="creator-list-title">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="creator-list-title" className="text-[22px] font-[var(--font-weight-540)] tracking-[-0.03em] text-ink">{hasQuery ? 'Search results' : 'Creators to explore'}</h2>
            {!isBusy && !error && <p className="mt-1 text-[13px] text-ink-muted">{visibleUsers.length} {visibleUsers.length === 1 ? 'creator' : 'creators'} to discover</p>}
          </div>
          {isBusy && (
            <div className="inline-flex items-center gap-2 text-[12px] text-ink-muted" role="status">
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              {isSearching ? 'Searching' : 'Loading creators'}
            </div>
          )}
        </div>

        {error ? (
          <div className="flex flex-col items-center justify-center rounded-[var(--radius-lg)] border border-hairline bg-block-coral px-6 py-14 text-center">
            <h2 className="text-[20px] font-[var(--font-weight-540)] text-ink">Something went wrong</h2>
            <p className="mt-2 text-[14px] leading-6 text-ink/70">{error}</p>
            <button type="button" onClick={() => setRetryKey((value) => value + 1)} className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-[13px] font-[var(--font-weight-480)] text-canvas transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/30">
              <RefreshCw className="size-4" aria-hidden="true" />
              Try again
            </button>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => <CreatorSkeleton key={index} />)}
          </div>
        ) : visibleUsers.length === 0 ? (
          <EmptyState hasQuery={hasQuery} query={query.trim()} onClear={() => setQuery('')} />
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {visibleUsers.map((user, index) => <CreatorCard key={user._id || user.id} user={user} index={index} />)}
            </AnimatePresence>
          </div>
        )}
      </section>
      </div>
    </div>
  )
}
