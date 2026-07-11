import { useRef } from 'react'
import { Bot, Braces, Cable, Palette, ShieldCheck } from 'lucide-react'

import { useLandingSectionReveal } from '@/features/landing/hooks/useLandingSectionReveal'

const tiles = [
  {
    icon: Bot,
    title: 'Onboard new agents faster',
    copy: 'Clear operating rules keep Codex, Claude Code, Cursor, and other assistants aligned from the first task.',
    className: 'md:col-span-2 bg-block-lime',
  },
  {
    icon: Braces,
    title: 'Cut avoidable rework',
    copy: 'Shared implementation standards reduce inconsistent naming, validation, and delivery quality.',
    className: 'bg-block-lilac',
  },
  {
    icon: Palette,
    title: 'Keep design intent intact',
    copy: 'Tokens, component behavior, and interaction guidance travel with the product context.',
    className: 'bg-block-cream',
  },
  {
    icon: Cable,
    title: 'Clarify system boundaries early',
    copy: 'APIs, auth, storage, and handoff edges are defined before implementation fans out.',
    className: 'bg-block-mint',
  },
  {
    icon: ShieldCheck,
    title: 'Keep scope from drifting',
    copy: 'Acceptance criteria and scoped missions make it easier to finish the right thing, not just more things.',
    className: 'md:col-span-2 bg-block-pink',
  },
]

export function LandingBentoSection() {
  const sectionRef = useRef(null)

  useLandingSectionReveal(sectionRef)

  return (
    <section ref={sectionRef} className="px-6 py-section md:px-8">
      <div className="mx-auto grid max-w-[1360px] gap-6 lg:grid-cols-[0.46fr_0.54fr]">
        <div data-reveal-card className="rounded-xl bg-block-cream p-8 shadow-sm">
          <p className="text-caption uppercase tracking-caption text-brand-indigo">
            Team outcomes
          </p>
          <h2 className="mt-5 text-balance text-[clamp(2.4rem,4vw,4.2rem)] font-[540] leading-[0.98] tracking-[-0.03em]">
            Fewer handoff gaps.
            <span className="block">Better multi-agent delivery.</span>
          </h2>
          <p className="mt-6 max-w-[34rem] text-body-sm text-ink-muted">
            Zenix helps founders, internal teams, and studios keep the same product decisions
            intact from discovery to implementation. The artifacts matter because they support
            these operational outcomes.
          </p>
          <div className="mt-8 grid gap-3">
            {[
              'Keep architecture, UI decisions, and scope aligned',
              'Reduce re-briefing between PMs, designers, and agents',
              'Give every new task a clearer starting point',
            ].map((item) => (
              <div
                key={item}
                data-reveal-item
                className="rounded-lg border border-black/8 bg-white/70 px-4 py-4 text-body-sm text-foreground"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {tiles.map((tile) => {
            const Icon = tile.icon

            return (
              <article
                key={tile.title}
                data-reveal-card
                className={`rounded-xl p-6 shadow-sm ${tile.className}`}
              >
                <div className="grid size-12 place-items-center rounded-full bg-background text-brand-indigo shadow-xs">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-14 max-w-[15ch] text-headline font-[540] tracking-headline text-balance">
                  {tile.title}
                </h3>
                <p className="mt-4 max-w-[30ch] text-body-sm text-ink-muted">{tile.copy}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
