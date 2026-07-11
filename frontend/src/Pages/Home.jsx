
import { HeroSection03 } from '@/components/ui/hero-03'
import { ContextComparison } from '@/components/ui/context-comparison'
import { LandingArtifactsSection } from '@/features/landing/ui/LandingArtifactsSection'
import { LandingBentoSection } from '@/features/landing/ui/LandingBentoSection'
import { LandingProcessSection } from '@/features/landing/ui/LandingProcessSection'
import { LandingUseCasesSection } from '@/features/landing/ui/LandingUseCasesSection'

const Home = () =>
  (
    <div>
      <HeroSection03 />
      <ContextComparison />
      <LandingProcessSection />
      <LandingArtifactsSection />
      <LandingBentoSection />
      <LandingUseCasesSection />
    </div>
  )

export default Home
