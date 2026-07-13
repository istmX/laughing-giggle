import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Users, Star, LayoutTemplate, MapPin, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { exploreApi } from '../api/explore.api'

// Simple debouncer
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debouncedValue
}

export function CommunityPage() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)
  
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    const fetchDefault = async () => {
      setIsLoading(true)
      try {
        const data = await exploreApi.getTopUsers()
        setUsers(data.users || [])
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    const fetchSearch = async (q) => {
      setIsSearching(true)
      try {
        const data = await exploreApi.searchUsers(q)
        setUsers(data.users || [])
      } catch (err) {
        console.error(err)
      } finally {
        setIsSearching(false)
      }
    }

    if (debouncedQuery.trim() === '') {
      fetchDefault()
    } else {
      fetchSearch(debouncedQuery)
    }
  }, [debouncedQuery])

  // Simple helper to determine if user is online (active within last 5 mins)
  const isOnline = (lastActiveAt) => {
    if (!lastActiveAt) return false;
    const diff = Date.now() - new Date(lastActiveAt).getTime();
    return diff < 5 * 60 * 1000;
  }

  return (
    <div className="w-full h-full flex flex-col p-8 max-w-7xl mx-auto">
      <div className="mb-12 text-center max-w-2xl mx-auto">
        <h1 className="text-display-lg font-340 tracking-display-lg text-ink mb-4">Community</h1>
        <p className="text-subhead font-340 text-ink-muted">Discover top creators and templates in the Zenix ecosystem.</p>
        
        <div className="mt-8 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-ink-muted" />
          </div>
          <input
            type="text"
            className="w-full bg-canvas border border-hairline rounded-full py-4 pl-12 pr-6 text-body font-320 text-ink placeholder:text-ink-faint focus:outline-none focus:border-ink/20 focus:ring-4 focus:ring-ink/5 transition-all shadow-sm"
            placeholder="Search by name or username..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-headline font-540 text-ink">
            {query.trim() ? 'Search Results' : 'Trending Creators'}
          </h2>
          {(isLoading || isSearching) && (
            <div className="flex items-center gap-2 text-ink-muted text-body-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Searching...</span>
            </div>
          )}
        </div>

        {!isLoading && users.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center p-16 text-center border border-hairline rounded-lg bg-surface-soft"
          >
            <div className="w-16 h-16 rounded-full bg-canvas border border-hairline flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-ink-muted" />
            </div>
            <h3 className="text-card-title font-700 text-ink mb-2">No creators found</h3>
            <p className="text-body-sm text-ink-muted max-w-sm">
              We couldn't find anyone matching "{query}". Try checking for typos or searching another name.
            </p>
          </motion.div>
        )}

        <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          <AnimatePresence mode="popLayout">
            {users.map((user, i) => (
              <motion.div
                key={user._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
              >
                <Link to={`/u/${user.username || user._id}`} className="block group h-full">
                  <div className="bg-canvas border border-hairline rounded-lg p-6 hover:shadow-md hover:border-ink/20 transition-all h-full flex flex-col">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="relative">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full border border-hairline bg-surface-soft object-cover" />
                        ) : (
                          <div className="w-16 h-16 rounded-full border border-hairline bg-surface-soft flex items-center justify-center">
                            <Users className="w-6 h-6 text-ink-muted" />
                          </div>
                        )}
                        {isOnline(user.lastActiveAt) && (
                          <div className="absolute bottom-0 right-0 w-4 h-4 bg-semantic-success border-2 border-canvas rounded-full shadow-sm" title="Online now" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-body-lg font-540 text-ink truncate group-hover:text-brand-indigo transition-colors">
                          {user.name}
                        </h3>
                        <p className="text-body-sm text-ink-muted truncate">
                          @{user.username || 'user'}
                        </p>
                        {user.location && (
                          <div className="flex items-center gap-1 mt-1 text-[11px] text-ink-muted uppercase tracking-wider font-mono">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">{user.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {user.bio && (
                      <p className="text-body-sm text-ink-soft line-clamp-2 mb-4 flex-1">
                        {user.bio}
                      </p>
                    )}

                    <div className="mt-auto pt-4 border-t border-hairline flex items-center justify-between text-body-sm text-ink-muted">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        <span>{user.followers?.length || 0}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <LayoutTemplate className="w-4 h-4" />
                        <span>0</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
