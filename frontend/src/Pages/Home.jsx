import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import Hero from "../Landing/Hero"
import TrustedEcosystem from "../Landing/TrustedEcosystem"
import TheProblem from "../Landing/TheProblem"
import BentoGridSection from "../Landing/BentoGridSection"
import CommunityTemplates from "../Landing/CommunityTemplates"
import FAQ from "../Landing/FAQ"
import FinalCTA from "../Landing/FinalCTA"
import Footer from "../Landing/Footer"

const Home = ()=>{
  const location = useLocation()

  useEffect(() => {
    if (location.hash === '#templates') {
      setTimeout(() => {
        if (window.lenis) {
          window.lenis.scrollTo('#templates', { duration: 1.2 })
        } else {
          const el = document.getElementById('templates')
          if (el) el.scrollIntoView({ behavior: 'smooth' })
        }
      }, 150)
    }
  }, [location])

  return (
    <main className="w-full min-h-screen flex flex-col">
      <Hero />
      <TrustedEcosystem />
      <TheProblem />
      <BentoGridSection />
      <CommunityTemplates />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  )
}
export default Home