import { Separator } from '@/components/ui/separator'
import { BadgeQuestionMark } from '@aliimam/icons'
import { Instagram, Threads, X } from '@aliimam/logos'

export function HeroSection03() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle,_black_1px,_transparent_1px)] opacity-15 [background-size:20px_20px] dark:bg-[radial-gradient(circle,_white_1px,_transparent_1px)]" />

      <header className="relative z-10 flex items-center justify-between px-6 pt-6 md:px-8">
        <div className="text-2xl font-semibold italic tracking-tight">zenix</div>
        <nav className="hidden gap-6 text-sm text-muted-foreground md:flex">
          <a href="#" className="font-semibold text-foreground transition-opacity hover:opacity-60">Overview</a>
          <a href="#" className="transition-opacity hover:opacity-60">Context</a>
          <a href="#" className="transition-opacity hover:opacity-60">Missions</a>
          <a href="#" className="transition-opacity hover:opacity-60">Docs</a>
        </nav>
      </header>

      <main className="relative z-10 pb-20 pt-16 md:pt-20">
        <div className="flex w-full flex-col items-center justify-center gap-2 px-6 md:items-center">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
            <p className="max-w-[220px] text-start text-xs leading-5 text-muted-foreground md:max-w-[180px] md:text-right md:text-sm">
              Zenix turns rough product ideas into implementation-ready context for modern AI teams.
            </p>
            <h1 className="text-6xl font-light leading-none tracking-[0.2em] md:text-7xl xl:text-[10rem]">
              CONTEXT
            </h1>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
            <h1 className="flex text-6xl font-light leading-none tracking-[0.2em] md:text-7xl xl:text-[10rem]">
              <span>FOR</span>
              <BadgeQuestionMark type="solid" className="size-14 text-primary md:size-18 lg:size-40" />
              <span>BUILD</span>
            </h1>
            <p className="max-w-[250px] pt-2 text-xs leading-5 text-muted-foreground md:max-w-[180px] md:pt-8 md:text-sm">
              Shape architecture, requirements, workflows, and delivery missions in one place.
            </p>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
            <h1 className="flex flex-col text-6xl font-light leading-none tracking-[0.2em] md:flex-row md:text-7xl xl:text-[10rem]">
              <span>SMART</span>
              <div className="hidden lg:block">
                <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 24 24" fill="#4D49FC">
                  <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
                </svg>
              </div>
              <div className="block lg:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" viewBox="0 0 24 24" fill="#4D49FC">
                  <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
                </svg>
              </div>
              <span>TEAMS</span>
            </h1>
          </div>
        </div>

        <div className="mx-auto mt-10 w-full max-w-7xl px-6">
          <div className="grid items-center gap-3 md:mx-8 md:flex md:justify-end">
            <Separator className="my-6 w-full max-w-3xl md:mx-auto" />
            <div className="text-xs whitespace-nowrap text-muted-foreground md:text-sm">SAN FRANCISCO • NEW YORK • REMOTE</div>
            <div className="flex w-full items-end gap-3">
              <span className="text-2xl font-thin md:text-4xl">PRODUCT</span>
              <span className="text-3xl font-bold italic text-primary md:text-5xl">context</span>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-6 px-6 md:flex-row md:items-end md:px-20">
          <div className="mb-8 h-48 w-full overflow-hidden rounded-md border shadow-lg md:mb-0 md:w-84">
            <img
              src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80"
              alt="Product documentation workflow"
              className="h-full w-full object-cover"
            />
          </div>
          <p className="max-w-xl text-xs leading-5 text-muted-foreground md:pt-8 md:text-sm">
            Every mission, architecture note, and UI rule becomes a reusable artifact that AI coding tools can execute with clarity.
          </p>
        </div>

        <div className="absolute bottom-8 right-8 flex gap-6 md:right-12">
          <Instagram />
          <X />
          <Threads />
        </div>

        <div className="fixed right-0 top-1/2 flex h-36 -translate-y-1/2 items-center">
          <div className="bg-foreground px-3 py-6 text-sm font-bold text-background">
            <span className="rotate-180 [writing-mode:vertical-rl]">Context First</span>
          </div>
        </div>
      </main>
    </section>
  )
}
