import { motion } from 'framer-motion'
import { Monitor, Sun, Moon, Palette } from 'lucide-react'
import { usePreferencesStore } from '../store/preferences.store'

export const PreferencesPage = () => {
  const theme = usePreferencesStore((state) => state.theme)
  const setTheme = usePreferencesStore((state) => state.setTheme)

  const themes = [
    { id: 'system', name: 'System', icon: Monitor, description: 'Matches your OS settings' },
    { id: 'light', name: 'Light', icon: Sun, description: 'Clean white canvas' },
    { id: 'dark', name: 'Dark', icon: Moon, description: 'High contrast black' },
    { id: 'midnight', name: 'Midnight', icon: Palette, description: 'Deep blue-gray editor' },
    { id: 'emerald', name: 'Emerald', icon: Palette, description: 'Rich dark green' }
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-16 pb-24">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <h1 className="text-display-lg font-340 tracking-display-lg text-ink">
          Preferences
        </h1>
        <p className="text-subhead font-340 text-ink-muted tracking-subhead">
          Customize your dashboard experience.
        </p>
      </motion.div>

      <motion.section 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-8"
      >
        <div>
          <h2 className="text-headline font-540 tracking-headline text-ink mb-2">Appearance</h2>
          <p className="text-body font-320 text-ink-muted mb-8">Choose a theme for the dashboard. Landing pages will always remain in light mode.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {themes.map((t) => {
            const isActive = theme === t.id
            return (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`flex items-start gap-4 p-6 rounded-2xl border text-left transition-all ${
                  isActive 
                    ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                    : 'border-hairline bg-surface-soft hover:bg-hairline-soft'
                }`}
              >
                <div className={`p-3 rounded-full ${isActive ? 'bg-primary text-primary-foreground' : 'bg-surface-elevated text-ink-muted shadow-sm'}`}>
                  <t.icon className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className={`text-body-lg font-480 ${isActive ? 'text-primary' : 'text-ink'}`}>
                    {t.name}
                  </h3>
                  <p className={`text-body-sm mt-1 ${isActive ? 'text-primary/80' : 'text-ink-muted'}`}>
                    {t.description}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </motion.section>
    </div>
  )
}
