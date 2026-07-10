import { Link } from 'react-router-dom'

const AuthShell = ({ children, panelTitle, panelDescription }) => {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,var(--shell-glow)_0%,transparent_28%),radial-gradient(circle_at_bottom_right,var(--shell-glow-soft)_0%,transparent_24%)]" />
      <div className="relative grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden min-h-screen overflow-hidden border-r border-hairline-soft bg-[linear-gradient(180deg,var(--surface-soft),var(--background))] lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,var(--block-lilac)_0%,transparent_20%),radial-gradient(circle_at_78%_18%,var(--block-lime)_0%,transparent_18%),radial-gradient(circle_at_58%_78%,var(--block-cream)_0%,transparent_22%)] opacity-80" />
          <div className="absolute inset-y-0 left-0 w-full bg-[linear-gradient(180deg,transparent,var(--shell-glow-soft)_18%,transparent_82%)]" />

          <div className="relative flex w-full items-center p-8 xl:p-10">
            <Link
              to="/"
              className="absolute left-8 top-8 inline-flex items-start gap-0.5 text-3xl font-semibold tracking-tight text-foreground xl:left-10 xl:top-10"
            >
              <span>zenix</span>
              <span className="-translate-y-1 text-xl leading-none">*</span>
            </Link>

            <div className="max-w-[34rem] pt-24 pb-8">
              <p className="text-caption uppercase tracking-caption text-ink-soft">Context first</p>
              <h1 className="mt-6 max-w-[8ch] text-[clamp(4rem,6.8vw,5.9rem)] leading-display-xl tracking-display-xl text-balance">
                Build better.
                <br />
                Ship faster.
              </h1>
              <p className="mt-8 max-w-[22ch] text-body-lg text-ink-muted">
                Everything you need to turn ideas into implementation-ready context.
              </p>

              <div className="mt-10 flex flex-wrap gap-3">
                <span className="h-24 w-24 rounded-xl bg-block-lime shadow-sm" />
                <span className="h-24 w-16 rounded-xl bg-block-lilac shadow-sm" />
                <span className="h-24 w-20 rounded-xl bg-block-cream shadow-sm" />
              </div>
            </div>
          </div>
        </section>

        <section className="relative flex min-h-screen items-center justify-center px-4 py-5 sm:px-6 lg:px-8">
          <div className="w-full max-w-[40rem]">
            <div className="mb-4 flex items-center justify-between text-2xl font-semibold tracking-tight lg:hidden">
              <Link to="/" className="inline-flex items-start gap-0.5">
                <span>zenix</span>
                <span className="-translate-y-1 text-base leading-none">*</span>
              </Link>
              <span className="text-sm font-normal text-ink-soft">Context first</span>
            </div>

            <div className="rounded-lg border border-hairline bg-surface-elevated p-4 shadow-[0_24px_60px_var(--shell-shadow)] sm:p-6 lg:p-8">
              <div className="rounded-lg border border-hairline-soft bg-surface-soft px-4 py-6 sm:px-6 sm:py-8 lg:px-9 lg:py-10">
                <div className="space-y-3 text-center">
                  <h2 className="text-[clamp(2rem,3.2vw,3.1rem)] leading-none tracking-headline text-balance">
                    {panelTitle}
                  </h2>
                  <p className="mx-auto max-w-[30ch] text-body-lg text-ink-muted">
                    {panelDescription}
                  </p>
                </div>

                <div className="mt-8 sm:mt-10">{children}</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

export default AuthShell
