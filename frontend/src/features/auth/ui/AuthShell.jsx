import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'

const AuthShell = ({ children, panelTitle, panelDescription, panelEyebrow = 'Developer workspace', accent = 'lime' }) => {
  const prefersReducedMotion = useReducedMotion()
  const accentClass = accent === 'lilac' ? 'bg-block-lilac' : 'bg-block-lime'

  return (
    <main className="min-h-dvh bg-canvas px-4 py-4 text-ink sm:px-6 sm:py-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100dvh-2rem)] max-w-6xl flex-col lg:min-h-[calc(100dvh-3rem)]">
        <header className="flex items-center justify-between px-2 py-2 sm:px-4">
          <Link
            to="/"
            className="inline-flex min-h-11 items-center text-[21px] font-[var(--font-weight-540)] tracking-[-0.04em] text-ink outline-none transition-opacity hover:opacity-60 focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ink/30"
            aria-label="Zenix home"
          >
            zenix<span className="ml-0.5 -translate-y-2 text-[11px]">*</span>
          </Link>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">
            Context first
          </span>
        </header>

        <div className="grid flex-1 items-center gap-8 py-8 lg:grid-cols-[minmax(0,1fr)_minmax(24rem,28rem)] lg:gap-16 lg:py-12">
          <motion.section
            initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
            animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className={`${accentClass} relative hidden min-h-[min(620px,calc(100dvh-12rem))] overflow-hidden rounded-[var(--radius-lg)] p-8 sm:p-12 lg:flex lg:flex-col lg:justify-between`}
            aria-hidden="true"
          >
            <div className="relative z-10 max-w-[21rem]">
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink/65">
                Zenix / Auth
              </span>
              <p className="mt-6 max-w-[12ch] text-[clamp(2.75rem,5vw,5rem)] font-[var(--font-weight-340)] leading-[0.96] tracking-[-0.04em] text-ink">
                Start with context.
              </p>
            </div>

            <div className="relative z-10 flex items-end justify-between gap-6">
              <p className="max-w-[18rem] text-[15px] leading-6 text-ink/70">
                A focused workspace for turning ideas into software that AI can actually understand.
              </p>
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink/60">01</span>
            </div>

            <div className="absolute -right-14 top-24 size-56 rounded-full border-[18px] border-ink/10" />
            <div className="absolute -bottom-16 -left-8 size-44 rotate-12 bg-canvas/25" />
          </motion.section>

          <section className="flex w-full justify-center">
            <motion.div
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 8 }}
              animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-[28rem]"
            >
              <div className="rounded-[var(--radius-lg)] border border-hairline bg-surface-elevated p-6 sm:p-8">
                <div className="mb-8">
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-soft">
                    {panelEyebrow}
                  </p>
                  <h1 className="mt-3 text-[32px] font-[var(--font-weight-540)] leading-[1.08] tracking-[-0.035em] text-ink sm:text-[36px]">
                    {panelTitle}
                  </h1>
                  <p className="mt-3 text-[15px] leading-6 text-ink-muted">
                    {panelDescription}
                  </p>
                </div>
                {children}
              </div>
            </motion.div>
          </section>
        </div>

        <footer className="flex items-center justify-between gap-4 px-2 pb-2 pt-2 font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft sm:px-4">
          <span>© {new Date().getFullYear()} Zenix</span>
          <span className="hidden sm:inline">Built for better context</span>
        </footer>
      </div>
    </main>
  )
}

export default AuthShell
