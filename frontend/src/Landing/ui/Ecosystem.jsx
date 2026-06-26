import SectionHeading from '@/Landing/components/SectionHeading'
import { ecosystemTools } from '@/Landing/data'

const Ecosystem = () => {
  return (
    <section id="ecosystem" className="py-20 lg:py-28">
      <div className="grid gap-8 lg:grid-cols-[0.26fr_0.74fr] lg:items-start">
        <SectionHeading
          eyebrow="Works with your favorite tools"
          title="Use Zenix with the AI tools you already trust."
          description="The generated context plugs into the agents and editors teams are already using."
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          {ecosystemTools.map((tool, index) => {
            const Icon = tool.icon
            const iconColor =
              index === 0
                ? 'text-[#ff6a00]'
                : index === 1
                  ? 'text-[#3b82f6]'
                  : index === 2
                    ? 'text-[#10b981]'
                    : index === 3
                      ? 'text-black'
                      : index === 4
                        ? 'text-[#12c9bd]'
                        : 'text-black'

            return (
              <article
                key={tool.name}
                className="flex min-h-[9rem] flex-col items-center justify-center gap-4 rounded-[18px] border border-border bg-white p-5 text-center shadow-[0_14px_35px_rgba(0,0,0,0.04)]"
              >
                <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                  <Icon className={`size-6 ${iconColor}`} />
                </div>
                <div>
                  <h3 className="text-base font-semibold tracking-[-0.03em]">{tool.name}</h3>
                  <p className="mt-1 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    {tool.note}
                  </p>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Ecosystem
