import React from 'react'

export const LiveSandbox = ({ tokens = {} }) => {
  const themeName = tokens?.themeName || "Light Canvas"
  
  // Safe extraction for colors
  const colors = tokens?.colors || {}
  const primary = colors.primary || "#000000"
  const canvas = colors.canvas || "#ffffff"
  const surface = colors.surface || "#f7f7f5"
  const text = colors.text || "#000000"
  const border = colors.border || "#e6e6e6"
  const brand = colors.brand || primary
  const secondary = colors.secondary || border
  const accent = colors.accent || "#ff3d8b"

  // Safe extraction for typography
  const typo = tokens?.typography || {}
  const headingFont = typo.headingFont || "Inter, sans-serif"
  const bodyFont = typo.bodyFont || "Inter, sans-serif"

  const radius = tokens?.radius || "8px"

  // Dynamic font imports from Google Fonts and Fontshare
  const fontImports = React.useMemo(() => {
    const fontsToLoad = []
    const fontshareFonts = ['Satoshi']
    const googleFonts = []
    
    const checkAndAdd = (fontFamilyString) => {
      if (!fontFamilyString) return
      const fontName = fontFamilyString.split(',')[0].replace(/['"]/g, '').trim()
      if (['sans-serif', 'serif', 'monospace', 'system-ui'].includes(fontName.toLowerCase())) return
      
      if (fontshareFonts.includes(fontName)) {
        fontsToLoad.push(`@import url('https://api.fontshare.com/v2/css?f=${fontName.toLowerCase()}@300,400,500,700,900&display=swap');`)
      } else {
        googleFonts.push(fontName)
      }
    }

    checkAndAdd(headingFont)
    checkAndAdd(bodyFont)

    const uniqueGoogle = [...new Set(googleFonts)]
    if (uniqueGoogle.length > 0) {
      const fontParams = uniqueGoogle.map(f => `family=${f.replace(/\s+/g, '+')}:wght@300;400;500;700;900`).join('&')
      fontsToLoad.push(`@import url('https://fonts.googleapis.com/css2?${fontParams}&display=swap');`)
    }

    return fontsToLoad.join('\n')
  }, [headingFont, bodyFont])

  // Tabs state
  const [activeTab, setActiveTab] = React.useState(0)

  // Ticker value count-up
  const [tickerVal, setTickerVal] = React.useState(0)
  React.useEffect(() => {
    let frameId
    const startTime = performance.now()
    const duration = 1200
    const endValue = 12

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      setTickerVal(Math.round(eased * endValue))
      if (progress < 1) {
        frameId = requestAnimationFrame(tick)
      }
    }

    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [])

  // local CSS variables injection wrapper
  const isolatedStyle = {
    '--bg': canvas,
    '--fg': text,
    '--primary': primary,
    '--surface': surface,
    '--border': border,
    '--brand': brand,
    '--secondary': secondary,
    '--accent': accent,
    '--heading-font': headingFont,
    '--body-font': bodyFont,
    '--radius': radius,
    backgroundColor: 'var(--bg)',
    color: 'var(--fg)',
    fontFamily: 'var(--body-font)',
    minHeight: '100%',
    width: '100%',
  }

  // System swatches array helper
  const systemSwatches = [
    { name: 'Primary / Ink', hex: primary, bg: 'var(--primary)', border: 'transparent' },
    { name: 'Canvas', hex: canvas, bg: 'var(--bg)', border: 'var(--border)' },
    { name: 'Surface Soft', hex: surface, bg: 'var(--surface)', border: 'var(--border)' },
    { name: 'Brand Accent', hex: brand, bg: 'var(--brand)', border: 'transparent' },
    { name: 'Secondary Outline', hex: secondary, bg: 'var(--secondary)', border: 'var(--border)' },
    { name: 'Promo Accent', hex: accent, bg: 'var(--accent)', border: 'transparent' },
  ]

  // Color blocks array helper
  const colorBlocks = [
    { category: 'Systems', desc: 'Design systems that scale with your team, not against it.', bg: 'var(--surface)', color: 'var(--fg)' },
    { category: 'Ship products', desc: 'From idea to production, without leaving the canvas.', bg: 'var(--primary)', color: 'var(--bg)' },
    { category: 'Developers', desc: 'Inspect, extract, and ship the exact spec your design team made.', bg: 'var(--accent)', color: 'var(--bg)' },
    { category: 'Zenix · preview', desc: 'Sticky notes, timers, and templates for a room that thinks out loud.', bg: 'var(--surface)', color: 'var(--fg)' },
    { category: 'Release notes', desc: 'Config registration is now open — save your spot before seats run out.', bg: 'var(--secondary)', color: 'var(--fg)', isPromo: true },
  ]

  return (
    <div style={isolatedStyle} className="p-4 md:p-8 transition-all duration-500 rounded-b-2xl select-none min-h-full w-full">
      <style>{`
        ${fontImports}
        @keyframes marqueeScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marqueeScroll 25s linear infinite;
        }
        .display-xl { font-family: var(--heading-font); font-size: clamp(2.2rem, 5vw, 4.5rem); font-weight: 340; line-height: 1.05; letter-spacing: -0.03em; }
        .display-lg { font-family: var(--heading-font); font-size: clamp(1.8rem, 4vw, 3.2rem); font-weight: 340; line-height: 1.1; letter-spacing: -0.02em; }
        .headline { font-family: var(--heading-font); font-size: 24px; font-weight: 540; line-height: 1.35; letter-spacing: -0.01em; }
        .subhead { font-family: var(--heading-font); font-size: 24px; font-weight: 340; line-height: 1.35; letter-spacing: -0.01em; }
        .card-title { font-family: var(--heading-font); font-size: 20px; font-weight: 700; line-height: 1.4; }
        .body-lg { font-family: var(--body-font); font-size: 18px; font-weight: 330; line-height: 1.45; }
        .body { font-family: var(--body-font); font-size: 16px; font-weight: 320; line-height: 1.5; }
        .body-sm { font-family: var(--body-font); font-size: 14px; font-weight: 330; line-height: 1.5; }
        .eyebrow { font-family: var(--body-font); font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.08em; }
        .caption { font-family: var(--body-font); font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; }
      `}</style>

      {/* TOP HEADER */}
      <header className="sticky top-0 z-40 border-b py-4 backdrop-blur-md mb-6" style={{ borderColor: 'var(--border)', backgroundColor: 'rgba(var(--bg), 0.85)' }}>
        <div className="max-w-4xl mx-auto w-full flex items-center justify-between px-4">
          <span className="card-title text-[20px] font-bold" style={{ color: 'var(--brand)' }}>Zenix AI</span>
          <nav className="hidden md:flex items-center gap-6 body-sm opacity-80">
            <a href="#colors" className="hover:opacity-60 transition-opacity">Design</a>
            <a href="#typography" className="hover:opacity-60 transition-opacity">Typography</a>
            <a href="#components" className="hover:opacity-60 transition-opacity">Components</a>
            <a href="#blocks" className="hover:opacity-60 transition-opacity">Pricing</a>
          </nav>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border text-[13px] font-medium transition-all active:scale-95" style={{ borderColor: 'var(--border)', borderRadius: 'var(--radius)' }}>Contact sales</button>
            <button className="px-4 py-2 text-[13px] font-medium transition-all active:scale-95" style={{ backgroundColor: 'var(--primary)', color: 'var(--bg)', borderRadius: 'var(--radius)' }}>Get started</button>
          </div>
        </div>
      </header>

      {/* MARQUEE LOOP */}
      <div className="max-w-4xl mx-auto w-full px-4 mb-12">
        <div className="h-9 flex items-center overflow-hidden" style={{ backgroundColor: 'var(--fg)', color: 'var(--bg)', borderRadius: 'calc(var(--radius) / 2)' }}>
          <div className="marquee-track flex whitespace-nowrap animate-marquee body-sm font-medium">
            <span className="px-8">Trusted by design teams at Duolingo · Stripe · Airbnb · Notion · Spotify · Linear · Vercel</span>
            <span className="px-8">Trusted by design teams at Duolingo · Stripe · Airbnb · Notion · Spotify · Linear · Vercel</span>
          </div>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="py-16 mb-16 border-b animate-[fadeIn_0.6s_ease-out]" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-4xl mx-auto w-full px-4">
          <p className="eyebrow opacity-75 mb-4">Design System Sandbox</p>
          <h1 className="display-xl font-bold mb-6">Ask it.<br />See it react.</h1>
          <p className="body-lg max-w-xl opacity-80 leading-relaxed mb-8">
            A live design system preview driven by your conversational requests. Adjust spacing, fonts, or colors and watch the changes cascade.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <button className="px-6 py-3 font-medium transition-all active:scale-95 shadow-sm" style={{ backgroundColor: 'var(--primary)', color: 'var(--bg)', borderRadius: 'var(--radius)' }}>Get started for free</button>
            <button className="px-6 py-3 font-medium transition-all active:scale-95 border" style={{ backgroundColor: 'var(--bg)', color: 'var(--fg)', borderColor: 'var(--border)', borderRadius: 'var(--radius)' }}>Contact sales</button>
            <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse self-center" style={{ backgroundColor: 'var(--accent)' }} />
          </div>
        </div>
      </section>

      {/* PALETTE SECTION */}
      <section id="colors" className="py-8 mb-16">
        <div className="max-w-4xl mx-auto w-full px-4">
          <p className="eyebrow opacity-75 mb-3">01 · Palette Swatches</p>
          <h2 className="display-lg mb-8">Monochrome core, brand accents</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {systemSwatches.map((swatch) => (
              <div key={swatch.name} className="flex flex-col gap-2 p-3 border rounded-xl hover:-translate-y-1 transition-transform duration-300" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
                <div className="h-16 rounded-lg border transition-colors duration-500" style={{ backgroundColor: swatch.bg, borderColor: swatch.border }} />
                <div>
                  <p className="caption opacity-85 mt-1">{swatch.name}</p>
                  <p className="body-sm font-mono opacity-50 text-[11px] truncate">{swatch.hex}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TYPOGRAPHY SECTION */}
      <section id="typography" className="py-8 mb-16">
        <div className="max-w-4xl mx-auto w-full px-4">
          <p className="eyebrow opacity-75 mb-3">02 · Typography Scale</p>
          <h2 className="display-lg mb-8">System weights & scale</h2>
          <div className="divide-y border-t border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="py-6 flex flex-col md:flex-row md:items-baseline gap-4">
              <span className="caption w-44 shrink-0 opacity-50">display-xl / {headingFont.split(',')[0]}</span>
              <span className="display-xl">Aa Bb Cc</span>
            </div>
            <div className="py-6 flex flex-col md:flex-row md:items-baseline gap-4">
              <span className="caption w-44 shrink-0 opacity-50">display-lg / {headingFont.split(',')[0]}</span>
              <span className="display-lg">Aa Bb Cc Dd</span>
            </div>
            <div className="py-6 flex flex-col md:flex-row md:items-baseline gap-4">
              <span className="caption w-44 shrink-0 opacity-50">headline / {headingFont.split(',')[0]}</span>
              <span className="headline">Section headings display at weight 540</span>
            </div>
            <div className="py-6 flex flex-col md:flex-row md:items-baseline gap-4">
              <span className="caption w-44 shrink-0 opacity-50">body / {bodyFont.split(',')[0]}</span>
              <span className="body max-w-lg">
                Main content body runs at weight 320. Font size and spacing adjust automatically to fit readability metrics.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* COMPONENTS SECTION */}
      <section id="components" className="py-8 mb-16">
        <div className="max-w-4xl mx-auto w-full px-4">
          <p className="eyebrow opacity-75 mb-3">03 · Interface Components</p>
          <h2 className="display-lg mb-8">Pills, inputs, interactive tabs</h2>
          <div className="grid md:grid-cols-2 gap-12">
            
            {/* Column 1: Buttons */}
            <div className="flex flex-col gap-6">
              <h3 className="card-title">Action Buttons</h3>
              <div className="flex flex-wrap items-center gap-3">
                <button className="px-5 py-2.5 font-medium transition-all active:scale-95" style={{ backgroundColor: 'var(--primary)', color: 'var(--bg)', borderRadius: 'var(--radius)' }}>Primary pill</button>
                <button className="px-5 py-2.5 font-medium border transition-all active:scale-95" style={{ backgroundColor: 'var(--bg)', color: 'var(--fg)', borderColor: 'var(--border)', borderRadius: 'var(--radius)' }}>Secondary pill</button>
                <button className="px-5 py-2.5 font-medium transition-all hover:opacity-85" style={{ color: 'var(--primary)' }}>Text link</button>
              </div>
              <div className="flex items-center gap-3">
                <button className="w-10 h-10 rounded-full border flex items-center justify-center transition-transform hover:scale-105 active:scale-95" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>➔</button>
                <button className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-transform hover:scale-105 active:scale-95" style={{ backgroundColor: 'var(--accent)' }}>★</button>
              </div>
            </div>

            {/* Column 2: Tabs & Inputs */}
            <div className="flex flex-col gap-6">
              <h3 className="card-title">Interactive Navigation</h3>
              
              {/* Sliding Indicator Tab Bar */}
              <div className="relative flex gap-1 p-1 border w-fit" style={{ borderColor: 'var(--border)', borderRadius: 'var(--radius)', backgroundColor: 'var(--surface)' }}>
                <div 
                  className="absolute top-1 bottom-1 transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]"
                  style={{
                    backgroundColor: 'var(--primary)',
                    borderRadius: 'calc(var(--radius) - 2px)',
                    width: 'calc(33.33% - 6px)',
                    transform: `translateX(${activeTab * 100}%)`,
                    left: `${4 + activeTab * 2}px`,
                  }}
                />
                {['Professional', 'Starter', 'Organization'].map((tab, idx) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(idx)}
                    className="px-4 py-1.5 text-[13px] font-medium transition-colors duration-200 relative z-10"
                    style={{ 
                      color: activeTab === idx ? 'var(--bg)' : 'var(--fg)',
                      borderRadius: 'var(--radius)',
                      backgroundColor: 'transparent',
                      border: 'none',
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <input 
                type="text" 
                placeholder="Work email address" 
                className="body w-full max-w-sm border px-4 py-3 transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-20"
                style={{ borderColor: 'var(--border)', borderRadius: 'var(--radius)', backgroundColor: 'var(--surface)', color: 'var(--fg)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* COLOR-BLOCK LAYOUTS */}
      <section id="blocks" className="py-8 mb-16">
        <div className="max-w-4xl mx-auto w-full px-4 space-y-6">
          <p className="eyebrow opacity-75">04 · Section Background blocks</p>
          <div className="grid md:grid-cols-2 gap-6">
            {colorBlocks.map((block, idx) => (
              <div 
                key={idx} 
                className={`p-8 md:p-10 rounded-2xl flex flex-col justify-between min-h-[180px] border ${block.isPromo ? 'md:col-span-2' : ''}`}
                style={{ backgroundColor: block.bg, color: block.color, borderColor: 'var(--border)', borderRadius: 'var(--radius)' }}
              >
                <div>
                  <p className="eyebrow mb-2 opacity-80">{block.category}</p>
                  <h3 className="subhead max-w-xl">{block.desc}</h3>
                </div>
                {block.isPromo && (
                  <button className="mt-4 px-4 py-2 w-fit text-[13px] font-medium self-end transition-all active:scale-95" style={{ backgroundColor: 'var(--primary)', color: 'var(--bg)', borderRadius: 'var(--radius)' }}>Save spot</button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING & TEMPLATES CARDS */}
      <section className="py-8 mb-16">
        <div className="max-w-4xl mx-auto w-full px-4">
          <p className="eyebrow opacity-75 mb-3">05 · System Cards</p>
          <h2 className="display-lg mb-8">Pricing metrics & tables</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            
            {/* Card 1 */}
            <div className="rounded-2xl border p-6 hover:-translate-y-1 transition-transform duration-300 flex flex-col justify-between" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
              <div>
                <p className="caption opacity-60 mb-2">Starter</p>
                <p className="card-title mb-4">Free</p>
                <p className="body-sm opacity-70 mb-6">For individuals exploring ideas.</p>
              </div>
              <div className="space-y-2 border-t pt-4" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2 body-sm"><span style={{ color: 'var(--primary)' }}>✓</span> 3 workspace files</div>
                <div className="flex items-center gap-2 body-sm"><span style={{ color: 'var(--primary)' }}>✓</span> Standard AI generation</div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="rounded-2xl border p-6 hover:-translate-y-1 transition-transform duration-300 flex flex-col justify-between" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
              <div>
                <p className="caption opacity-60 mb-2">Professional</p>
                <p className="card-title mb-4 font-mono">${tickerVal}/editor</p>
                <p className="body-sm opacity-70 mb-6">For teams and agency creators.</p>
              </div>
              <div className="space-y-2 border-t pt-4" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2 body-sm"><span style={{ color: 'var(--primary)' }}>✓</span> Unlimited context files</div>
                <div className="flex items-center gap-2 body-sm"><span style={{ color: 'var(--primary)' }}>✓</span> Full model whitelists</div>
              </div>
            </div>

            {/* Card 3: Shimmer loading state */}
            <div className="rounded-2xl border p-6 flex flex-col justify-between bg-zinc-50/50" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
              <div>
                <p className="caption opacity-60 mb-2">Enterprise</p>
                <div className="h-6 w-32 bg-zinc-200 animate-pulse rounded-md mb-4" style={{ backgroundColor: 'var(--border)' }} />
                <p className="body-sm opacity-70 mb-6">Loading pricing custom layers...</p>
              </div>
              <div className="space-y-2 border-t pt-4" style={{ borderColor: 'var(--border)' }}>
                <div className="h-4 w-40 bg-zinc-200 animate-pulse rounded-md" style={{ backgroundColor: 'var(--border)' }} />
                <div className="h-4 w-28 bg-zinc-200 animate-pulse rounded-md" style={{ backgroundColor: 'var(--border)' }} />
              </div>
            </div>
          </div>

          {/* COMPARISON TABLE */}
          <h3 className="card-title mb-4">Compare blueprints limits</h3>
          <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            <div className="grid grid-cols-4 body-sm font-semibold opacity-70 bg-zinc-50" style={{ backgroundColor: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
              <div className="p-4">Feature</div>
              <div className="p-4 text-center">Starter</div>
              <div className="p-4 text-center">Pro</div>
              <div className="p-4 text-center">Enterprise</div>
            </div>
            <div className="grid grid-cols-4 body-sm border-b" style={{ borderColor: 'var(--border)' }}>
              <div className="p-4 font-medium">Consolidated blueprint files</div>
              <div className="p-4 text-center">4 files</div>
              <div className="p-4 text-center">4 files</div>
              <div className="p-4 text-center">Custom renaming</div>
            </div>
            <div className="grid grid-cols-4 body-sm">
              <div className="p-4 font-medium">Model whitelisting</div>
              <div className="p-4 text-center">Standard</div>
              <div className="p-4 text-center">Advanced</div>
              <div className="p-4 text-center">Custom</div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="pt-16 border-t mt-16 pb-8" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-4xl mx-auto w-full px-4">
          <p className="display-lg mb-8" style={{ color: 'var(--brand)' }}>Zenix AI</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 caption opacity-60">
            <div className="flex flex-col gap-2">
              <span className="font-bold text-fg" style={{ color: 'var(--fg)' }}>Product</span>
              <span>Preview</span><span>Tokens</span><span>Missions</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-bold text-fg" style={{ color: 'var(--fg)' }}>Resources</span>
              <span>Docs</span><span>Changelog</span><span>Community</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-bold text-fg" style={{ color: 'var(--fg)' }}>Company</span>
              <span>About</span><span>Careers</span><span>Partners</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-bold text-fg" style={{ color: 'var(--fg)' }}>Legal</span>
              <span>Privacy</span><span>Terms</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
