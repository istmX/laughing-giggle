import { HeroSection } from './sections/HeroSection'
import { ToolsMarqueeSection } from './sections/ToolsMarqueeSection'
import { StorySection } from './sections/StorySection'
import { HorizontalDocumentsSection } from './sections/HorizontalDocumentsSection'
import { GeneratedContextSection } from './sections/GeneratedContextSection'
import { AssemblySection } from './sections/AssemblySection'
import { FinalCtaSection } from './sections/FinalCtaSection'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'
import { useSmoothScroll } from './useSmoothScroll'

export default function LandingPage() {
  const prefersReducedMotion = usePrefersReducedMotion()

  useSmoothScroll(!prefersReducedMotion)

  return (
    <main className="bg-[#050505] text-white">
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_18%),linear-gradient(180deg,#020202_0%,#050505_100%)]">
        <HeroSection />
        <ToolsMarqueeSection />
        <StorySection />
        <HorizontalDocumentsSection />
        <GeneratedContextSection />
        <AssemblySection />
        <FinalCtaSection />
      </div>
    </main>
  )
}
