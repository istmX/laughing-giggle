import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BadgeCheck, Loader2, ArrowRight, MapPin, Link as LinkIcon, 
  Calendar, Share2, Flag, UserPlus, Star, GitFork, 
  LayoutTemplate, TrendingUp, Download, Eye, Award, X
} from 'lucide-react'
import { getBaseUrl } from '@/features/auth/api/auth.api'
import toast from 'react-hot-toast'

import { useAuth } from '@/features/auth/hooks/useAuth'

const getBadgeStyles = (badgeName) => {
  const name = badgeName.toLowerCase()
  if (name.includes('founder') || name.includes('legend')) {
    return 'bg-brand-indigo/10 border-brand-indigo/20 text-brand-indigo'
  }
  if (name.includes('pro') || name.includes('elite')) {
    return 'bg-teal/10 border-teal/20 text-teal'
  }
  return 'bg-surface-soft border-hairline text-ink'
}

const getBadgeIcon = (badgeName) => {
  const name = badgeName.toLowerCase()
  if (name.includes('founder')) return <Award className="w-3.5 h-3.5" />
  return <Star className="w-3.5 h-3.5" />
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { ease: [0.16, 1, 0.3, 1], duration: 0.5 } }
}

export const PublicProfile = () => {
  const { username } = useParams()
  const { token, user: currentUser } = useAuth()
  const [data, setData] = useState(null)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('featured') // featured, newest, popular
  const [isFollowing, setIsFollowing] = useState(false)
  const [followerCount, setFollowerCount] = useState(0)
  const [followModal, setFollowModal] = useState({ isOpen: false, type: 'followers' })

  useEffect(() => {
    // Apply user's selected theme globally when viewing public profiles
    const activeTheme = localStorage.getItem('zenix-theme') || 'system'
    const root = window.document.documentElement
    root.classList.remove('dark', 'theme-midnight', 'theme-emerald', 'theme-sunset')
    
    if (activeTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      if (systemTheme === 'dark') root.classList.add('dark')
    } else if (activeTheme !== 'light') {
      root.classList.add(activeTheme)
    }
  }, [])

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${getBaseUrl()}/profile/u/${username}`)
        if (!res.ok) {
           const err = await res.json()
           throw new Error(err.message || 'Failed to load profile')
        }
        const json = await res.json()
        setData(json)
        setFollowerCount(json.stats?.followers || 0)
        
        if (currentUser && currentUser.following?.includes(json.user._id)) {
          setIsFollowing(true)
        }
        
        setStatus('success')
      } catch (err) {
        setError(err.message)
        setStatus('error')
      }
    }
    fetchProfile()
  }, [username, currentUser])

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-ink-muted" />
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-destructive text-body-lg font-[480]">
        <p>{error}</p>
      </div>
    )
  }

  const { user, stats, templates } = data
  const avatarUrl = user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.username)}`

  // Sort/Filter templates
  let displayTemplates = [...(templates || [])]
  if (activeTab === 'popular') {
    displayTemplates.sort((a, b) => (b.stars || 0) - (a.stars || 0))
  } else if (activeTab === 'newest') {
    displayTemplates.sort((a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now()))
  } else {
    displayTemplates = displayTemplates.slice(0, 4)
  }

  const copyProfileLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/u/${user.username}`)
    toast.success('Profile link copied to clipboard')
  }

  const handleFollow = async () => {
    if (!token) {
      toast.error('You must be logged in to follow users');
      return;
    }
    try {
      const res = await fetch(`${getBaseUrl()}/profile/follow/${user.username}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to follow user');
      const data = await res.json();
      setIsFollowing(data.isFollowing);
      setFollowerCount(prev => data.isFollowing ? prev + 1 : prev - 1);
      toast.success(data.isFollowing ? `You are now following ${user.username}` : `Unfollowed ${user.username}`);
    } catch (err) {
      toast.error('Something went wrong');
    }
  }

  const handleReport = () => toast.success(`Profile reported`)

  return (
    <div className="min-h-screen bg-background pb-24">
      
      {/* Hero Banner Area */}
      <div className="h-48 md:h-64 bg-gradient-to-br from-surface-soft via-background to-primary/5 border-b border-hairline relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,0,0,0.03),transparent)]" />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto px-6 md:px-10 -mt-20 md:-mt-24 relative z-10 space-y-12"
      >
        
        {/* 1. Identity & Actions */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-8 items-start md:items-end justify-between">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-end">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-canvas border-[4px] border-background shadow-sm overflow-hidden shrink-0">
              <img src={avatarUrl} alt={user.name} className="w-full h-full object-cover" />
            </div>
            
            <div className="pb-2">
              <h1 className="text-display-lg font-[540] tracking-display-lg text-ink flex items-center gap-3 mb-1">
                {user.name}
                {user.isVerified && <BadgeCheck className="w-7 h-7 text-primary fill-primary/10" strokeWidth={1.5} />}
              </h1>
              <p className="text-body-lg font-[480] text-ink-muted">@{user.username}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto pb-2">
            {currentUser?.username !== user.username && (
              <button 
                onClick={handleFollow}
                className={`flex-1 md:flex-none text-button font-[480] px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity flex items-center justify-center gap-2 ${isFollowing ? 'bg-surface-soft border border-hairline text-ink' : 'bg-primary text-primary-foreground'}`}
              >
                <UserPlus className="w-4 h-4" /> {isFollowing ? 'Following' : 'Follow'}
              </button>
            )}
            <button 
              onClick={copyProfileLink}
              className="p-2.5 rounded-full border border-hairline bg-canvas text-ink hover:bg-surface-soft transition-colors shadow-sm"
              title="Share Profile"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button 
              onClick={handleReport}
              className="p-2.5 rounded-full border border-hairline bg-canvas text-ink hover:bg-surface-soft transition-colors shadow-sm"
              title="Report Profile"
            >
              <Flag className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* 2. Bio, Meta & Badges */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            {user.bio ? (
              <p className="text-body-lg font-[340] text-ink/90 leading-relaxed max-w-3xl">
                {user.bio}
              </p>
            ) : (
              <p className="text-body-lg font-[340] text-ink-muted italic max-w-3xl">
                This creator hasn't written a bio yet.
              </p>
            )}

            <div className="flex flex-wrap items-center gap-6 text-body-sm font-[480] text-ink-muted">
              {user.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> {user.location}
                </div>
              )}
              {user.personalLink && (
                <div className="flex items-center gap-2">
                  <LinkIcon className="w-4 h-4" /> 
                  <a href={user.personalLink} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                    {user.personalLink.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Joined {new Date(user.joinedAt || Date.now()).getFullYear()}
              </div>
            </div>

            {/* Collectible Badges */}
            {user.loyaltyBadges && user.loyaltyBadges.length > 0 && (
              <div className="pt-6 border-t border-hairline/50">
                <h3 className="text-caption font-mono uppercase tracking-caption text-ink-muted mb-4">Achievements</h3>
                <div className="flex flex-wrap items-center gap-3">
                  {user.loyaltyBadges.map((badge, idx) => {
                    const style = getBadgeStyles(badge)
                    const icon = getBadgeIcon(badge)
                    return (
                      <div 
                        key={idx} 
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-caption font-[500] tracking-wide uppercase transition-transform hover:scale-[1.05] cursor-default ${style}`}
                        title={`Achievement unlocked: ${badge}`}
                      >
                        {icon} {badge}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 3. Key Stats */}
          <div className="lg:col-span-1">
            <div className="bg-canvas border border-hairline rounded-2xl p-6 shadow-sm">
              <h3 className="text-caption font-mono uppercase tracking-caption text-ink-muted mb-6">Creator Impact</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    className="bg-surface-soft border border-hairline rounded-xl p-4 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setFollowModal({ isOpen: true, type: 'followers' })}
                  >
                    <div className="text-body-sm font-[480] text-ink-muted mb-1">Followers</div>
                    <div className="text-headline font-[540] text-ink">{followerCount}</div>
                  </div>
                  <div 
                    className="bg-surface-soft border border-hairline rounded-xl p-4 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setFollowModal({ isOpen: true, type: 'following' })}
                  >
                    <div className="text-body-sm font-[480] text-ink-muted mb-1">Following</div>
                    <div className="text-headline font-[540] text-ink">{stats?.following || 0}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-soft border border-hairline flex items-center justify-center">
                      <LayoutTemplate className="w-5 h-5 text-ink" />
                    </div>
                    <span className="text-body font-[480] text-ink-muted">Templates</span>
                  </div>
                  <span className="text-body-lg font-[540] text-ink">{stats?.templates || 0}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-soft border border-hairline flex items-center justify-center">
                      <Star className="w-5 h-5 text-ink" />
                    </div>
                    <span className="text-body font-[480] text-ink-muted">Total Stars</span>
                  </div>
                  <span className="text-body-lg font-[540] text-ink">{stats?.stars || 0}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-soft border border-hairline flex items-center justify-center">
                      <Download className="w-5 h-5 text-ink" />
                    </div>
                    <span className="text-body font-[480] text-ink-muted">Downloads</span>
                  </div>
                  <span className="text-body-lg font-[540] text-ink">{stats?.downloads || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 4. Portfolio / Templates */}
        <motion.div variants={itemVariants} className="pt-12 border-t border-hairline">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <h2 className="text-headline font-[540] tracking-headline text-ink flex items-center gap-2">
              <LayoutTemplate className="w-6 h-6 text-ink-muted" /> Template Portfolio
            </h2>
            
            {/* Sorting Tabs */}
            <div className="flex p-1 bg-surface-soft border border-hairline rounded-full inline-flex w-max">
              {['featured', 'newest', 'popular'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-1.5 rounded-full text-caption font-[480] capitalize transition-all ${activeTab === tab ? 'bg-canvas text-ink shadow-sm' : 'text-ink-muted hover:text-ink hover:bg-canvas/50'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {displayTemplates.length === 0 ? (
              <div className="col-span-1 md:col-span-2 bg-canvas border border-dashed border-hairline rounded-3xl p-16 flex flex-col items-center justify-center text-center w-full shadow-sm">
                <div className="w-20 h-20 rounded-full bg-surface-soft border border-hairline flex items-center justify-center mb-6">
                  <LayoutTemplate className="w-10 h-10 text-ink-muted" />
                </div>
                <h3 className="text-headline font-[540] text-ink mb-3">No Templates Found</h3>
                <p className="text-body font-[340] text-ink-muted max-w-[400px] w-full mx-auto leading-relaxed">
                  {user.name} hasn't published any templates in this category yet. Check back later!
                </p>
              </div>
            ) : (
              displayTemplates.map((template, idx) => (
                <div key={template.id || idx} className="bg-canvas border border-hairline rounded-[24px] p-2 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
                  <div className="w-full aspect-[4/3] bg-surface-soft rounded-[20px] overflow-hidden border border-hairline relative">
                    <iframe 
                      srcDoc={`
                        <html>
                          <head>
                            <style>
                              body { font-family: system-ui; background: transparent; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; color: inherit; }
                              .card { background: var(--canvas, white); padding: 2.5rem; border-radius: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.04); text-align: center; border: 1px solid var(--border, #eaeaea); color: var(--ink, #111); }
                              h1 { margin-top: 0; font-size: 1.75rem; font-weight: 600; }
                              button { background: var(--ink, #111); color: var(--background, white); border: none; padding: 0.75rem 1.5rem; border-radius: 99px; font-weight: 500; cursor: pointer; margin-top: 1rem; }
                            </style>
                          </head>
                          <body>
                            <div class="card">
                              <h1>${template.name}</h1>
                              <p style="opacity: 0.7; font-size: 15px;">Preview rendering active...</p>
                              <button>Get Started</button>
                            </div>
                          </body>
                        </html>
                      `}
                      title={template.name}
                      className="w-full h-full border-none pointer-events-none"
                      loading="lazy"
                    />
                    
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-canvas/90 backdrop-blur-md border border-hairline text-ink px-3 py-1.5 rounded-full text-caption font-[480] flex items-center gap-1.5 shadow-sm">
                        <Eye className="w-3.5 h-3.5 text-ink-muted" /> Preview
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-5 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-body-lg font-[540] text-ink group-hover:text-primary transition-colors">{template.name}</h3>
                      <div className="flex items-center gap-4 text-caption font-mono text-ink-muted">
                        <span className="flex items-center gap-1.5"><Star className="w-4 h-4 text-ink-muted" /> {template.stars || 0}</span>
                        <span className="flex items-center gap-1.5"><GitFork className="w-4 h-4 text-ink-muted" /> {template.forks || 0}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-hairline pt-4 mt-auto">
                      <div className="flex items-center gap-2">
                         {template.tags?.slice(0,2).map(tag => (
                           <span key={tag} className="text-[11px] font-[480] text-ink-muted bg-surface-soft px-2 py-0.5 rounded-md border border-hairline">
                             {tag}
                           </span>
                         ))}
                      </div>
                      <div className="w-8 h-8 rounded-full bg-canvas border border-hairline flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 cursor-pointer hover:bg-surface-soft">
                        <ArrowRight className="w-4 h-4 text-primary" />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
        
      </motion.div>
      {followModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={() => setFollowModal({ isOpen: false, type: 'followers' })}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative bg-background border border-hairline rounded-[24px] shadow-lg w-full max-w-[400px] overflow-hidden flex flex-col mx-auto h-[500px]"
          >
            <div className="flex items-center justify-between p-6 border-b border-hairline">
              <h2 className="text-headline font-[540] text-ink capitalize">{followModal.type}</h2>
              <button onClick={() => setFollowModal({ isOpen: false, type: 'followers' })} className="p-2 -mr-2 text-ink-muted hover:text-ink rounded-full hover:bg-surface-soft transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            {(!user[followModal.type] || user[followModal.type].length === 0) ? (
              <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-surface-soft border border-hairline flex items-center justify-center mb-4">
                  <UserPlus className="w-8 h-8 text-ink-muted" />
                </div>
                <h3 className="text-body-lg font-[540] text-ink mb-2">No {followModal.type} yet</h3>
                <p className="text-body-sm font-[340] text-ink-muted max-w-[250px] mx-auto">
                  {followModal.type === 'followers' 
                    ? `When people start following ${user.name}, they will appear here.`
                    : `${user.name} isn't following anyone yet.`}
                </p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
                {user[followModal.type].map(member => (
                  <a 
                    key={member._id} 
                    href={`/u/${member.username}`}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-soft transition-colors border border-transparent hover:border-hairline"
                  >
                    <div className="relative">
                      {member.avatar ? (
                        <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-full border border-hairline object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full border border-hairline bg-surface-soft flex items-center justify-center">
                          <UserPlus className="w-4 h-4 text-ink-muted" />
                        </div>
                      )}
                      {member.lastActiveAt && (Date.now() - new Date(member.lastActiveAt).getTime() < 5 * 60 * 1000) && (
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-canvas rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col text-left">
                      <span className="text-body-sm font-[540] text-ink truncate">{member.name}</span>
                      <span className="text-caption font-[480] text-ink-muted truncate">@{member.username}</span>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  )
}
