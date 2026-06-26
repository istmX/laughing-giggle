import SectionHeading from '@/Landing/components/SectionHeading'
import ProcessTrack from '@/Landing/components/ProcessTrack'
import { processSteps } from '@/Landing/data'

const Process = () => {
  return (
    <section id="process" className="py-20 lg:py-28">
      <div className="grid gap-10 lg:grid-cols-[0.42fr_0.58fr] lg:items-start">
        <SectionHeading
          eyebrow="How Zenix works"
          title="From idea to execution in 6 simple steps."
          description="The flow stays obvious: capture the idea, fill the gaps, define architecture, and turn it into AI-ready context."
        />

        <div className="pt-4">
          <ProcessTrack steps={processSteps} />
        </div>
      </div>
    </section>
  )
}

export default Process
