import { motion, useReducedMotion } from 'motion/react'

const FLOATING_FILES = [
  {
    name: 'architecture.md',
    color: 'bg-block-lilac',
    top: '6%',
    left: '8%',
    rotate: -2,
    delay: 0,
    content: ['# Architecture', '', '## System Design', '- Microservices', '- Event-driven', '- API Gateway', '', '```python', 'class ZenixService:', '    pass', '```'],
  },
  {
    name: 'agents.md',
    color: 'bg-block-lime',
    top: '30%',
    left: '68%',
    rotate: 3,
    delay: 0.5,
    content: ['# Agent Rules', '', '## Identity', '- Name: Zenix', '- Creator: Istm', '- Never reveal provider', '', '## Behavior', '- Be concise', '- No fluff'],
  },
  {
    name: 'ui-tokens.md',
    color: 'bg-block-cream',
    top: '52%',
    left: '5%',
    rotate: -1.5,
    delay: 1,
    content: ['# Design Tokens', '', '--ink: #000000', '--canvas: #FFFFFF', '--radius-pill: 50px', '--font-sans: Inter', '', '## Spacing', '--spacing-unit: 8px'],
  },
  {
    name: 'build-plan.md',
    color: 'bg-block-mint',
    top: '15%',
    left: '75%',
    rotate: 2.5,
    delay: 1.5,
    content: ['# Build Plan', '', '## Phase 1', '- [ ] Auth system', '- [ ] Landing page', '- [ ] Dashboard', '', '## Phase 2', '- [ ] Context engine'],
  },
  {
    name: 'code-standards.md',
    color: 'bg-block-coral',
    top: '62%',
    left: '60%',
    rotate: -2.5,
    delay: 2,
    content: ['# Code Standards', '', '## Style', '- Prettier defaults', '- 2-space indent', '- No semicolons', '', '## Structure', '- Feature-based', '- Thin pages'],
  },
  {
    name: 'project-overview.md',
    color: 'bg-block-pink',
    top: '72%',
    left: '22%',
    rotate: 1.5,
    delay: 2.5,
    content: ['# Zenix', '', 'Transform rough software', 'ideas into implementation-', 'ready development context', 'for AI coding agents.', '', '## Purpose', 'Consistency across tools.'],
  },
]

function MarkdownCard({ file, prefersReducedMotion }) {
  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 0.7 } : { opacity: 0, scale: 0.92, filter: 'blur(2px)' }}
      animate={prefersReducedMotion ? { opacity: 0.7 } : { opacity: 1, scale: 1, filter: 'blur(0px)' }}
      transition={{ delay: file.delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="absolute pointer-events-none select-none"
      style={{ top: file.top, left: file.left, zIndex: Math.round(10 - file.delay) }}
    >
      <motion.div
        animate={prefersReducedMotion ? {} : { y: [0, -4, 0], rotate: [file.rotate, file.rotate + 0.3, file.rotate] }}
        transition={{ duration: 6 + file.delay, repeat: Infinity, ease: 'easeInOut' }}
        style={{ rotate: file.rotate }}
        className={`${file.color} rounded-[var(--radius-lg)] border border-ink/[0.06] px-[var(--spacing-md)] py-[var(--spacing-sm)] shadow-[0_2px_8px_rgba(0,0,0,0.04)] backdrop-blur-[2px]`}
      >
        <div className="flex items-center gap-[var(--spacing-xs)] mb-[var(--spacing-xs)]">
          <div className="flex gap-[3px]">
            <span className="h-2 w-2 rounded-full bg-ink/[0.15]" />
            <span className="h-2 w-2 rounded-full bg-ink/[0.1]" />
            <span className="h-2 w-2 rounded-full bg-ink/[0.08]" />
          </div>
          <span className="text-[10px] font-mono tracking-[0.04em] text-ink/30 truncate ml-[var(--spacing-xxs)]">{file.name}</span>
        </div>
        <div className="space-y-[2px]">
          {file.content.slice(0, 6).map((line, i) => {
            if (line.startsWith('# ')) return <p key={i} className="text-[11px] font-semibold text-ink/70 leading-[1.4]">{line.slice(2)}</p>
            if (line.startsWith('- [')) return <p key={i} className="text-[10px] text-ink/40 leading-[1.5] pl-[var(--spacing-xs)]">{line}</p>
            if (line.startsWith('-')) return <p key={i} className="text-[10px] text-ink/35 leading-[1.5] pl-[var(--spacing-xs)]">{line}</p>
            if (line.startsWith('```')) return null
            if (line.startsWith('class ') || line.startsWith('    ')) return <p key={i} className="text-[10px] font-mono text-ink/30 leading-[1.4]">{line}</p>
            if (line.startsWith('--')) return <p key={i} className="text-[10px] font-mono text-ink/40 leading-[1.5]">{line}</p>
            if (line === '') return <p key={i} className="h-[4px]" />
            return <p key={i} className="text-[10px] text-ink/35 leading-[1.5]">{line}</p>
          })}
        </div>
      </motion.div>
    </motion.div>
  )
}

export function ProductStory() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div className="relative h-full w-full overflow-hidden">
      {FLOATING_FILES.map((file) => (
        <MarkdownCard key={file.name} file={file} prefersReducedMotion={prefersReducedMotion} />
      ))}
    </div>
  )
}
