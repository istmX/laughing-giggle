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
    <main className="relative min-h-screen bg-[linear-gradient(135deg,#ffffff_0%,#fbfbff_50%,#ffffff_100%)] text-black lg:h-[100dvh] lg:overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(77,73,252,0.08),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(51,223,223,0.12),transparent_26%)]" />
      <div className="relative grid min-h-screen xl:h-full xl:grid-cols-[1.04fr_0.96fr]">
        <section className="relative hidden h-full flex-col border-b border-black/10 px-6 py-6 sm:px-8 md:px-10 xl:flex xl:border-b-0 xl:border-r xl:px-12 xl:py-6">
          <div className="flex items-start justify-between">
            <div className="text-[1.55rem] font-semibold tracking-[-0.08em]">
              {brand}
            </div>
            <div className="hidden items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs text-black/55 shadow-sm backdrop-blur md:flex">
              <Circle className="size-2 fill-[#4d49fc] text-[#4d49fc]" />
              Context first
            </div>
          </div>

          <div className="flex flex-1 flex-col justify-between gap-8 pt-10">
            <div className="max-w-xl space-y-5">
              <p className="text-[0.72rem] font-semibold tracking-[0.34em] text-black/65">
                {eyebrow}
                <span className="inline-block align-middle text-[#4d49fc]">•</span>
              </p>

              <h1 className="max-w-lg text-5xl leading-[0.94] tracking-[-0.07em] text-balance sm:text-6xl lg:text-[4.75rem]">
                {headline}
                {headlineAccent ? (
                  <>
                    {' '}
                    <span className="text-[#4d49fc]">{headlineAccent}</span>
                  </>
                ) : null}
              </h1>

              <p className="max-w-md text-base leading-7 text-black/62 lg:max-w-[28rem]">
                {description}
              </p>

              <div className="space-y-0">
                {features.map((feature) => {
                  const Icon = feature.icon

                  return (
                    <div
                      key={feature.title}
                      className="flex items-center gap-4 border-b border-black/10 py-4 last:border-b-0"
                    >
                      <div className="grid size-11 shrink-0 place-items-center rounded-2xl border border-black/10 bg-white/80 shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
                        <Icon className="size-5 text-black/80" />
                      </div>
                      <p className="text-base text-black/74">{feature.title}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="relative h-48 w-full max-w-lg overflow-hidden rounded-[2rem] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(248,248,255,0.96))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.05)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_12px_12px,rgba(0,0,0,0.1)_1px,transparent_1.5px)] bg-[length:14px_14px] opacity-45" />
              <div className="absolute left-10 top-10 h-28 w-28 rounded-full border-4 border-[#31d8d4]/60 border-t-transparent border-r-transparent" />
              <div className="absolute inset-x-0 bottom-5 flex items-end justify-between px-6">
                <div className="space-y-1">
                  <div className="text-xs font-semibold tracking-[0.34em] text-black/55">
                    CONTEXT IS
                  </div>
                  <div className="text-xs font-semibold tracking-[0.34em] text-black/55">
                    THE NEW CODE
                  </div>
                </div>
                <div className="text-[0.65rem] font-semibold tracking-[0.4em] text-black/50">
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
                  <span className="mr-2 text-black/65">{topActionPrefix}</span>
                ) : null}
                {topActionLabel && topActionHref ? (
                  <Link
                    to={topActionHref}
                    className="inline-flex items-center gap-1 font-medium text-[#4d49fc] transition-colors hover:text-[#3834ef]"
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
