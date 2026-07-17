import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'

import { ProductStory } from './ProductStory'

const CREDIBILITY = [
  'Multi-Agent Context Generation',
  'Cursor Ready',
  'Claude Code Ready',
  'Markdown First',
  'Architecture Aware',
  'RAG Ready',
  'Template Driven',
  'OpenRouter Compatible',
]

const AuthShell = ({ children, panelTitle, panelDescription }) => {
  const prefersReducedMotion = useReducedMotion()

  return (
    <main className="flex min-h-dvh flex-col bg-canvas text-ink lg:flex-row">

      <section className="relative hidden overflow-hidden lg:flex lg:w-[42%] 2xl:w-[40%]">
        <div className="absolute inset-0 bg-surface-soft">
          <div className="absolute inset-0 opacity-[0.35]"
            style={{ backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.08) 0.5px, transparent 0.5px)', backgroundSize: '20px 20px' }} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,var(--block-lilac)_0%,transparent_35%),radial-gradient(circle_at_75%_20%,var(--block-lime)_0%,transparent_30%),radial-gradient(circle_at_50%_70%,var(--block-cream)_0%,transparent_32%)] opacity-60" />
        </div>

        <div className="relative z-10 flex w-full flex-col p-[var(--spacing-xxl)]">
          <motion.div
            initial={prefersReducedMotion ? {} : { opacity: 0, y: -4 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link to="/" className="inline-flex items-start gap-0.5 text-[var(--text-body)] font-[var(--font-weight-480)] tracking-[var(--tracking-body)]">
              <span>zenix</span><span className="-translate-y-1 text-xs leading-none">*</span>
            </Link>
          </motion.div>

          <div className="flex flex-1 flex-col justify-center -mt-[var(--spacing-xl)]">
            <motion.div
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 12 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="text-[clamp(0.6rem,0.7vw,0.7rem)] font-mono uppercase tracking-[0.14em] text-ink-soft">
                AI Context Engineering
              </p>
              <h1 className="mt-[var(--spacing-md)] text-[clamp(2rem,3.2vw,3.2rem)] font-[var(--font-weight-340)] leading-[1.04] tracking-[-0.03em] text-balance max-w-[14ch]">
                Turn ideas into implementation-ready context.
              </h1>
               <p className="mt-[var(--spacing-md)] text-[clamp(0.9rem,1.05vw,1.05rem)] font-[var(--font-weight-320)] leading-[1.5] tracking-[var(--tracking-body)] text-ink-muted max-w-[32ch]">
                Describe your idea once. Zenix generates architecture, design tokens, build plans, and agent rules — ready for Cursor, Claude Code, or any AI coding tool.
              </p>
            </motion.div>

            <motion.div
              initial={prefersReducedMotion ? {} : { opacity: 0 }}
              animate={prefersReducedMotion ? {} : { opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="mt-[var(--spacing-xxl)] flex-1 min-h-0 relative"
            >
              <ProductStory />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="flex flex-1 flex-col overflow-y-auto">
        <div className="flex flex-1 flex-col items-center justify-center px-[var(--spacing-xl)] py-[var(--spacing-xxl)] sm:px-[var(--spacing-xxl)]">
          <div className="mb-[var(--spacing-xl)] flex w-full max-w-[28rem] items-center justify-between lg:hidden">
            <Link to="/" className="inline-flex items-start gap-0.5 text-[var(--text-body)] font-[var(--font-weight-480)] tracking-[var(--tracking-body)]">
              <span>zenix</span><span className="-translate-y-1 text-xs leading-none">*</span>
            </Link>
            <span className="text-[11px] font-mono uppercase tracking-[0.1em] text-ink-soft">Context First</span>
          </div>

          <div className="w-full max-w-[28rem]">
            <motion.div
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mb-[var(--spacing-xl)] text-center"
            >
              <h2 className="text-[var(--text-headline)] font-[var(--font-weight-340)] leading-[1.2] tracking-[var(--tracking-headline)] text-balance">
                {panelTitle}
              </h2>
               <p className="mt-[var(--spacing-sm)] mx-auto max-w-[28ch] text-[var(--text-body)] font-[var(--font-weight-320)] leading-[1.5] tracking-[var(--tracking-body)] text-ink-muted">
                {panelDescription}
              </p>
            </motion.div>

            <motion.div
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 8 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-[var(--radius-xl)] border border-hairline/80 bg-canvas p-[var(--spacing-xl)] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)] sm:p-[var(--spacing-xxl)]"
            >
              {children}
            </motion.div>

            <motion.div
              initial={prefersReducedMotion ? {} : { opacity: 0 }}
              animate={prefersReducedMotion ? {} : { opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-[var(--spacing-xl)]"
            >
              <div className="flex flex-wrap items-center justify-center gap-x-[var(--spacing-lg)] gap-y-[var(--spacing-xs)]">
                {CREDIBILITY.slice(0, 4).map((item) => (
                  <span key={item} className="flex items-center gap-[var(--spacing-xxs)] text-[11px] font-[var(--font-weight-330)] text-ink-soft">
                    <span className="text-semantic-success/70">✓</span>{item}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-x-[var(--spacing-lg)] gap-y-[var(--spacing-xs)] mt-[var(--spacing-xs)]">
                {CREDIBILITY.slice(4).map((item) => (
                  <span key={item} className="flex items-center gap-[var(--spacing-xxs)] text-[11px] font-[var(--font-weight-330)] text-ink-soft">
                    <span className="text-semantic-success/70">✓</span>{item}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default AuthShell
