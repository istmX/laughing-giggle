import { useRef } from 'react'
import { Bot, Braces, Cable, Palette, ShieldCheck } from 'lucide-react'

import { useLandingSectionReveal } from '@/features/landing/hooks/useLandingSectionReveal'

const tiles = [
  {
    icon: Bot,
    title: 'Agent instructions',
    copy: 'Clear operating rules for Codex, Claude Code, Cursor, and any markdown-native workflow.',
    className: 'md:col-span-2 bg-block-lime',
  },
  {
    icon: Braces,
    title: 'Code standards',
    copy: 'Shared patterns, naming, validation, and implementation expectations.',
    className: 'bg-block-lilac',
  },
  {
    icon: Palette,
    title: 'UI rules',
    copy: 'Tokens, component behavior, and interaction guidance live beside product context.',
    className: 'bg-block-cream',
  },
  {
    icon: Cable,
    title: 'Integration map',
    copy: 'APIs, auth, storage, and handoff boundaries are described before work begins.',
    className: 'bg-block-mint',
  },
  {
    icon: ShieldCheck,
    title: 'Scope control',
    copy: 'Acceptance criteria and delivery missions keep implementation tight instead of drifting.',
    className: 'md:col-span-2 bg-block-pink',
  },
]

export function LandingBentoSection() {
  const sectionRef = useRef(null)

  useLandingSectionReveal(sectionRef)

  return (
    <section ref={sectionRef} className="px-6 py-section md:px-8">
      <div className="mx-auto max-w-[1360px]">
        <div data-reveal-card className="max-w-[52rem]">
          <p className="text-caption uppercase tracking-caption text-brand-indigo">
            More than docs
          </p>
          <h2 className="mt-5 text-balance text-[clamp(2.4rem,4vw,4.2rem)] font-[540] leading-[0.98] tracking-[-0.03em]">
            A bento of everything the build
            <span className="block">actually depends on.</span>
          </h2>
          <p className="mt-6 max-w-[40rem] text-body-sm text-ink-muted">
            The landing should show breadth without falling into repetitive card grammar. Each
            block earns its size based on what it explains.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
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
                <h3 className="mt-16 max-w-[15ch] text-headline font-[540] tracking-headline text-balance">
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
