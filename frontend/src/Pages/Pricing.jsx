import { Link } from 'react-router-dom'
import { ArrowRight, Check } from 'lucide-react'
import { Navbar } from '@/components/ui/Navbar'
import Footer from '@/Landing/Footer'

const INCLUDED = [
  'Create and organize projects',
  'Generate implementation-ready context',
  'Use the AI playground and project workspace',
  'Export your development documentation',
]

export default function PricingPage() {
  return (
    <div className="bg-background text-foreground font-sans overflow-x-hidden">
      <Navbar />

      <main>
        <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-6 py-32 text-center">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center select-none opacity-[0.035]">
            <span className="font-tall text-[24vw] leading-none">FREE</span>
          </div>

          <div className="relative z-10 flex w-full max-w-5xl flex-col items-center">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">Simple access. Real building.</p>
            <h1 className="pricing-hero__title mt-8 flex w-full justify-center items-center gap-1 overflow-hidden font-tall text-[clamp(6rem,16vw,19rem)] leading-[0.75] tracking-tighter sm:gap-2">
              {'FREE TO TEST.'.split('').map((letter, index) => (
                letter === ' '
                  ? <span key={`space-${index}`} className="inline-block w-[0.22em]" aria-hidden="true">&nbsp;</span>
                  : <span key={`${letter}-${index}`} className="inline-flex overflow-hidden">
                      <span className="inline-block">{letter}</span>
                    </span>
              ))}
            </h1>
            <p className="mt-10 w-full max-w-2xl text-lg leading-relaxed text-ink-muted sm:text-xl">
              Zenix is free while we build the product and learn from the people using it. Explore the workflow, create projects, and help shape what comes next.
            </p>
            <Link
              to="/signup"
              className="mt-10 inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-7 py-3 text-sm text-background transition-transform hover:-translate-y-0.5 sm:w-auto"
            >
              Start building <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 py-32 sm:py-48">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">Early access</p>
              <h2 className="mt-6 text-[clamp(2.5rem,6vw,4.5rem)] font-[var(--font-weight-540)] leading-[0.95] tracking-tight">
                NO PRICING WALL.
              </h2>
            </div>

            <div className="min-w-0">
              <div className="rounded-2xl border border-hairline bg-surface-soft p-6 sm:p-10">
                <div className="flex flex-col gap-4 border-b border-hairline pb-8 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-5xl font-[var(--font-weight-540)] leading-none tracking-tight sm:text-6xl">$0</p>
                    <p className="mt-2 text-sm text-ink-muted">Free during early access</p>
                  </div>
                  <span className="inline-flex w-fit rounded-full border border-hairline bg-background px-3 py-1 text-xs text-ink-muted">Current plan</span>
                </div>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {INCLUDED.map((item) => (
                    <div key={item} className="flex min-w-0 items-start gap-3 text-sm leading-relaxed">
                      <Check className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <Link
                  to="/signup"
                  className="mt-10 inline-flex w-full items-center justify-center rounded-full bg-foreground px-6 py-3 text-sm text-background transition-opacity hover:opacity-85"
                >
                  Create a free account
                </Link>
              </div>
              <p className="mt-6 max-w-prose text-sm leading-relaxed text-ink-muted">
                Paid plans may come later as the workspace grows. If that changes, we’ll make the transition clear before anything is charged.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
