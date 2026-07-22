import { useRef } from 'react'
import { Moon, Sun } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { usePreferencesStore } from '@/features/preferences/store/preferences.store'

gsap.registerPlugin(ScrollTrigger)

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Templates', href: '/#templates' },
  { label: 'About', href: '/about' },
  { label: 'Docs', href: '/docs' },
]

const SHIFT_STEPS = ['Prompt Engineering', 'AI Coding', 'Context Engineering', 'AI Systems']

const PRINCIPLES = [
  ['01', 'Context First', 'Everything begins with context, not prompts.'],
  ['02', 'Developer Native', 'Built for developers shipping real software.'],
  ['03', 'Open Ecosystem', 'Community templates. Shared knowledge. Reusable systems.'],
  ['04', 'AI Ready', "Designed for today's models and tomorrow's."],
]

const MANIFESTOS = [
  { words: ['PROMPTS', 'ARE', 'NOT', 'ARCHITECTURE.'], align: 'justify-start', tone: 'text-ink' },
  { words: ['CONTEXT', 'IS', 'THE', 'SOURCE', 'OF', 'TRUTH.'], align: 'justify-end', tone: 'text-ink-muted' },
  { words: ['SYSTEMS', 'SCALE.', 'PROMPTS', "DON'T."], align: 'justify-center', tone: 'text-ink' },
]

function AboutHeader() {
  const theme = usePreferencesStore((state) => state.theme)
  const setTheme = usePreferencesStore((state) => state.setTheme)

  return (
    <header className="about-header fixed left-1/2 top-4 z-30 flex w-[calc(100%-2rem)] max-w-6xl -translate-x-1/2 items-center justify-between border border-ink/10 bg-canvas/85 px-3 py-2 backdrop-blur-md dark:border-white/10">
      <a href="/" className="flex items-center gap-2 px-2 text-sm font-semibold tracking-[-0.03em] text-ink" aria-label="Zenix home">
        <span className="grid h-6 w-6 rotate-[-8deg] place-items-center rounded-[7px] bg-ink text-xs font-black text-canvas transition-transform duration-300 hover:rotate-0">Z</span>
        Zenix
      </a>
      <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
        {NAV_LINKS.map((link) => <a key={link.label} href={link.href} className={`px-3 py-1.5 text-body-sm transition-colors ${link.label === 'About' ? 'text-ink' : 'text-ink-muted hover:text-ink'}`}>{link.label}</a>)}
      </nav>
      <button type="button" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="grid h-8 w-8 place-items-center rounded-full border border-ink/10 text-ink-muted transition-colors hover:border-ink/30 hover:text-ink dark:border-white/10 dark:hover:border-white/30" aria-label="Toggle theme">
        {theme === 'light' ? <Sun size={14} /> : <Moon size={14} />}
      </button>
    </header>
  )
}

function SectionLabel({ children }) {
  return <p className="mb-10 font-mono text-caption uppercase tracking-[0.2em] text-ink-muted">{children}</p>
}

