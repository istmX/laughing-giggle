import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Shuffle, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { Style, Avatar } from '@dicebear/core'
import * as lorelei from '@dicebear/styles/lorelei.json'
import * as bottts from '@dicebear/styles/bottts.json'
import * as avataaars from '@dicebear/styles/avataaars.json'
import * as thumbs from '@dicebear/styles/thumbs.json'

const STYLES = {
  lorelei: new Style(lorelei.default || lorelei),
  bottts: new Style(bottts.default || bottts),
  avataaars: new Style(avataaars.default || avataaars),
  thumbs: new Style(thumbs.default || thumbs)
}

export const AvatarPickerModal = ({ isOpen, onClose, onSave, currentUsername }) => {
  const [selectedStyle, setSelectedStyle] = useState('lorelei')
  const [seed, setSeed] = useState(currentUsername || 'user')
  
  const currentAvatar = useMemo(() => {
    return new Avatar(STYLES[selectedStyle], {
      seed,
      size: 256
    }).toDataUri()
  }, [selectedStyle, seed])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const randomize = () => {
    setSeed(Math.random().toString(36).substring(7))
  }

  const handleSave = async () => {
    try {
      await onSave(currentAvatar)
      toast.success('Avatar updated')
    } catch (err) {
      toast.error('Failed to update avatar')
    }
  }

  if (!isOpen) return null

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
          className="relative bg-background border border-hairline rounded-[24px] shadow-lg w-full max-w-[500px] overflow-hidden flex flex-col mx-auto"
        >
          <div className="flex items-center justify-between p-6 border-b border-hairline">
            <h2 className="text-headline font-540 text-ink">Choose Avatar</h2>
            <button onClick={onClose} className="p-2 -mr-2 text-ink-muted hover:text-ink rounded-full hover:bg-surface-soft transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-8 flex flex-col items-center">
            <div className="w-48 h-48 rounded-full bg-surface-soft border border-hairline shadow-sm mb-8 overflow-hidden relative group">
              <img src={currentAvatar} alt="Avatar preview" className="w-full h-full object-cover" />
              <button 
                onClick={randomize}
                className="absolute inset-0 bg-ink/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <div className="bg-background text-ink px-4 py-2 rounded-full font-480 text-button flex items-center gap-2 shadow-sm">
                  <Shuffle className="w-4 h-4" /> Randomize
                </div>
              </button>
            </div>

            <div className="w-full space-y-4">
              <h3 className="text-caption font-mono uppercase tracking-caption text-ink-muted">Style</h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.keys(STYLES).map(style => (
                  <button
                    key={style}
                    onClick={() => setSelectedStyle(style)}
                    className={`px-4 py-3 rounded-lg border font-480 text-body-sm transition-all ${selectedStyle === style ? 'border-primary bg-primary/5 text-primary' : 'border-hairline bg-surface-soft text-ink hover:border-ink/20'}`}
                  >
                    <span className="capitalize">{style}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-hairline bg-surface-soft flex items-center justify-between">
            <button 
              onClick={randomize}
              className="text-button font-480 text-ink px-4 py-2 hover:bg-hairline rounded-full transition-colors flex items-center gap-2"
            >
              <Shuffle className="w-4 h-4" /> Roll Dice
            </button>
            <button 
              onClick={handleSave}
              className="bg-primary text-primary-foreground text-button font-480 px-8 py-2.5 rounded-full flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <Check className="w-4 h-4" /> Save Avatar
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
