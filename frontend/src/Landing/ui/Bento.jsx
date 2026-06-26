import SectionHeading from '@/Landing/components/SectionHeading'
import BentoCard from '@/Landing/components/BentoCard'
import { bentoCards } from '@/Landing/data'

const Bento = () => {
  return (
    <section className="py-20 lg:py-28">
      <SectionHeading
        eyebrow="Bento grid"
        title="Every panel shows a different part of the system."
        description="The language of the page comes from the product itself: architecture, agents, documentation, missions, and workflow."
      />

      <div className="mt-12 grid gap-4 lg:grid-cols-12">
        {bentoCards.map((card, index) => {
          const spanClass =
            index === 0 || index === 3
              ? 'lg:col-span-4'
              : index === 1 || index === 2
                ? 'lg:col-span-8'
                : 'lg:col-span-6'

          return (
            <div key={card.title} className={spanClass}>
              <BentoCard title={card.title} text={card.text} variant={card.variant} />
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default Bento
