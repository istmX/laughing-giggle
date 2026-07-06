import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Circle,
  Layers3,
  Sparkles,
  SquareStack,
  Zap,
} from 'lucide-react'

const defaultFeatures = [
  {
    icon: Layers3,
    title: 'Structured workflows for every project',
  },
  {
    icon: Sparkles,
    title: 'Clean context layers for faster building',
  },
  {
    icon: Zap,
    title: 'Designed for sharp teams and solo founders',
  },
  {
    icon: SquareStack,
    title: 'A foundation that scales with your ideas',
  },
]

const AuthShell = ({
  brand = 'zenix*',
  eyebrow = 'BUILD BETTER WITH CONTEXT',
  headline,
  headlineAccent,
  description,
  features = defaultFeatures,
  topActionLabel,
  topActionHref,
  topActionPrefix,
  children,
}) => {
  return (
    <main className="relative min-h-screen bg-background text-foreground lg:h-[100dvh] lg:overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.08),transparent_28%),radial-gradient(circle_at_bottom_right,hsl(var(--accent)/0.16),transparent_26%)]" />
      <div className="relative grid min-h-screen xl:h-full xl:grid-cols-[1.04fr_0.96fr]">
        <section className="relative hidden h-full flex-col border-b border-border px-6 py-6 sm:px-8 md:px-10 xl:flex xl:border-b-0 xl:border-r xl:px-12 xl:py-6">
          <div className="flex items-start justify-between">
            <div className="text-[1.55rem] font-semibold tracking-[-0.05em]">
              {brand}
            </div>
            <div className="hidden items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs text-muted-foreground shadow-sm backdrop-blur md:flex">
              <Circle className="size-2 fill-primary text-primary" />
              Context first
            </div>
          </div>

          <div className="flex flex-1 flex-col justify-between gap-8 pt-10">
            <div className="max-w-xl space-y-5">
              <p className="text-[0.72rem] font-semibold tracking-[0.16em] text-muted-foreground">
                {eyebrow}
                <span className="inline-block align-middle text-primary">•</span>
              </p>

              <h1 className="max-w-lg text-5xl leading-[0.94] tracking-[-0.07em] text-balance sm:text-6xl lg:text-[4.75rem]">
                {headline}
                {headlineAccent ? (
                  <>
                    {' '}
                    <span className="text-primary">{headlineAccent}</span>
                  </>
                ) : null}
              </h1>

              <p className="max-w-md text-base leading-7 text-muted-foreground lg:max-w-[28rem]">
                {description}
              </p>

              <div className="space-y-0">
                {features.map((feature) => {
                  const Icon = feature.icon

                  return (
                    <div
                      key={feature.title}
                      className="flex items-center gap-4 border-b border-border py-4 last:border-b-0"
                    >
                      <div className="grid size-11 shrink-0 place-items-center rounded-2xl border border-border bg-background shadow-sm">
                        <Icon className="size-5 text-foreground" />
                      </div>
                      <p className="text-base text-foreground/80">{feature.title}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="relative h-48 w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_12px_12px,hsl(var(--foreground)/0.08)_1px,transparent_1.5px)] bg-[length:14px_14px] opacity-45" />
              <div className="absolute left-10 top-10 h-28 w-28 rounded-full border-4 border-primary/60 border-t-transparent border-r-transparent" />
              <div className="absolute inset-x-0 bottom-5 flex items-end justify-between px-6">
                <div className="space-y-1">
                  <div className="text-xs font-semibold tracking-[0.16em] text-muted-foreground">
                    CONTEXT IS
                  </div>
                  <div className="text-xs font-semibold tracking-[0.16em] text-muted-foreground">
                    THE NEW CODE
                  </div>
                </div>
                <div className="text-[0.65rem] font-semibold tracking-[0.18em] text-muted-foreground">
                  READY TO SHIP
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative flex items-start justify-center px-5 py-6 sm:px-8 md:px-10 xl:h-full xl:items-center xl:px-12 xl:py-6">
          <div className="w-full max-w-xl xl:max-h-full">
            {(topActionLabel && topActionHref) || topActionPrefix ? (
              <div className="mb-4 flex justify-end text-sm max-[820px]:mb-3">
                {topActionPrefix ? (
                  <span className="mr-2 text-muted-foreground">{topActionPrefix}</span>
                ) : null}
                {topActionLabel && topActionHref ? (
                  <Link
                    to={topActionHref}
                    className="inline-flex items-center gap-1 font-medium text-primary transition-colors hover:opacity-80"
                  >
                    {topActionLabel}
                    <ArrowRight className="size-4" />
                  </Link>
                ) : null}
              </div>
            ) : null}

            {children}
          </div>
        </section>
      </div>
    </main>
  )
}

export default AuthShell
