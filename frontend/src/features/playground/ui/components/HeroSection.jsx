import React from 'react'

export const HeroSection = ({ brandName = 'RED LOVE', alignment = 'left' }) => {
  const isCenter = alignment === 'center'

  return (
    <section className="sandbox-section">
      {/* MARQUEE LOOP */}
      <div className="sandbox-container mx-auto w-full px-6 mb-10">
        <div className="h-11 flex items-center overflow-hidden border shadow-sm" style={{ backgroundColor: 'var(--secondary)', color: '#ffffff', borderColor: 'var(--border)', borderWidth: 'var(--border-width, 1px)', borderRadius: 'var(--radius)' }}>
          <div className="marquee-track flex whitespace-nowrap animate-marquee text-xs font-bold uppercase tracking-widest">
            <span className="px-8">★ {brandName} AGENCY · TRUSTED BY LEADING TEAMS AT DUOLINGO · STRIPE · AIRBNB · NOTION · SPOTIFY · LINEAR · VERCEL</span>
            <span className="px-8">★ {brandName} AGENCY · TRUSTED BY LEADING TEAMS AT DUOLINGO · STRIPE · AIRBNB · NOTION · SPOTIFY · LINEAR · VERCEL</span>
          </div>
        </div>
      </div>

      {/* HERO MAIN BODY */}
      <div className={`sandbox-container mx-auto w-full px-6 pb-12 border-b ${isCenter ? 'flex flex-col items-center text-center' : ''}`} style={{ borderColor: 'var(--border)', borderBottomWidth: 'var(--border-width, 1px)' }}>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 border rounded-full text-xs font-bold tracking-wider uppercase mb-6 shadow-xs" style={{ borderColor: 'var(--border)', borderWidth: 'var(--border-width, 1px)', backgroundColor: 'var(--surface)', color: 'var(--fg)' }}>
          <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--accent)' }} />
          {brandName} Design System
        </div>

        <h1 className={`display-xl font-bold tracking-tight mb-6 leading-[1.05] ${isCenter ? 'mx-auto' : 'max-w-3xl'}`} style={{ fontFamily: 'var(--heading-font)' }}>
          Ask it.<br />See it react instantly.
        </h1>

        <p className={`body-lg text-base md:text-lg opacity-85 leading-relaxed mb-10 w-full min-w-0 ${isCenter ? 'max-w-2xl mx-auto' : 'max-w-2xl'}`} style={{ fontFamily: 'var(--body-font)' }}>
          A live agency design system preview driven by your conversational requests. Adjust spacing, typography scales, layout container widths, border radii, or section density and watch the changes cascade in real time.
        </p>

        <div className={`flex flex-wrap items-center gap-4 ${isCenter ? 'justify-center' : ''}`}>
          <button 
            className="h-12 px-8 text-xs font-bold tracking-widest uppercase transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5 hover:shadow-lg active:scale-95 cursor-pointer flex items-center gap-2" 
            style={{ backgroundColor: 'var(--primary)', color: 'var(--bg)', borderRadius: 'var(--radius)' }}
          >
            Get started for free ➔
          </button>
          <button 
            className="h-12 px-8 text-xs font-bold tracking-widest uppercase border transition-all duration-300 hover:bg-[var(--primary)] hover:text-[var(--bg)] hover:border-[var(--primary)] hover:-translate-y-0.5 active:scale-95 cursor-pointer shadow-sm" 
            style={{ backgroundColor: 'var(--surface)', color: 'var(--fg)', borderColor: 'var(--border)', borderWidth: 'var(--border-width, 1px)', borderRadius: 'var(--radius)' }}
          >
            Contact sales
          </button>
        </div>
      </div>
    </section>
  )
}
