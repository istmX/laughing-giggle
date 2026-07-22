import { Link } from 'react-router-dom'
import { ArrowUpRight, Check, Sparkles } from 'lucide-react'
import { Navbar } from '@/components/ui/Navbar'
import Footer from '@/Landing/Footer'

const INCLUDES = [
  'Project architecture',
  'AGENTS.md instructions',
  'DESIGN.md visual rules',
  'UI tokens and spacing',
  'Task breakdowns',
  'Build and setup documentation',
]

export default function TemplatesPage() {
  return (
    <div className="bg-background text-foreground font-sans overflow-x-hidden">
      <Navbar />

      <main>
        <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-6 py-32 text-center">
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center select-none opacity-[0.035]">
            <span className="font-tall text-[18vw] leading-[0.8]">CONTEXT</span>
            <span className="font-tall text-[18vw] leading-[0.8]">SYSTEMS</span>
          </div>

          <div className="relative z-10 flex w-full max-w-5xl flex-col items-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-hairline bg-surface-soft px-4 py-2 text-xs text-ink-muted">
              <Sparkles className="h-3.5 w-3.5" /> Community marketplace coming soon
            </div>
            <h1 className="templates-hero__title flex w-full justify-center items-center gap-1 overflow-hidden font-tall text-[clamp(7rem,21vw,24rem)] leading-[0.75] tracking-tighter sm:gap-2">
              {'TEMPLATES'.split('').map((letter, index) => (
                <span key={`${letter}-${index}`} className="inline-flex overflow-hidden">
                  <span className="inline-block">{letter}</span>
                </span>
              ))}
            </h1>
            <p className="mt-10 w-full max-w-2xl text-lg leading-relaxed text-ink-muted sm:text-xl">
              Stop starting from scratch. Discover reusable context systems for AI-native software development, then bring the structure into your next project.
            </p>
            <Link
              to="/#templates"
              className="mt-10 inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm text-background transition-transform hover:-translate-y-0.5 sm:w-auto"
            >
              See the landing preview <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 py-32 sm:py-48">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">Every template includes</p>
              <h2 className="mt-6 font-tall text-[clamp(3.5rem,8vw,7rem)] leading-[0.85]">
                BUILD WITH CONTEXT.
              </h2>
            </div>

            <div className="min-w-0">
              <p className="max-w-prose text-lg leading-relaxed text-ink-muted">
                Templates are more than visual starting points. Each one packages the decisions an AI coding tool needs to work inside a real project: structure, rules, tokens, and a plan.
              </p>
              <div className="mt-10 grid gap-3 sm:grid-cols-2">
                {INCLUDES.map((item) => (
                  <div key={item} className="flex min-w-0 items-center gap-3 border-b border-hairline py-4 text-sm">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-soft">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-10 rounded-2xl border border-hairline bg-surface-soft p-6 sm:p-8">
                <p className="text-3xl font-[var(--font-weight-540)] leading-tight tracking-tight sm:text-4xl">COMMUNITY MARKETPLACE LAUNCHING SOON.</p>
                <p className="mt-4 max-w-prose text-sm leading-relaxed text-ink-muted">
                  The first templates are being shaped now. Until launch, you can use Zenix free while the marketplace grows.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
