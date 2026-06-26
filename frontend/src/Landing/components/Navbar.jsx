import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { navLinks } from '@/Landing/data'

const Navbar = () => {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-10">
        <a href="#top" className="text-[1.9rem] font-semibold tracking-[-0.07em] text-black">
          zenix*
        </a>

        <nav className="hidden items-center gap-10 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-black transition-opacity hover:opacity-60"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="xl" className="rounded-full border-black/20 bg-white px-5">
            Log in
          </Button>
          <Button size="xl" className="gap-2 rounded-full bg-black px-5 text-white hover:bg-black/85">
            Get started
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Navbar
