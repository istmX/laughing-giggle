import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Mail, Calendar, Shield, Trash2, KeyRound, ArrowRight, BadgeCheck, Share2, 
  MapPin, Link as LinkIcon, Camera, GitFork, Star, Eye, HardDrive, Clock,
  Smartphone, Activity, Box, Lock, AppWindow, Cpu, LogOut, CheckCircle2, AlertCircle, Award, UserPlus, X
} from 'lucide-react'
import toast from 'react-hot-toast'
import { ProfileEditModal } from './ProfileEditModal'
import { AvatarPickerModal } from './AvatarPickerModal'

const getBadgeStyles = (badgeName) => {
  const name = badgeName.toLowerCase()
  if (name.includes('founder') || name.includes('legend')) {
    return 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/20 text-amber-600'
  }
  if (name.includes('pro') || name.includes('elite')) {
    return 'bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border-purple-500/20 text-purple-600'
  }
  return 'bg-surface-soft border-hairline text-ink'
}

const getBadgeIcon = (badgeName) => {
  const name = badgeName.toLowerCase()
  if (name.includes('founder')) return <Award className="w-3.5 h-3.5" />
  return <Star className="w-3.5 h-3.5" />
}

export const ProfileDetails = ({ profile, updatePfp, deleteAccount, updateProfile }) => {
  const [overrideAvatar, setOverrideAvatar] = useState(false)
  const [seedSuffix, setSeedSuffix] = useState('')
  const [isUpdatingPfp, setIsUpdatingPfp] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)
  const [isPublic, setIsPublic] = useState(profile?.isPublic ?? true)
  const [followModal, setFollowModal] = useState({ isOpen: false, type: 'followers' })

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
        <p className="text-body-sm font-500 text-ink">Are you sure you want to permanently delete your account? This action cannot be undone.</p>
        <div className="flex justify-end gap-2">
          <button 
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 text-button font-480 text-ink-muted hover:text-ink transition-colors"
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
            className="px-3 py-1.5 bg-red-500 text-white text-button font-480 rounded-md hover:bg-red-600 transition-colors"
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

  // Temporarily empty until real templates are connected
  const templates = []

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24">
      
      {/* 1. Hero Identity Section */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="bg-surface-soft border border-hairline rounded-2xl overflow-hidden relative"
      >
        {/* Subtle background pattern/gradient */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-primary/10 via-background to-primary/5 border-b border-hairline" />
        
        <div className="relative pt-16 px-8 pb-8 md:px-12 md:pb-12 flex flex-col md:flex-row gap-8 items-start">
          {/* Interactive Avatar */}
          <div className="relative group shrink-0">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-canvas border-4 border-surface-soft shadow-sm overflow-hidden relative">
              <img src={displayAvatar} alt={profile.name} className="w-full h-full object-cover" />
              <button 
                onClick={() => setIsAvatarModalOpen(true)}
                className="absolute inset-0 bg-ink/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Camera className="w-8 h-8 text-canvas mb-2" />
                <span className="text-caption font-480 text-canvas">Update</span>
              </button>
            </div>
            {/* Status indicator */}
            <div className="absolute -bottom-2 -right-2 bg-green-500 border-4 border-surface-soft w-8 h-8 rounded-full" title="Online" />
          </div>

          <div className="flex-1 w-full">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div>
                <h1 className="text-display-lg font-540 tracking-display-lg text-ink flex items-center gap-3 mb-1">
                  {profile.name}
                  {profile.isVerified && <BadgeCheck className="w-7 h-7 text-blue-500 fill-blue-500/10" strokeWidth={1.5} />}
                </h1>
                <p className="text-body-lg font-480 text-ink-muted mb-4">@{profile.username}</p>
                
                {profile.bio ? (
                  <p className="text-body font-320 text-ink/90 max-w-2xl mb-6 leading-relaxed">
                    {profile.bio}
                  </p>
                ) : (
                  <p className="text-body font-320 text-ink-muted italic max-w-2xl mb-6">
                    No bio added yet. Add one in Edit Profile.
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-body-sm font-480 text-ink-muted">
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

                {/* Collectible Badges */}
                {profile.loyaltyBadges && profile.loyaltyBadges.length > 0 && (
                  <div className="mt-6 flex flex-wrap items-center gap-2">
                    {profile.loyaltyBadges.map((badge, idx) => {
                      const style = getBadgeStyles(badge)
                      const icon = getBadgeIcon(badge)
                      return (
                        <div 
                          key={idx} 
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-caption font-500 tracking-wide uppercase transition-transform hover:scale-105 cursor-default ${style}`}
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
                  className="bg-primary text-primary-foreground text-button font-480 px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity shadow-sm"
                >
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Metrics Ribbon */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-hairline/60">
              <div key="Templates">
                <div className="text-headline font-540 text-ink">0</div>
                <div className="text-caption font-mono uppercase tracking-caption text-ink-muted">Templates</div>
              </div>
              <div 
                key="Followers" 
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setFollowModal({ isOpen: true, type: 'followers' })}
              >
                <div className="text-headline font-540 text-ink">{profile.followersCount || '0'}</div>
                <div className="text-caption font-mono uppercase tracking-caption text-ink-muted">Followers</div>
              </div>
              <div 
                key="Following" 
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setFollowModal({ isOpen: true, type: 'following' })}
              >
                <div className="text-headline font-540 text-ink">{profile.followingCount || '0'}</div>
                <div className="text-caption font-mono uppercase tracking-caption text-ink-muted">Following</div>
              </div>
              <div key="Generations">
                <div className="text-headline font-540 text-ink">0</div>
                <div className="text-caption font-mono uppercase tracking-caption text-ink-muted">Generations</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* 2. Account & Usage (Left Column) */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="lg:col-span-1 space-y-8"
        >
          {/* Account Card */}
          <div className="bg-canvas border border-hairline rounded-2xl p-6 shadow-sm">
            <h2 className="text-body-lg font-540 tracking-body text-ink mb-6 flex items-center gap-2">
              <Mail className="w-5 h-5 text-ink-muted" /> Account Overview
            </h2>
            <div className="space-y-6">
              <div>
                <p className="text-caption font-mono uppercase tracking-caption text-ink-muted mb-1">Email</p>
                <p className="text-body-sm font-480 text-ink">{profile.email}</p>
              </div>
            </div>
          </div>

          {/* Connected Identity */}
          <div className="bg-canvas border border-hairline rounded-2xl p-6 shadow-sm">
            <h2 className="text-body-lg font-540 tracking-body text-ink mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-ink-muted" /> Identity Provider
            </h2>
            <div className="flex items-center justify-between p-4 bg-surface-soft rounded-xl border border-hairline">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-canvas border border-hairline flex items-center justify-center">
                  <KeyRound className="w-5 h-5 text-ink" />
                </div>
                <div>
                  <p className="text-body-sm font-540 text-ink capitalize">{profile.provider || 'Password'}</p>
                  <p className="text-caption font-480 text-ink-muted">Primary login method</p>
                </div>
              </div>
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
          </div>
        </motion.div>

        {/* 3. Security & Active Sessions (Right Column) */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="lg:col-span-2 space-y-8"
        >
          {/* Security Controls */}
          <div className="bg-canvas border border-hairline rounded-2xl p-6 shadow-sm">
            <h2 className="text-body-lg font-540 tracking-body text-ink mb-2">Security Settings</h2>
            <p className="text-body-sm font-320 text-ink-muted mb-6">Manage your password, 2FA, and profile visibility.</p>
            
            <div className="space-y-1">
              <div className="flex items-center justify-between p-4 rounded-xl hover:bg-surface-soft transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-surface-soft border border-hairline flex items-center justify-center group-hover:bg-canvas transition-colors">
                    <Lock className="w-5 h-5 text-ink" />
                  </div>
                  <div>
                    <span className="block text-body font-480 text-ink">Authentication</span>
                    <span className="block text-body-sm font-320 text-ink-muted">Managed via {profile.provider || 'Firebase'}</span>
                  </div>
                </div>
                <button className="text-button font-480 text-ink-muted px-4 py-1.5 rounded-full" disabled>Managed</button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl hover:bg-surface-soft transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-surface-soft border border-hairline flex items-center justify-center group-hover:bg-canvas transition-colors">
                    <Eye className="w-5 h-5 text-ink" />
                  </div>
                  <div>
                    <span className="block text-body font-480 text-ink">Public Profile</span>
                    <span className="block text-body-sm font-320 text-ink-muted">Allow your profile to appear in Explore</span>
                  </div>
                </div>
                <button 
                  onClick={togglePublic}
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center ${isPublic ? 'bg-primary' : 'bg-ink-muted/50'}`}
                >
                  <motion.div 
                    layout
                    className="w-5 h-5 bg-canvas rounded-full shadow-sm mx-0.5"
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
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-headline font-540 tracking-headline text-ink">My Templates</h2>
            <p className="text-body-sm font-320 text-ink-muted mt-1">Reusable architectures and design systems you've created.</p>
          </div>
          <button className="bg-canvas border border-hairline text-ink rounded-full px-5 py-2.5 text-button font-480 hover:bg-surface-soft shadow-sm transition-colors">
            Create Template
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {templates.length === 0 ? (
            <div className="col-span-1 md:col-span-2 bg-canvas border border-dashed border-hairline rounded-2xl p-12 flex flex-col items-center justify-center text-center w-full">
              <div className="w-16 h-16 rounded-full bg-surface-soft border border-hairline flex items-center justify-center mb-4">
                <Box className="w-8 h-8 text-ink-muted" />
              </div>
              <h3 className="text-body-lg font-540 text-ink mb-2">No Templates Yet</h3>
              <p className="text-body-sm font-320 text-ink-muted max-w-[400px] w-full mb-6 mx-auto">
                You haven't created any templates. Start building reusable layouts and architectures.
              </p>
              <button className="bg-primary text-primary-foreground text-button font-480 px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity">
                Create First Template
              </button>
            </div>
          ) : (
            templates.map((template) => (
              <div key={template.id} className="bg-canvas border border-hairline rounded-2xl p-2 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
                <div className="w-full aspect-[16/9] bg-surface-soft rounded-xl overflow-hidden border border-hairline relative">
                  {/* HTML Preview Embed Placeholder */}
                  <div className="absolute inset-0 w-full h-full @container">
                    <iframe 
                      srcDoc={`
                        <html>
                          <head>
                            <style>
                              body { font-family: system-ui; background: #fafafa; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; color: #111; }
                              .card { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); text-align: center; max-width: 90%; }
                              h1 { margin-top: 0; font-size: 1.5rem; }
                              button { background: #111; color: white; border: none; padding: 0.5rem 1rem; border-radius: 99px; font-weight: 500; cursor: pointer; }
                            </style>
                          </head>
                          <body>
                            <div class="card">
                              <h1>${template.name}</h1>
                              <p style="color: #666; font-size: 14px;">Preview rendering active</p>
                              <button>Get Started</button>
                            </div>
                          </body>
                        </html>
                      `}
                      title={template.name}
                      className="w-full h-full border-none pointer-events-none scale-100 origin-top-left"
                      loading="lazy"
                    />
                  </div>
                  {/* Overlay tags */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border ${template.status === 'Published' ? 'bg-green-500/10 border-green-500/20 text-green-700' : 'bg-ink/10 border-ink/10 text-ink'}`}>
                      {template.status}
                    </span>
                  </div>
                </div>
                <div className="p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-body-lg font-540 text-ink group-hover:text-primary transition-colors">{template.name}</h3>
                      <div className="flex items-center gap-3 text-caption font-mono text-ink-muted">
                        <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5" /> {template.stars}</span>
                        <span className="flex items-center gap-1"><GitFork className="w-3.5 h-3.5" /> {template.forks}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {template.tags.map(tag => (
                        <span key={tag} className="text-caption font-480 text-ink-muted bg-surface-soft px-2 py-0.5 rounded-md border border-hairline">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-hairline">
                    <span className="text-caption font-480 text-ink-muted flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> Updated {template.updated}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-surface-soft border border-hairline flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 cursor-pointer hover:bg-canvas">
                      <ArrowRight className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>

      {/* 5. Destructive Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="pt-12"
      >
        <div className="bg-red-50/50 border border-red-100 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 w-full">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1 w-full">
              <h2 className="text-body-lg font-540 text-red-900 mb-1">Delete Account</h2>
              <p className="text-body-sm font-320 text-red-800/80 w-full max-w-[600px]">
                Permanently delete your account, projects, templates, and all associated data. This action cannot be undone and your username will be released.
              </p>
            </div>
          </div>
          <button 
            onClick={handleDeleteAccount}
            disabled={isDeleting}
            className="shrink-0 bg-red-600 hover:bg-red-700 text-white text-button font-500 px-6 py-3 rounded-full transition-colors disabled:opacity-50 shadow-sm shadow-red-600/20"
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
              <h2 className="text-headline font-540 text-ink capitalize">{followModal.type}</h2>
              <button onClick={() => setFollowModal({ isOpen: false, type: 'followers' })} className="p-2 -mr-2 text-ink-muted hover:text-ink rounded-full hover:bg-surface-soft transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-surface-soft border border-hairline flex items-center justify-center mb-4">
                <UserPlus className="w-8 h-8 text-ink-muted" />
              </div>
              <h3 className="text-body-lg font-540 text-ink mb-2">No {followModal.type} yet</h3>
              <p className="text-body-sm font-320 text-ink-muted max-w-[250px] mx-auto">
                When people start following you, they will appear here.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

function UserCircle(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="10" r="3" />
      <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
    </svg>
  )
}
