import React from 'react'

export const HeroSection = ({ 
  brandName,
  heroTitle, 
  heroSubhead, 
  heroImage, 
  heroVariant, 
  alignment = 'left' 
}) => {
  const isCenter = alignment === 'center'
  const displayBrand = brandName || heroTitle || 'Zenix AI'
  const displayTitle = heroTitle || 'Ask it.\nSee it react instantly.'
  const displaySubhead = heroSubhead || 'A live agency design system preview driven by your conversational requests. Adjust spacing, typography scales, layout container widths, border radii, or section density and watch the changes cascade in real time.'
  const hasBanner70vh = heroVariant === 'banner-70vh' || (heroImage && heroVariant !== 'none')

  return (
    <section className="sandbox-section">
      {/* MARQUEE LOOP */}
      <div className="sandbox-container mx-auto w-full px-6 mb-10">
        <div className="h-11 flex items-center overflow-hidden border shadow-sm" style={{ backgroundColor: 'var(--secondary)', color: '#ffffff', borderColor: 'var(--border)', borderWidth: 'var(--border-width, 1px)', borderRadius: 'var(--radius)' }}>
          <div className="marquee-track flex whitespace-nowrap animate-marquee text-xs font-bold uppercase tracking-widest">
            <span className="px-8">★ {displayBrand} · CREATIVE DESIGN & HIGH-PERFORMANCE INTERFACES · DUOLINGO · STRIPE · AIRBNB · NOTION · SPOTIFY · LINEAR</span>
            <span className="px-8">★ {displayBrand} · CREATIVE DESIGN & HIGH-PERFORMANCE INTERFACES · DUOLINGO · STRIPE · AIRBNB · NOTION · SPOTIFY · LINEAR</span>
          </div>
        </div>
      </div>

      {/* OPTIONAL 70vh HERO BANNER IMAGE */}
      {hasBanner70vh && (
        <div className="sandbox-container mx-auto w-full px-6 mb-10">
          <div 
            className="w-full h-[70vh] min-h-[380px] max-h-[720px] overflow-hidden border shadow-lg relative group"
            style={{ borderRadius: 'var(--radius)', borderColor: 'var(--border)', borderWidth: 'var(--border-width, 1px)' }}
          >
            <img 
              src={heroImage || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600"} 
              alt="Hero Media" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
              onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      )}

      {/* HERO MAIN BODY */}
      <div className={`sandbox-container mx-auto w-full px-6 pb-12 border-b ${isCenter ? 'flex flex-col items-center text-center' : ''}`} style={{ borderColor: 'var(--border)', borderBottomWidth: 'var(--border-width, 1px)' }}>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 border rounded-full text-xs font-bold tracking-wider uppercase mb-6 shadow-xs" style={{ borderColor: 'var(--border)', borderWidth: 'var(--border-width, 1px)', backgroundColor: 'var(--surface)', color: 'var(--fg)' }}>
          <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: 'var(--accent)' }} />
          {displayBrand}
        </div>

        <h1 className={`display-xl font-bold tracking-tight mb-6 leading-[1.05] whitespace-pre-line ${isCenter ? 'mx-auto' : 'max-w-3xl'}`} style={{ fontFamily: 'var(--heading-font)' }}>
          {displayTitle}
        </h1>

        <p className={`body-lg text-base md:text-lg opacity-85 leading-relaxed mb-10 w-full min-w-0 ${isCenter ? 'max-w-2xl mx-auto' : 'max-w-2xl'}`} style={{ fontFamily: 'var(--body-font)' }}>
          {displaySubhead}
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
