import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Mail, Calendar, Shield, Trash2, KeyRound, ArrowRight, BadgeCheck, Share2, 
  MapPin, Link as LinkIcon, Camera, GitFork, Star, Eye, Clock,
  Box, Lock, CheckCircle2, AlertCircle, Award, UserPlus, X, Palette, Monitor, Moon, Sun
} from 'lucide-react'
import toast from 'react-hot-toast'
import { ProfileEditModal } from './ProfileEditModal'
import { AvatarPickerModal } from './AvatarPickerModal'

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

const THEMES = [
  { id: 'system', name: 'System', icon: Monitor },
  { id: 'light', name: 'Light', icon: Sun },
  { id: 'dark', name: 'Dark', icon: Moon },
  { id: 'theme-midnight', name: 'Midnight', icon: Moon },
  { id: 'theme-emerald', name: 'Emerald', icon: Moon },
  { id: 'theme-sunset', name: 'Sunset', icon: Moon }
]

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

export const ProfileDetails = ({ profile, updatePfp, deleteAccount, updateProfile }) => {
  const [overrideAvatar, setOverrideAvatar] = useState(false)
  const [seedSuffix, setSeedSuffix] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)
  const [isPublic, setIsPublic] = useState(profile?.isPublic ?? true)
  const [followModal, setFollowModal] = useState({ isOpen: false, type: 'followers' })
  
  const [activeTheme, setActiveTheme] = useState(() => localStorage.getItem('zenix-theme') || 'system')

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('dark', 'theme-midnight', 'theme-emerald', 'theme-sunset')
    
    if (activeTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      if (systemTheme === 'dark') root.classList.add('dark')
    } else if (activeTheme !== 'light') {
      root.classList.add(activeTheme)
    }
    localStorage.setItem('zenix-theme', activeTheme)
  }, [activeTheme])

  if (!profile) return null

  const baseAvatar = profile.pfpUrl || profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profile.username)}`
  const displayAvatar = overrideAvatar 
    ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(profile.username + seedSuffix)}`
    : baseAvatar

  const handleSaveAvatar = async (dataUri) => {
    try {
      await updatePfp(dataUri)
      setOverrideAvatar(true)
      setSeedSuffix(Math.random().toString())
      setIsAvatarModalOpen(false)
    } catch (err) {
      console.error('Failed to save avatar', err)
    }
  }

  const handleDeleteAccount = async () => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-body-sm font-[500] text-ink w-full max-w-[60ch] block">Are you sure you want to permanently delete your account? This action cannot be undone.</p>
        <div className="flex justify-end gap-2">
          <button 
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 text-button font-[480] text-ink-muted hover:text-ink transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={async () => {
              toast.dismiss(t.id);
              setIsDeleting(true)
              try {
                await deleteAccount()
                window.location.href = '/'
              } catch (err) {
                console.error('Failed to delete account', err)
                setIsDeleting(false)
              }
            }}
            className="px-4 py-2 bg-destructive text-destructive-foreground text-button font-[480] rounded-lg hover:opacity-90 transition-opacity"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    ), { duration: Infinity, style: { minWidth: '350px' } });
  }

  const handleSaveProfile = async (data) => {
    try {
      await updateProfile(data)
    } catch (err) {
      console.error('Failed to update profile', err)
      throw err
    }
  }

  const togglePublic = async () => {
    const newValue = !isPublic
    setIsPublic(newValue)
    try {
      await updateProfile({ isPublic: newValue })
      toast.success(newValue ? 'Profile is now public' : 'Profile is now private')
    } catch (err) {
      setIsPublic(!newValue)
      toast.error('Failed to update privacy settings')
    }
  }

  const copyProfileLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/u/${profile.username}`)
    toast.success('Profile link copied to clipboard')
  }

  const templates = []

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto space-y-12 pb-24"
    >
      {/* 1. Hero Identity Section */}
      <motion.div variants={itemVariants} className="bg-surface-soft border border-hairline rounded-2xl overflow-hidden relative shadow-sm">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-primary/5 via-background to-primary/10 border-b border-hairline" />
        
        <div className="relative pt-16 px-8 pb-8 md:px-12 md:pb-12 flex flex-col md:flex-row gap-8 items-start">
          <div className="relative group shrink-0">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-canvas border-[4px] border-surface-soft shadow-sm overflow-hidden relative">
              <img src={displayAvatar} alt={profile.name} className="w-full h-full object-cover" />
              <button 
                onClick={() => setIsAvatarModalOpen(true)}
                className="absolute inset-0 bg-ink/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                <Camera className="w-8 h-8 text-canvas mb-2" />
                <span className="text-caption font-[480] text-canvas">Update</span>
              </button>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-teal border-[4px] border-surface-soft w-8 h-8 rounded-full shadow-sm" title="Online" />
          </div>

          <div className="flex-1 w-full">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div>
                <h1 className="text-display-lg font-[540] tracking-display-lg text-ink flex items-center gap-3 mb-1">
                  {profile.name}
                  {profile.isVerified && <BadgeCheck className="w-7 h-7 text-primary fill-primary/10" strokeWidth={1.5} />}
                </h1>
                <p className="text-body-lg font-[480] text-ink-muted mb-4 w-full max-w-[60ch] block">@{profile.username}</p>
                
                {profile.bio ? (
                  <p className="text-body font-[340] text-ink/90 mb-6 leading-relaxed w-full max-w-[60ch] block">
                    {profile.bio}
                  </p>
                ) : (
                  <p className="text-body font-[340] text-ink-muted italic mb-6 w-full max-w-[60ch] block">
                    No bio added yet. Add one in Edit Profile.
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-body-sm font-[480] text-ink-muted">
                  {profile.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" /> {profile.location}
                    </div>
                  )}
                  {profile.personalLink && (
                    <div className="flex items-center gap-1.5">
                      <LinkIcon className="w-4 h-4" /> 
                      <a href={profile.personalLink} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                        {profile.personalLink.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Joined {new Date(profile.joinedAt || Date.now()).getFullYear()}</div>
                </div>

                {profile.loyaltyBadges && profile.loyaltyBadges.length > 0 && (
                  <div className="mt-6 flex flex-wrap items-center gap-2">
                    {profile.loyaltyBadges.map((badge, idx) => {
                      const style = getBadgeStyles(badge)
                      const icon = getBadgeIcon(badge)
                      return (
                        <div 
                          key={idx} 
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-caption font-[500] tracking-wide uppercase transition-transform hover:scale-[1.05] cursor-default ${style}`}
                          title={`Achievement unlocked: ${badge}`}
                        >
                          {icon} {badge}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button 
                  onClick={copyProfileLink}
                  className="p-2.5 rounded-full border border-hairline bg-canvas text-ink hover:bg-surface-soft transition-colors shadow-sm"
                  title="Share Profile"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setIsEditModalOpen(true)}
                  className="bg-primary text-primary-foreground text-button font-[480] px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity shadow-sm"
                >
                  Edit Profile
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-hairline/60">
              <div key="Templates">
                <div className="text-headline font-[540] text-ink">0</div>
                <div className="text-caption font-mono uppercase tracking-caption text-ink-muted">Templates</div>
              </div>
              <div 
                key="Followers" 
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setFollowModal({ isOpen: true, type: 'followers' })}
              >
                <div className="text-headline font-[540] text-ink">{profile.followersCount || '0'}</div>
                <div className="text-caption font-mono uppercase tracking-caption text-ink-muted">Followers</div>
              </div>
              <div 
                key="Following" 
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setFollowModal({ isOpen: true, type: 'following' })}
              >
                <div className="text-headline font-[540] text-ink">{profile.followingCount || '0'}</div>
                <div className="text-caption font-mono uppercase tracking-caption text-ink-muted">Following</div>
              </div>
              <div key="Generations">
                <div className="text-headline font-[540] text-ink">0</div>
                <div className="text-caption font-mono uppercase tracking-caption text-ink-muted">Generations</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* 2. Account & Usage (Left Column) */}
        <motion.div variants={itemVariants} className="lg:col-span-1 space-y-8">
          <div className="bg-canvas border border-hairline rounded-2xl p-6 shadow-sm">
            <h2 className="text-body-lg font-[540] tracking-body text-ink mb-6 flex items-center gap-2">
              <Mail className="w-5 h-5 text-ink-muted" /> Account Overview
            </h2>
            <div className="space-y-6">
              <div>
                <p className="text-caption font-mono uppercase tracking-caption text-ink-muted mb-1 w-full max-w-[60ch] block">Email</p>
                <p className="text-body-sm font-[480] text-ink w-full max-w-[60ch] block">{profile.email}</p>
              </div>
            </div>
          </div>

          <div className="bg-canvas border border-hairline rounded-2xl p-6 shadow-sm">
            <h2 className="text-body-lg font-[540] tracking-body text-ink mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-ink-muted" /> Identity Provider
            </h2>
            <div className="flex items-center justify-between p-4 bg-surface-soft rounded-xl border border-hairline">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-canvas border border-hairline flex items-center justify-center">
                  <KeyRound className="w-5 h-5 text-ink" />
                </div>
                <div>
                  <p className="text-body-sm font-[540] text-ink capitalize w-full max-w-[60ch] block">{profile.provider || 'Password'}</p>
                  <p className="text-caption font-[480] text-ink-muted w-full max-w-[60ch] block">Primary login method</p>
                </div>
              </div>
              <CheckCircle2 className="w-5 h-5 text-primary" />
            </div>
          </div>
        </motion.div>

        {/* 3. Security, Preferences & Visibility (Right Column) */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-8">
          <div className="bg-canvas border border-hairline rounded-2xl p-6 shadow-sm">
            <h2 className="text-body-lg font-[540] tracking-body text-ink mb-2">Preferences & Security</h2>
            <p className="text-body-sm font-[340] text-ink-muted mb-6 w-full max-w-[60ch] block">Manage your app experience and profile visibility.</p>
            
            <div className="space-y-1">
              <div className="flex items-center justify-between p-4 rounded-xl hover:bg-surface-soft transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-surface-soft border border-hairline flex items-center justify-center group-hover:bg-canvas transition-colors">
                    <Palette className="w-5 h-5 text-ink" />
                  </div>
                  <div>
                    <span className="block text-body font-[480] text-ink">Theme</span>
                    <span className="block text-body-sm font-[340] text-ink-muted">Personalize your app aesthetic</span>
                  </div>
                </div>
                <div className="flex gap-2 bg-surface-soft p-1 rounded-full border border-hairline">
                  {THEMES.map(theme => {
                    const Icon = theme.icon
                    const isActive = activeTheme === theme.id
                    return (
                      <button
                        key={theme.id}
                        onClick={() => setActiveTheme(theme.id)}
                        title={theme.name}
                        className={`p-1.5 rounded-full transition-all duration-200 ${isActive ? 'bg-canvas shadow-sm text-ink' : 'text-ink-muted hover:text-ink hover:bg-canvas/50'}`}
                      >
                        <Icon className="w-4 h-4" />
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl hover:bg-surface-soft transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-surface-soft border border-hairline flex items-center justify-center group-hover:bg-canvas transition-colors">
                    <Lock className="w-5 h-5 text-ink" />
                  </div>
                  <div>
                    <span className="block text-body font-[480] text-ink">Authentication</span>
                    <span className="block text-body-sm font-[340] text-ink-muted">Managed via {profile.provider || 'Firebase'}</span>
                  </div>
                </div>
                <button className="text-button font-[480] text-ink-muted px-4 py-1.5 rounded-full" disabled>Managed</button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl hover:bg-surface-soft transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-surface-soft border border-hairline flex items-center justify-center group-hover:bg-canvas transition-colors">
                    <Eye className="w-5 h-5 text-ink" />
                  </div>
                  <div>
                    <span className="block text-body font-[480] text-ink">Public Profile</span>
                    <span className="block text-body-sm font-[340] text-ink-muted">Allow your profile to appear in Explore</span>
                  </div>
                </div>
                <button 
                  onClick={togglePublic}
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center ${isPublic ? 'bg-primary' : 'bg-ink-muted/50'}`}
                >
                  <motion.div 
                    layout
                    className="w-5 h-5 bg-canvas rounded-full shadow-sm mx-[2px]"
                    animate={{ x: isPublic ? 20 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 4. Templates & Projects (Full Width) */}
      <motion.div variants={itemVariants} className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-headline font-[540] tracking-headline text-ink">My Templates</h2>
            <p className="text-body-sm font-[340] text-ink-muted mt-1 w-full max-w-[60ch] block">Reusable architectures and design systems you've created.</p>
          </div>
          <button className="bg-canvas border border-hairline text-ink rounded-full px-5 py-2.5 text-button font-[480] hover:bg-surface-soft shadow-sm transition-colors">
            Create Template
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {templates.length === 0 ? (
            <div className="col-span-1 md:col-span-2 bg-canvas border border-dashed border-hairline rounded-2xl p-12 flex flex-col items-center justify-center text-center w-full">
              <div className="w-16 h-16 rounded-full bg-surface-soft border border-hairline flex items-center justify-center mb-4">
                <Box className="w-8 h-8 text-ink-muted" />
              </div>
              <h3 className="text-body-lg font-[540] text-ink mb-2">No Templates Yet</h3>
              <p className="text-body-sm font-[340] text-ink-muted max-w-[400px] w-full mb-6 mx-auto leading-relaxed max-w-[60ch] block">
                You haven't created any templates. Start building reusable layouts and architectures.
              </p>
              <button className="bg-primary text-primary-foreground text-button font-[480] px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity shadow-sm">
                Create First Template
              </button>
            </div>
          ) : null}
        </div>
      </motion.div>

      {/* 5. Destructive Actions */}
      <motion.div variants={itemVariants} className="pt-12">
        <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 w-full shadow-sm">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5 text-destructive" />
            </div>
            <div className="flex-1 w-full">
              <h2 className="text-body-lg font-[540] text-destructive mb-1">Delete Account</h2>
              <p className="text-body-sm font-[340] text-ink-muted w-full max-w-[600px] leading-relaxed max-w-[60ch] block">
                Permanently delete your account, projects, templates, and all associated data. This action cannot be undone.
              </p>
            </div>
          </div>
          <button 
            onClick={handleDeleteAccount}
            disabled={isDeleting}
            className="shrink-0 bg-destructive hover:bg-destructive/90 text-destructive-foreground text-button font-[500] px-6 py-3 rounded-full transition-colors disabled:opacity-50 shadow-sm"
          >
            {isDeleting ? 'Deleting...' : 'Delete Account'}
          </button>
        </div>
      </motion.div>

      <ProfileEditModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        profile={profile} 
        onSave={handleSaveProfile} 
      />
      <AvatarPickerModal 
        isOpen={isAvatarModalOpen} 
        onClose={() => setIsAvatarModalOpen(false)} 
        currentUsername={profile.username}
        onSave={handleSaveAvatar} 
      />

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
            <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-surface-soft border border-hairline flex items-center justify-center mb-4">
                <UserPlus className="w-8 h-8 text-ink-muted" />
              </div>
              <h3 className="text-body-lg font-[540] text-ink mb-2">No {followModal.type} yet</h3>
              <p className="text-body-sm font-[340] text-ink-muted max-w-[250px] mx-auto w-full max-w-[60ch] block">
                When people start following you, they will appear here.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}
