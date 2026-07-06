import { Link } from 'react-router-dom'

const AuthShell = ({ children, panelTitle, panelDescription }) => {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080808] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.04),transparent_24%)]" />
      <div className="relative grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden min-h-screen overflow-hidden border-r border-white/8 lg:flex">
          <div className="absolute inset-y-0 left-0 w-full bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent_25%,transparent_75%,rgba(255,255,255,0.02))]" />
          <div className="absolute left-0 top-0 h-full w-full opacity-45">
            <svg
              aria-hidden="true"
              className="h-full w-full"
              viewBox="0 0 960 1200"
              fill="none"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="authWave" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.02" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.38" />
                </linearGradient>
              </defs>
              {[
                'M-40,160 C150,110 238,248 354,340 C478,438 602,462 742,412 C842,376 892,300 982,236',
                'M-40,210 C134,164 240,294 364,392 C496,495 620,520 754,466 C854,426 902,350 982,286',
                'M-40,260 C118,222 248,348 378,454 C518,570 646,602 774,548 C868,508 912,438 982,378',
                'M-40,314 C116,286 254,408 392,520 C544,646 672,684 796,628 C882,588 918,520 982,466',
                'M-40,372 C126,350 266,474 406,592 C558,724 684,764 812,710 C894,676 926,600 982,550',
                'M-40,434 C142,422 284,548 426,668 C580,798 700,840 822,790 C900,758 930,684 982,648',
                'M-40,498 C160,496 298,618 448,746 C598,874 712,916 828,866 C904,832 930,762 982,724',
                'M-40,566 C166,576 312,700 470,830 C620,954 724,994 834,944 C908,910 932,844 982,810',
              ].map((d, index) => (
                <path
                  key={d}
                  d={d}
                  stroke="url(#authWave)"
                  strokeWidth={index % 2 === 0 ? 1 : 0.85}
                  opacity={0.78 - index * 0.065}
                />
              ))}
            </svg>
          </div>

          <div className="relative flex w-full items-center p-8 xl:p-10">
            <Link
              to="/"
              className="absolute left-8 top-8 inline-flex items-start gap-0.5 text-[1.7rem] font-semibold tracking-[-0.06em] xl:left-10 xl:top-10"
            >
              <span>zenix</span>
              <span className="-translate-y-1 text-[1.2rem] leading-none">*</span>
            </Link>

            <div className="max-w-[34rem] pt-24 pb-8">
              <h1 className="max-w-[8ch] text-[clamp(4.2rem,6.8vw,5.9rem)] leading-[0.9] tracking-[-0.05em] text-balance">
                Build better.
                <br />
                Ship faster.
              </h1>
              <p className="mt-8 max-w-[22ch] text-[1.05rem] leading-8 text-white/55">
                Everything you need to turn ideas into implementation-ready context.
              </p>
            </div>
          </div>
        </section>

        <section className="relative flex min-h-screen items-center justify-center px-4 py-5 sm:px-6 lg:px-8">
          <div className="w-full max-w-[40rem]">
            <div className="mb-4 flex items-center justify-between text-[1.45rem] font-semibold tracking-[-0.06em] lg:hidden">
              <Link to="/" className="inline-flex items-start gap-0.5">
                <span>zenix</span>
                <span className="-translate-y-1 text-[1rem] leading-none">*</span>
              </Link>
              <span className="text-sm font-normal text-white/45">Context first</span>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.025))] p-4 sm:p-6 lg:p-8">
            <div className="rounded-[18px] border border-white/6 bg-black/20 px-4 py-6 sm:px-6 sm:py-8 lg:px-9 lg:py-10">
              <div className="space-y-3 text-center">
                <h2 className="text-[clamp(2rem,3.2vw,3.1rem)] leading-none tracking-[-0.05em] text-balance">
                  {panelTitle}
                </h2>
                <p className="mx-auto max-w-[30ch] text-[1.05rem] leading-7 text-white/58">
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
