import { Quote, Sparkles, Star } from 'lucide-react'

const Gallery = () => {
  return (
    <section className="py-20 lg:py-28">
      <div className="relative overflow-hidden rounded-[24px] border border-black bg-black px-6 py-8 text-white lg:px-8 lg:py-10">
        <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(51,223,223,0.18),transparent_65%)] blur-2xl" />
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-4">
            <div className="flex size-12 items-center justify-center rounded-full border border-white/10 bg-white/5">
              <Quote className="size-5 text-teal" />
            </div>
            <h2 className="max-w-2xl text-[clamp(2.2rem,3.6vw,3.4rem)] leading-[0.96] tracking-[-0.05em] text-balance">
              Context is the new code.
            </h2>
            <p className="max-w-md text-[1.05rem] leading-8 text-white/72">
              Zenix gives your AI the full picture, so it can build it right.
            </p>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-full border border-white/10 bg-white/5">
                <Sparkles className="size-6 text-teal" />
              </div>
              <div>
                <p className="text-sm text-white/70">Sohan Parakh</p>
                <p className="text-xs uppercase tracking-[0.24em] text-white/45">Founder, indie hacker</p>
              </div>
            </div>

            <div className="flex gap-1 text-[#FFD86B]">
              <Star className="size-4 fill-current" />
              <Star className="size-4 fill-current" />
              <Star className="size-4 fill-current" />
              <Star className="size-4 fill-current" />
              <Star className="size-4 fill-current" />
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-0 right-8 h-28 w-28 rounded-full border border-teal/40" />
        <div className="pointer-events-none absolute bottom-2 right-2 h-16 w-40 rounded-[100%] border border-teal/50" />
      </div>
    </section>
  )
}

export default Gallery
