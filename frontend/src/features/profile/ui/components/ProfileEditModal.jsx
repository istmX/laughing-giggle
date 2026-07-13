import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check } from 'lucide-react'
import { useEffect } from 'react'
import toast from 'react-hot-toast'

export const ProfileEditModal = ({ isOpen, onClose, profile, onSave }) => {
  const [editName, setEditName] = useState(profile?.name || '')
  const [editUsername, setEditUsername] = useState(profile?.username || '')
  const [editBio, setEditBio] = useState(profile?.bio || '')
  const [editLocation, setEditLocation] = useState(profile?.location || '')
  const [editPersonalLink, setEditPersonalLink] = useState(profile?.personalLink || '')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave({ 
        name: editName, 
        username: editUsername,
        bio: editBio,
        location: editLocation,
        personalLink: editPersonalLink
      })
      toast.success('Profile updated')
      onClose()
    } catch (err) {
      toast.error('Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative bg-background border border-hairline rounded-[24px] shadow-lg w-full max-w-[600px] mx-auto overflow-hidden max-h-[90vh] flex flex-col"
        >
          <div className="flex items-center justify-between p-6 border-b border-hairline">
            <h2 className="text-headline font-540 text-ink">Edit Profile</h2>
            <button onClick={onClose} className="p-2 -mr-2 text-ink-muted hover:text-ink rounded-full hover:bg-surface-soft transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6 overflow-y-auto">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-caption font-mono uppercase tracking-caption text-ink-muted">Name</label>
                <input 
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-surface-soft border border-hairline rounded-lg px-4 py-3 text-body font-480 text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="Your full name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-caption font-mono uppercase tracking-caption text-ink-muted">Username</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted font-480">@</span>
                  <input 
                    type="text" 
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    className="w-full bg-surface-soft border border-hairline rounded-lg pl-8 pr-4 py-3 text-body font-480 text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="username"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-caption font-mono uppercase tracking-caption text-ink-muted">Bio (Optional)</label>
              <textarea 
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                rows={3}
                className="w-full bg-surface-soft border border-hairline rounded-lg px-4 py-3 text-body font-480 text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-caption font-mono uppercase tracking-caption text-ink-muted">Location (Optional)</label>
                <input 
                  type="text" 
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full bg-surface-soft border border-hairline rounded-lg px-4 py-3 text-body font-480 text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="e.g. San Francisco, CA"
                />
              </div>
              <div className="space-y-2">
                <label className="text-caption font-mono uppercase tracking-caption text-ink-muted">Personal Link (Optional)</label>
                <input 
                  type="url" 
                  value={editPersonalLink}
                  onChange={(e) => setEditPersonalLink(e.target.value)}
                  className="w-full bg-surface-soft border border-hairline rounded-lg px-4 py-3 text-body font-480 text-ink focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-hairline bg-surface-soft flex items-center justify-end gap-3">
            <button 
              onClick={onClose}
              className="text-button font-480 text-ink px-6 py-2.5 rounded-full hover:bg-hairline transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving || !editName || !editUsername}
              className="bg-primary text-primary-foreground text-button font-480 px-8 py-2.5 rounded-full flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : <><Check className="w-4 h-4" /> Save</>}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
