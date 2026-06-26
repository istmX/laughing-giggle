import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

const FinalCta = () => {
  return (
    <section id="final-cta" className="py-20 lg:py-28">
      <div className="rounded-[24px] border border-border bg-white px-6 py-8 shadow-[0_16px_42px_rgba(0,0,0,0.06)] lg:px-10 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[0.42fr_0.24fr_0.34fr] lg:items-center">
          <h2 className="max-w-[10ch] text-[clamp(2.2rem,3.6vw,3.5rem)] leading-[0.94] tracking-[-0.06em]">
            Ready to build without repeating yourself?
          </h2>
          <p className="max-w-[18ch] text-[1rem] leading-7 text-muted-foreground">
            Give Zenix your idea once. Get everything your AI needs to build it right.
          </p>
          <div className="flex items-center justify-start lg:justify-center">
            <Button
              size="3xl"
              className="gap-3 rounded-full bg-[linear-gradient(135deg,#5f54ff_0%,#6d4dff_48%,#5d3fff_100%)] px-7 text-white shadow-[0_10px_30px_rgba(95,84,255,0.35)] hover:opacity-95"
            >
              Get started for free
              <ArrowRight className="size-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FinalCta
