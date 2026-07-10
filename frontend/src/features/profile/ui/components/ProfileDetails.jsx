import { useState } from 'react'
import { motion } from 'framer-motion'
import { UserCircle, Mail, Calendar, Shield, FileText, Trash2, ChevronRight, KeyRound, ArrowRight } from 'lucide-react'

export const ProfileDetails = ({ profile }) => {
  const [overrideAvatar, setOverrideAvatar] = useState(false)
  const [seedSuffix, setSeedSuffix] = useState('')

  if (!profile) return null

  const displayAvatar = (profile.avatar && !overrideAvatar)
    ? profile.avatar
    : `https://api.dicebear.com/10.x/pixel-art/svg?seed=${encodeURIComponent(profile.username + seedSuffix)}`

  const handleRandomizeAvatar = () => {
    setOverrideAvatar(true)
    setSeedSuffix(Math.random().toString(36).substring(7))
  }

  return (
    <div className="max-w-5xl mx-auto space-y-24 pb-24">
      {/* Hero Profile Block (Lilac) */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
        className="bg-surface-soft rounded-[32px] p-12 md:p-16 flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12"
      >
        <div className="bg-background rounded-full p-2 shrink-0 shadow-sm border border-hairline overflow-hidden">
          <img 
            src={displayAvatar} 
            alt={profile.name} 
            className="h-32 w-32 rounded-full object-cover bg-surface-soft" 
          />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-display-lg font-340 tracking-display-lg text-ink mb-2">
            {profile.name}
          </h1>
          <p className="text-subhead font-340 text-ink/80 tracking-subhead mb-10">
            @{profile.username}
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <button className="bg-primary text-primary-foreground text-button font-480 px-6 py-3 rounded-full hover:scale-105 transition-transform">
              Edit profile
            </button>
            <button 
              onClick={handleRandomizeAvatar}
              className="bg-background text-foreground text-button font-480 px-6 py-3 rounded-full hover:scale-105 transition-transform shadow-sm"
            >
              Change avatar
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-16 lg:gap-24">
        {/* Left Column: Details */}
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="space-y-8"
        >
          <h2 className="text-headline font-540 tracking-headline text-ink mb-8">Account Details</h2>
          
          <div className="flex flex-col">
            <div className="flex items-center justify-between py-6 border-b border-hairline group">
              <div className="flex items-center gap-5">
                <Mail className="h-6 w-6 text-ink-muted" strokeWidth={1.5} />
                <div>
                  <p className="text-caption font-mono uppercase tracking-caption text-ink-muted mb-2">Email Address</p>
                  <p className="text-body font-320 text-ink tracking-body">{profile.email}</p>
                </div>
              </div>
              <button className="text-button font-480 text-ink underline decoration-ink/30 hover:decoration-ink transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                Change
              </button>
            </div>

            <div className="flex items-center justify-between py-6 border-b border-hairline">
              <div className="flex items-center gap-5">
                <KeyRound className="h-6 w-6 text-ink-muted" strokeWidth={1.5} />
                <div>
                  <p className="text-caption font-mono uppercase tracking-caption text-ink-muted mb-2">Connected Account</p>
                  <p className="text-body font-320 text-ink tracking-body capitalize">
                    {profile.provider === 'google' ? 'Google Authentication' : 'Email & Password'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between py-6 border-b border-hairline">
              <div className="flex items-center gap-5">
                <Calendar className="h-6 w-6 text-ink-muted" strokeWidth={1.5} />
                <div>
                  <p className="text-caption font-mono uppercase tracking-caption text-ink-muted mb-2">Member Since</p>
                  <p className="text-body font-320 text-ink tracking-body">
                    {new Date(profile.joinedAt).toLocaleDateString(undefined, {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Settings & Privacy */}
        <motion.div 
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="space-y-8"
        >
          <h2 className="text-headline font-540 tracking-headline text-ink mb-8">Security & Privacy</h2>

          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-6 rounded-lg bg-surface-soft hover:bg-hairline-soft transition-colors group">
              <div className="flex items-center gap-4">
                <Shield className="h-6 w-6 text-ink" strokeWidth={1.5} />
                <span className="text-body-lg font-480 text-ink">Privacy Policy</span>
              </div>
              <ChevronRight className="h-5 w-5 text-ink-muted group-hover:text-ink transition-colors" />
            </button>

            <button className="w-full flex items-center justify-between p-6 rounded-lg bg-surface-soft hover:bg-hairline-soft transition-colors group">
              <div className="flex items-center gap-4">
                <FileText className="h-6 w-6 text-ink" strokeWidth={1.5} />
                <span className="text-body-lg font-480 text-ink">Terms of Service</span>
              </div>
              <ChevronRight className="h-5 w-5 text-ink-muted group-hover:text-ink transition-colors" />
            </button>

            {/* Danger Zone Block (Pink) */}
            <div className="pt-8 mt-8 border-t border-hairline">
              <h2 className="text-body font-540 tracking-body text-destructive mb-4">Danger Zone</h2>
              <button className="w-full flex items-center justify-between p-6 rounded-lg bg-destructive/10 hover:bg-destructive/20 transition-colors group border border-destructive/20">
                <div className="flex items-center gap-4">
                  <Trash2 className="h-6 w-6 text-destructive" strokeWidth={1.5} />
                  <div className="text-left">
                    <span className="block text-body-lg font-480 text-destructive">Delete Account</span>
                    <span className="block text-body-sm font-320 text-destructive/80 mt-1">Permanently remove your data</span>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-destructive/40 group-hover:text-destructive group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
