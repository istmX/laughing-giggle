import Navbar from '@/Landing/components/Navbar'
import Hero from '@/Landing/ui/Hero'
import Process from '@/Landing/ui/Process'
import GeneratedForYou from '@/Landing/ui/GeneratedForYou'
import Ecosystem from '@/Landing/ui/Ecosystem'
import Problem from '@/Landing/ui/Problem'
import FinalCta from '@/Landing/ui/FinalCta'

const Home = () => {
  return (
    <div
      id="top"
      className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(97,168,255,0.06),transparent_28%),radial-gradient(circle_at_right_top,rgba(139,124,255,0.05),transparent_24%),linear-gradient(180deg,#ffffff_0%,#ffffff_100%)] text-black"
    >
      <Navbar />
      <main className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <Hero />
        <Process />
        <GeneratedForYou />
        <Ecosystem />
        <Problem />
        <FinalCta />
      </main>
    </div>
  )
}

export default Home