function About() {
  const pageRef = useRef(null)
  const shiftRef = useRef(null)

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .from('.about-title', { y: 40, opacity: 0, duration: 1.1 })
        .from('.about-kicker, .about-subtitle', { y: 16, opacity: 0, duration: 0.7, stagger: 0.1 }, '-=0.7')

      gsap.to('.about-ghost', { yPercent: -12, opacity: 0.012, ease: 'none', scrollTrigger: { trigger: '.about-hero', start: 'top top', end: 'bottom top', scrub: 1.2 } })
      gsap.to('.about-title', { scale: 0.84, yPercent: -8, opacity: 0.65, ease: 'none', scrollTrigger: { trigger: '.about-hero', start: 'top top', end: 'bottom top', scrub: 1.2 } })

      ScrollTrigger.batch('.about-reveal', { start: 'top 82%', once: true, interval: 0.08, onEnter: (elements) => gsap.from(elements, { y: 18, opacity: 0, duration: 0.75, stagger: 0.08, ease: 'power3.out', overwrite: true }) })

      const steps = gsap.utils.toArray('.shift-step')
      const ghost = document.querySelector('.shift-ghost')
      const timeline = gsap.timeline({ scrollTrigger: { trigger: shiftRef.current, start: 'top top', end: '+=260%', pin: true, scrub: 0.7 } })
      steps.forEach((step, index) => {
        timeline.to(steps, { opacity: 0.22, duration: 0.25 })
          .to(step, { opacity: 1, duration: 0.35 }, '<')
          .call(() => { if (ghost) ghost.textContent = SHIFT_STEPS[index].split(' ')[0].toUpperCase() }, [], '<')
      })

      gsap.utils.toArray('.manifesto-panel').forEach((panel) => gsap.from(panel, { y: 20, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: panel, start: 'top 78%', once: true } }))

      const indexMap = [['about-why', 'Why'], ['about-shift', 'Shift'], ['about-beliefs', 'Beliefs'], ['about-principles', 'Principles'], ['about-vision', 'Vision']]
      indexMap.forEach(([id]) => {
        const link = document.querySelector(`.about-index a[href="#${id}"]`)
        const section = document.getElementById(id)
        if (!link || !section) return
        ScrollTrigger.create({ trigger: section, start: 'top 52%', end: 'bottom 52%', onToggle: ({ isActive }) => { link.classList.toggle('text-ink', isActive); link.classList.toggle('text-ink-muted', !isActive) } })
      })
    }, pageRef)

    return () => ctx.revert()
  }, { scope: pageRef })

  return (
    <div ref={pageRef} className="about-page min-h-dvh overflow-hidden bg-canvas text-ink">
      <AboutHeader />
      <div className="about-index fixed bottom-8 right-5 z-20 hidden flex-col gap-3 font-mono text-caption uppercase tracking-[0.18em] text-ink-muted lg:flex" aria-label="About page sections">
        {['Why', 'Shift', 'Beliefs', 'Principles', 'Vision'].map((item, index) => <a key={item} href={`#about-${item.toLowerCase()}`} className="transition-colors hover:text-ink"><span className="mr-2 text-ink/30">0{index + 1}</span>{item}</a>)}
      </div>

      <main>
        <section className="about-hero relative flex min-h-dvh items-center overflow-hidden px-6 pt-20 sm:px-12 lg:px-[8vw]" aria-labelledby="about-title">
          <div className="about-ghost pointer-events-none absolute left-[5vw] top-1/2 z-0 -translate-y-1/2 select-none font-display text-[clamp(10rem,26vw,30rem)] leading-none tracking-[-0.06em] text-ink/[0.035]">CONTEXT</div>
          <div className="absolute inset-x-0 top-1/2 border-t border-ink/10 dark:border-white/10" />
          <div className="relative z-10 w-full max-w-[86rem]">
            <p className="about-kicker mb-6 font-mono text-caption uppercase tracking-[0.28em] text-ink-muted">A manifesto for the next build</p>
            <h1 id="about-title" className="about-title whitespace-nowrap font-display text-[clamp(7rem,19vw,21rem)] leading-[0.74] tracking-[-0.04em] text-ink">ABOUT</h1>
            <p className="about-subtitle mt-12 max-w-sm text-body-lg font-light leading-snug tracking-[-0.02em] text-ink-muted sm:ml-[28vw]">Building the future of AI-native software development.</p>
          </div>
          <span className="absolute bottom-8 left-6 font-mono text-caption uppercase tracking-[0.2em] text-ink-muted sm:left-12 lg:left-[8vw]">Scroll to read</span>
        </section>

        <section id="about-why" className="border-t border-ink/10 px-6 py-[18vh] sm:px-12 lg:px-[12vw]" aria-labelledby="why-title">
          <div className="grid gap-20 lg:grid-cols-[minmax(12rem,0.55fr)_minmax(0,1.45fr)] lg:gap-[8vw]">
            <div><SectionLabel>Why Zenix exists</SectionLabel><p className="about-reveal max-w-[14rem] text-body-sm leading-relaxed text-ink-muted">The problem is not that AI cannot write. It is that every session forgets what came before.</p></div>
            <div><h2 id="why-title" className="max-w-[58rem] text-[clamp(2.5rem,5.6vw,6.2rem)] font-light leading-[0.98] tracking-[-0.045em]">{['Every AI session starts from zero.', 'Projects become larger.', 'Architectures become more complex.', 'Context gets longer.'].map((line) => <span key={line} className="about-reveal block">{line}</span>)}<span className="mt-12 block max-w-[42rem] text-ink-muted">Yet we still copy the same prompts, rewrite the same explanations, and hope the AI remembers.</span></h2><p className="about-reveal mt-20 max-w-[38rem] text-[clamp(1.5rem,2.6vw,2.8rem)] font-light leading-[1.05] tracking-[-0.035em] lg:ml-[20%]">I built Zenix because AI doesn’t need better prompts.<br /><span className="text-ink">It needs better context.</span></p></div>
          </div>
        </section>

        <section ref={shiftRef} id="about-shift" className="relative flex min-h-dvh items-center overflow-hidden border-y border-ink/10 bg-surface-muted px-6 py-[14vh] dark:bg-white/[0.03] sm:px-12 lg:px-[12vw]" aria-labelledby="shift-title">
          <div className="shift-ghost pointer-events-none absolute right-[-4vw] top-1/2 -translate-y-1/2 font-display text-[clamp(10rem,23vw,27rem)] leading-none tracking-[-0.06em] text-ink/[0.035]">PROMPT</div>
          <div className="relative z-10 grid w-full max-w-[90rem] gap-20 lg:grid-cols-[minmax(14rem,0.7fr)_minmax(0,1.3fr)] lg:gap-[10vw]">
            <div><SectionLabel>The shift</SectionLabel><h2 id="shift-title" className="max-w-sm text-[clamp(2.8rem,5vw,5.5rem)] font-light leading-[0.92] tracking-[-0.05em]">From instructions to infrastructure.</h2></div>
            <div className="border-t border-ink/15">{SHIFT_STEPS.map((step, index) => <div key={step} className={`shift-step flex items-end justify-between border-b border-ink/15 py-8 text-[clamp(2.2rem,5vw,5.5rem)] font-light leading-none tracking-[-0.05em] ${index === 0 ? 'opacity-100' : 'opacity-30'}`}><span>{step}</span><span className="font-mono text-caption tracking-[0.18em]">0{index + 1}</span></div>)}</div>
          </div>
        </section>

        <section id="about-beliefs" className="px-6 py-[14vh] sm:px-12 lg:px-[12vw]" aria-labelledby="beliefs-title">
          <div className="mb-20 flex items-end justify-between border-b border-ink/10 pb-8"><div><SectionLabel>What we believe</SectionLabel><h2 id="beliefs-title" className="text-2xl font-light tracking-[-0.03em] sm:text-4xl">A few things worth keeping true.</h2></div><span className="hidden font-mono text-caption uppercase tracking-[0.18em] text-ink-muted sm:block">Manifesto / 01—03</span></div>
          <div>{MANIFESTOS.map((manifesto, index) => <article key={manifesto.words.join('-')} className={`manifesto-panel flex min-h-[62vh] items-center border-b border-ink/10 py-[12vh] ${manifesto.align}`}><p className={`max-w-[min(78vw,72rem)] font-display text-[clamp(4.2rem,10.8vw,11rem)] leading-[0.76] tracking-[-0.04em] ${manifesto.tone}`}>{manifesto.words.map((word) => <span key={word} className={`manifesto-word block ${index === 1 && word === 'TRUTH.' ? 'ml-[12vw]' : ''}`}>{word}</span>)}</p></article>)}</div>
          <p className="about-reveal ml-auto mt-10 max-w-xs text-body-sm leading-relaxed text-ink-muted">The point is not to make AI louder. It is to make the work more legible.</p>
        </section>

        <section id="about-principles" className="border-t border-ink/10 px-6 py-[18vh] sm:px-12 lg:px-[12vw]" aria-labelledby="principles-title">
          <div className="grid gap-16 lg:grid-cols-[0.7fr_1.3fr] lg:gap-[10vw]"><div><SectionLabel>Operating principles</SectionLabel><h2 id="principles-title" className="max-w-sm text-[clamp(3.2rem,6vw,6.5rem)] font-light leading-[0.9] tracking-[-0.05em]">Build the conditions for better work.</h2></div><div className="border-t border-ink/10">{PRINCIPLES.map(([number, title, body]) => <article key={number} className="principle-row group grid grid-cols-[3rem_1fr] gap-6 border-b border-ink/10 py-8 transition-colors duration-500 hover:bg-surface-muted dark:hover:bg-white/[0.04] sm:grid-cols-[4rem_1fr_14rem] sm:gap-8"><span className="font-mono text-caption tracking-[0.18em] text-ink-muted">{number}</span><h3 className="text-3xl font-light tracking-[-0.04em] transition-transform duration-500 group-hover:translate-x-2 sm:text-5xl">{title}</h3><p className="col-start-2 max-w-xs text-body-sm leading-relaxed text-ink-muted sm:col-start-auto sm:self-center">{body}</p></article>)}</div></div>
        </section>

        <section className="border-t border-ink/10 px-6 py-[18vh] sm:px-12 lg:px-[12vw]" aria-labelledby="istm-title"><div className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-[10vw]"><div><SectionLabel>Identity behind the product</SectionLabel><h2 id="istm-title" className="font-display text-[clamp(5rem,12vw,13rem)] leading-[0.72] tracking-[-0.04em]">WHO<br />IS<br />ISTM?</h2></div><div className="self-end border-t border-ink/15 pt-8 lg:mb-3"><p className="max-w-3xl text-[clamp(1.8rem,3.8vw,4.2rem)] font-light leading-[1.02] tracking-[-0.04em]">ISTM is an independent builder exploring how humans and AI can build software together.</p><p className="mt-12 max-w-xl text-body-lg leading-relaxed text-ink-muted">Rather than chasing prompts, the focus is on designing systems that help AI understand projects, architectures, and developer workflows. Zenix is the first step toward that vision.</p></div></div></section>

        <section id="about-vision" className="relative flex min-h-[88vh] items-center overflow-hidden border-y border-ink/10 px-6 py-[18vh] text-center sm:px-12" aria-labelledby="vision-title"><div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[clamp(12rem,30vw,36rem)] leading-none tracking-[-0.07em] text-ink/[0.025]">FUTURE</div><h2 id="vision-title" className="relative mx-auto max-w-[90rem] font-display text-[clamp(4rem,12.6vw,14rem)] leading-[0.74] tracking-[-0.045em]">THE FUTURE<br />ISN’T AI<br /><span className="text-ink-muted">GENERATED.</span><br /><span className="my-[0.18em] block font-sans text-[clamp(0.75rem,1vw,1rem)] font-light tracking-[0.25em] text-ink-muted">IT IS</span>UNDERSTOOD.</h2></section>

        <footer className="px-6 py-[18vh] sm:px-12 lg:px-[12vw]"><div className="mx-auto flex max-w-[90rem] flex-col items-center text-center"><div className="mb-8 h-px w-16 bg-ink/30" /><p className="font-mono text-caption uppercase tracking-[0.24em] text-ink-muted">Built by</p><p className="mt-4 text-4xl font-medium tracking-[-0.05em]">ISTM</p><p className="mt-4 max-w-sm text-body-sm leading-relaxed text-ink-muted">Building tools for the next generation of AI-native developers.</p><a href="/" className="mt-16 font-mono text-caption uppercase tracking-[0.2em] text-ink-muted transition-colors hover:text-ink">Return to Zenix ↗</a></div></footer>
      </main>
    </div>
  )
}

export default About
