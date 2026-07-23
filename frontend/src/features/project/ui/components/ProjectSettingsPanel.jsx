import { Globe, Smartphone, Laptop, Settings } from 'lucide-react'

export function ProjectSettingsPanel({ settings = {}, onChange }) {
  const platforms = [
    { id: 'web', label: 'Web Application', icon: Globe },
    { id: 'mobile', label: 'Mobile App', icon: Smartphone },
    { id: 'desktop', label: 'Desktop App', icon: Laptop },
    { id: 'hybrid', label: 'Hybrid / API', icon: Settings }
  ]

  const techStackOptions = [
    'Next.js', 'React', 'React Native', 'Vite', 'Node.js', 
    'Express', 'Supabase', 'PostgreSQL', 'MongoDB', 'Tailwind CSS'
  ]

  const designThemes = [
    { id: 'minimalist', label: 'Minimalist (Light)' },
    { id: 'midnight', label: 'Midnight (Dark)' },
    { id: 'emerald', label: 'Emerald Vibe' }
  ]

  const currentPlatform = settings.platform || 'web'
  const currentTechStack = settings.techStack || []
  const currentTheme = settings.designStyle || 'minimalist'

  const handlePlatformChange = (platformId) => {
    onChange({ ...settings, platform: platformId })
  }

  const handleTechToggle = (tech) => {
    const nextStack = currentTechStack.includes(tech)
      ? currentTechStack.filter((t) => t !== tech)
      : [...currentTechStack, tech]
    onChange({ ...settings, techStack: nextStack })
  }

  const handleThemeChange = (themeId) => {
    onChange({ ...settings, designStyle: themeId })
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Target Platform */}
      <div>
        <h5 className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted mb-3">Target Platform</h5>
        <div className="grid grid-cols-2 gap-2">
          {platforms.map((p) => {
            const Icon = p.icon
            const isSelected = currentPlatform === p.id
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handlePlatformChange(p.id)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-[13px] font-medium transition-all text-left cursor-pointer ${
                  isSelected
                    ? 'bg-ink text-canvas border-ink shadow-sm'
                    : 'bg-canvas text-ink border-hairline hover:bg-surface-soft hover:border-ink/20'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{p.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Tech Stack Presets */}
      <div>
        <h5 className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted mb-3">Tech Stack Presets</h5>
        <div className="flex flex-wrap gap-1.5">
          {techStackOptions.map((tech) => {
            const isSelected = currentTechStack.includes(tech)
            return (
              <button
                key={tech}
                type="button"
                onClick={() => handleTechToggle(tech)}
                className={`px-3 py-1.5 rounded-full border text-[12px] font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-ink text-canvas border-ink'
                    : 'bg-canvas text-ink-muted border-hairline hover:border-ink/20 hover:text-ink'
                }`}
              >
                {tech}
              </button>
            )
          })}
        </div>
      </div>

      {/* Design Vibe */}
      <div>
        <h5 className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-muted mb-3">Design Vibe</h5>
        <div className="flex flex-col gap-1.5">
          {designThemes.map((theme) => {
            const isSelected = currentTheme === theme.id
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => handleThemeChange(theme.id)}
                className={`w-full px-4 py-2.5 rounded-xl border text-[13px] font-medium transition-all text-left cursor-pointer ${
                  isSelected
                    ? 'bg-ink text-canvas border-ink shadow-sm'
                    : 'bg-canvas text-ink border-hairline hover:bg-surface-soft hover:border-ink/20'
                }`}
              >
                {theme.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
