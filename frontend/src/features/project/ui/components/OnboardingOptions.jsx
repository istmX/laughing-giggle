import { motion } from 'framer-motion'
import { Sparkles, GitFork, UploadCloud, FileCode } from 'lucide-react'

export function OnboardingOptions({ onSelectChat }) {
  const cards = [
    {
      id: 'chat',
      title: 'Chat with Zenix AI',
      description: 'Run an interactive design interview to refine requirements, synthesize architectural blueprints, and generate context.',
      icon: Sparkles,
      active: true,
      actionText: 'Start Workspace Chat',
      onClick: onSelectChat,
      accent: 'border-brand-indigo/30 hover:border-brand-indigo/80 shadow-md',
      iconBg: 'bg-brand-indigo/10 text-brand-indigo'
    },
    {
      id: 'github',
      title: 'Import from GitHub',
      description: 'Connect your repository directly. Zenix will scan your codebase to align context and architecture.',
      icon: GitFork,
      active: false,
      comingSoon: true,
      iconBg: 'bg-surface-soft text-ink-muted'
    },
    {
      id: 'upload',
      title: 'Upload Specification Document',
      description: 'Drag and drop your own PRD, markdown spec, or text notes to compile them into standard AI blueprints.',
      icon: UploadCloud,
      active: false,
      comingSoon: true,
      iconBg: 'bg-surface-soft text-ink-muted'
    },
    {
      id: 'blueprints',
      title: 'Select a Blueprint Template',
      description: 'Start with a pre-configured template (SaaS, Mobile App, IoT Hub, Admin Board) with default tokens.',
      icon: FileCode,
      active: false,
      comingSoon: true,
      iconBg: 'bg-surface-soft text-ink-muted'
    }
  ]

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <motion.div
            key={card.id}
            whileHover={card.active ? { y: -3, scale: 1.01 } : {}}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={card.active ? card.onClick : undefined}
            className={`relative rounded-[24px] border p-6 flex flex-col justify-between min-h-[200px] select-none ${
              card.active
                ? `bg-canvas cursor-pointer ${card.accent}`
                : 'bg-surface-soft border-hairline/60 opacity-60 cursor-not-allowed'
            }`}
          >
            {card.comingSoon && (
              <span className="absolute top-4 right-4 font-mono text-[9px] uppercase tracking-wider bg-canvas border border-hairline px-2.5 py-1 rounded text-ink-muted">
                Coming Soon
              </span>
            )}

            <div className="flex flex-col gap-4">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${card.iconBg}`}>
                <Icon className="h-5 w-5" />
              </div>

              <div>
                <h4 className="text-[16px] font-[540] text-ink tracking-tight">{card.title}</h4>
                <p className="mt-2 text-[13px] text-ink-muted leading-relaxed font-normal">{card.description}</p>
              </div>
            </div>

            {card.active && (
              <div className="mt-6 flex items-center gap-2 text-[13px] font-[540] text-brand-indigo group">
                <span>{card.actionText}</span>
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </div>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}
