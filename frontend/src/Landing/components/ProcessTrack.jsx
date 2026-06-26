import { ArrowRight } from 'lucide-react'

const ProcessTrack = ({ steps = [] }) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-6">
      {steps.map((step, index) => {
        const Icon = step.icon

        return (
          <div key={step.number} className="space-y-4">
            <div className="flex h-10 items-center justify-center text-black">
              <Icon className="size-6" />
            </div>
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{step.number}</p>
              <h3 className="text-[1.15rem] font-medium tracking-[-0.04em]">{step.title}</h3>
              <p className="text-sm leading-6 text-muted-foreground">{step.text}</p>
            </div>
            {index < steps.length - 1 ? (
              <div className="hidden items-center gap-2 pt-1 text-muted-foreground xl:flex">
                <ArrowRight className="size-4" />
              </div>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

export default ProcessTrack
