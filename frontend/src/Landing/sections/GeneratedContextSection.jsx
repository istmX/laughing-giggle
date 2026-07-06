import { contextTiles } from '../constants'

export function GeneratedContextSection() {
  return (
    <section className="border-b border-white/8 px-4 py-20 sm:px-6">
      <div className="mb-12 max-w-3xl space-y-5">
        <p className="text-[clamp(2.4rem,5vw,4.25rem)] leading-[0.98] tracking-[-0.04em] text-white">
          Generated context that feels structured before a single line of code ships.
        </p>
        <p className="max-w-2xl text-base leading-7 text-white/60">
          Architecture, roles, UI rules, missions, and delivery plans arrive as artifacts your team can actually use.
        </p>
      </div>

      <div className="grid auto-rows-[minmax(15rem,auto)] gap-4 lg:grid-cols-3">
        {contextTiles.map((tile, index) => (
          <article
            key={tile.title}
            className={`rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 transition-transform duration-300 hover:-translate-y-1 ${index === 0 || index === 3 ? 'lg:row-span-2' : ''}`}
          >
            <p className="mb-10 text-sm tracking-[0.22em] text-white/42 uppercase">{tile.title}</p>
            <div className="space-y-5">
              <div className={`rounded-[1.5rem] border border-white/10 ${index % 2 === 0 ? 'h-36 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),transparent_55%)]' : 'h-24 bg-[linear-gradient(90deg,rgba(255,255,255,0.08),transparent)]'}`} />
              <p className="max-w-sm text-sm leading-7 text-white/68">{tile.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
