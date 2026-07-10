import { ArrowRight, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'

function ContextBadgeMark({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <path
        d="M60 12.5c6.1 0 10.7 10.9 15.5 13.1 5 2.3 16.1-1.2 20 2.7 3.9 3.9.4 15 2.7 20 2.2 4.8 13.1 9.4 13.1 15.5s-10.9 10.7-13.1 15.5c-2.3 5 1.2 16.1-2.7 20-3.9 3.9-15-.4-20 2.7-4.8 2.2-9.4 13.1-15.5 13.1s-10.7-10.9-15.5-13.1c-5-2.3-16.1 1.2-20-2.7-3.9-3.9-.4-15-2.7-20C19.6 74.5 8.7 69.9 8.7 63.8s10.9-10.7 13.1-15.5c2.3-5-1.2-16.1 2.7-20 3.9-3.9 15 .4 20-2.7C49.3 23.4 53.9 12.5 60 12.5Z"
        stroke="currentColor"
        strokeWidth="6"
      />
      <circle cx="60" cy="63.8" r="13.8" fill="currentColor" />
    </svg>
  )
}

export function HeroSection03() {
  return (
    <section className="relative overflow-hidden border-b border-hairline bg-background text-foreground">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,var(--block-lilac)_0%,transparent_18%),radial-gradient(circle_at_82%_16%,var(--block-lime)_0%,transparent_15%),radial-gradient(circle_at_70%_84%,var(--block-cream)_0%,transparent_18%)] opacity-80" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,var(--shell-glow)_18%,transparent_82%)]" />

      <header className="relative z-10 flex items-center justify-between px-6 pt-6 md:px-8">
        <div className="text-2xl font-semibold tracking-tight">zenix*</div>
        <nav className="hidden gap-8 text-sm text-ink-soft md:flex">
          <a href="#product" className="font-medium text-foreground transition-opacity hover:opacity-60">
            Product
          </a>
          <a href="#how-it-works" className="transition-opacity hover:opacity-60">
            How it works
          </a>
          <a href="#use-with" className="transition-opacity hover:opacity-60">
            Use with
          </a>
          <a href="#docs" className="transition-opacity hover:opacity-60">
            Docs
          </a>
        </nav>
        <Button className="h-11 rounded-2xl bg-primary px-5 text-primary-foreground hover:bg-primary/90">
          Get started
          <ArrowRight className="size-4" />
        </Button>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-6 pb-20 pt-16 md:px-8 md:pt-20 lg:pb-24" id="product">
        <div className="grid gap-12 lg:grid-cols-[1.06fr_0.94fr] lg:items-start">
          <div className="pt-4 lg:pt-10">
            <p className="text-caption uppercase tracking-caption text-ink-soft">Context first</p>
            <h1 className="mt-5 max-w-[10ch] text-[clamp(3.6rem,7vw,5.9rem)] leading-display-xl tracking-display-xl text-balance">
              Build software context that feels clear from the first glance.
            </h1>
            <p className="mt-6 max-w-[34ch] text-body-lg text-ink-muted">
              Zenix turns rough product ideas into organized, implementation-ready context for AI coding agents.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button className="h-12 rounded-full bg-primary px-6 text-primary-foreground hover:bg-primary/90">
                Get started
                <ArrowRight className="size-4" />
              </Button>
              <a
                href="#product"
                className="inline-flex items-center gap-3 text-[1rem] font-medium text-foreground/72 transition-colors hover:text-foreground"
              >
                Explore the workflow
                <span className="grid size-10 place-items-center rounded-full border border-hairline bg-background">
                  <Sparkles className="size-4" />
                </span>
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              {['agents.md', 'architecture.md', 'build-plan.md'].map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-hairline bg-surface-soft px-4 py-2 text-caption uppercase tracking-caption text-ink-muted"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-4 top-8 h-24 w-24 rotate-[-8deg] rounded-xl bg-block-lime shadow-lg" />
            <div className="absolute right-4 top-0 h-28 w-28 rotate-[10deg] rounded-xl bg-block-lilac shadow-lg" />
            <div className="absolute bottom-10 left-8 h-20 w-32 rotate-[6deg] rounded-xl bg-block-cream shadow-md" />

            <div className="relative grid gap-4 sm:grid-cols-2">
              <article className="rounded-lg border border-hairline bg-surface-elevated p-5 shadow-lg">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-caption uppercase tracking-caption text-ink-soft">agents.md</p>
                  <ContextBadgeMark className="size-10 text-foreground" />
                </div>
                <h2 className="mt-10 max-w-[9ch] text-headline leading-headline tracking-headline">
                  AI agents with clear roles.
                </h2>
                <p className="mt-4 text-sm leading-6 text-ink-muted">
                  Planner, architect, coder, tester, and documenter. Each step carries forward.
                </p>
              </article>

              <article className="rounded-lg border border-hairline bg-block-cream p-5 shadow-lg">
                <p className="text-caption uppercase tracking-caption text-ink-soft">architecture.md</p>
                <div className="mt-8 grid grid-cols-2 gap-3">
                  {['Web app', 'API', 'Auth', 'Storage'].map((item) => (
                    <div key={item} className="rounded-lg border border-hairline bg-background px-3 py-4 text-sm">
                      {item}
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm leading-6 text-ink-muted">
                  A compact system map that keeps implementation decisions aligned.
                </p>
              </article>

              <article className="rounded-lg border border-hairline bg-block-lilac p-5 shadow-lg sm:col-span-2">
                <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
                  <div>
                    <p className="text-caption uppercase tracking-caption text-ink-soft">build-plan.md</p>
                    <h2 className="mt-6 max-w-[12ch] text-headline leading-headline tracking-headline">
                      A plan the team can actually execute.
                    </h2>
                    <p className="mt-4 max-w-xl text-sm leading-6 text-ink-muted">
                      Milestones, sequencing, and checkpoints stay readable without turning into noise.
                    </p>
                  </div>
                  <div className="rounded-lg border border-hairline bg-background px-5 py-4">
                    <p className="text-caption uppercase tracking-caption text-ink-soft">Delivery</p>
                    <p className="mt-3 text-3xl font-semibold tracking-tight">24 tasks</p>
                    <p className="mt-2 text-sm text-ink-muted">Structured, scoped, and ready for handoff.</p>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          <div className="rounded-lg border border-hairline bg-surface-soft p-5">
            <p className="text-caption uppercase tracking-caption text-ink-soft">ui-rules.md</p>
            <p className="mt-4 text-lg leading-7 tracking-body-lg">
              UI tokens, spacing, and behavior rules stay in one place.
            </p>
          </div>
          <div className="rounded-lg border border-hairline bg-surface-elevated p-5">
            <p className="text-caption uppercase tracking-caption text-ink-soft">mission-01.md</p>
            <p className="mt-4 text-lg leading-7 tracking-body-lg">
              Implementation missions stay focused enough to start immediately.
            </p>
          </div>
          <div className="rounded-lg border border-hairline bg-block-mint p-5">
            <p className="text-caption uppercase tracking-caption text-ink-soft">context.md</p>
            <p className="mt-4 text-lg leading-7 tracking-body-lg">
              The final bundle remains readable by every coding assistant.
            </p>
          </div>
        </div>
      </main>
    </section>
  )
}
