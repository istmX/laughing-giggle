import React from 'react'

export const LiveSandbox = ({ tokens = {} }) => {
  // Extract values with fallbacks to defaults so we can see something before AI generates
  const themeName = tokens?.themeName || "Light Canvas"
  
  // Safe extraction for colors
  const colors = tokens?.colors || {}
  const primary = colors.primary || "#000000"
  const canvas = colors.canvas || "#ffffff"
  const surface = colors.surface || "#f7f7f5"
  const text = colors.text || "#000000"

  // Safe extraction for typography
  const typo = tokens?.typography || {}
  const headingFont = typo.headingFont || "Inter, sans-serif"
  const bodyFont = typo.bodyFont || "Inter, sans-serif"

  const radius = tokens?.radius || "50px" // Default pill

  // We enforce light mode specific isolation here by resetting all CSS variables locally
  const isolatedStyle = {
    '--bg': canvas,
    '--fg': text,
    '--primary': primary,
    '--surface': surface,
    '--radius': radius,
    fontFamily: bodyFont,
    backgroundColor: 'var(--bg)',
    color: 'var(--fg)',
    minHeight: '100%',
    width: '100%',
  }

  return (
    <div style={isolatedStyle} className="p-12 transition-all duration-500 isolate-sandbox">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto py-16">
        <div className="inline-block px-3 py-1 mb-6 rounded-full border opacity-80 text-sm font-medium" style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}>
          Theme: {themeName}
        </div>
        <h1 
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6" 
          style={{ fontFamily: headingFont }}
        >
          Design that thinks<br/>with you.
        </h1>
        <p className="text-xl opacity-80 mb-10 max-w-2xl leading-relaxed">
          This entire sandbox is reacting instantly to the JSON design tokens updated by the AI. Change the colors, fonts, and border radii just by asking.
        </p>
        <div className="flex items-center gap-4">
          <button 
            className="px-6 py-3 font-medium transition-transform hover:-translate-y-0.5"
            style={{ 
              backgroundColor: 'var(--primary)', 
              color: 'var(--bg)', 
              borderRadius: 'var(--radius)' 
            }}
          >
            Get started
          </button>
          <button 
            className="px-6 py-3 font-medium transition-transform hover:-translate-y-0.5 border"
            style={{ 
              backgroundColor: 'var(--bg)', 
              color: 'var(--primary)',
              borderColor: 'var(--primary)',
              borderRadius: 'var(--radius)' 
            }}
          >
            View documentation
          </button>
        </div>
      </div>

      {/* Feature / Component Testing Block */}
      <div className="max-w-4xl mx-auto mt-16 p-12 transition-colors duration-500" style={{ backgroundColor: 'var(--surface)', borderRadius: 'calc(var(--radius) / 1.5)' }}>
        <h3 className="text-2xl font-bold mb-8" style={{ fontFamily: headingFont }}>Component Preview</h3>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-6 bg-white border border-black/10 transition-colors duration-500 shadow-sm" style={{ backgroundColor: 'var(--bg)', borderRadius: 'calc(var(--radius) / 2)' }}>
            <h4 className="font-semibold mb-2">Typography</h4>
            <p className="text-sm opacity-70 mb-4">Body copy reads gracefully and adapts to the chosen font family. Weight scales to match.</p>
            <input 
              type="text" 
              placeholder="Email address"
              className="w-full px-4 py-2 border border-black/20 focus:outline-none focus:ring-2 focus:ring-black/20 transition-all duration-300"
              style={{ backgroundColor: 'var(--bg)', color: 'var(--fg)', borderRadius: 'calc(var(--radius) / 3)' }}
            />
          </div>
          <div className="p-6 bg-white border border-black/10 transition-colors duration-500 shadow-sm" style={{ backgroundColor: 'var(--bg)', borderRadius: 'calc(var(--radius) / 2)' }}>
            <h4 className="font-semibold mb-4">Color Mapping</h4>
            <div className="flex gap-2 mb-4">
              <div className="w-8 h-8 rounded-full border border-black/10" style={{ backgroundColor: 'var(--primary)' }}></div>
              <div className="w-8 h-8 rounded-full border border-black/10" style={{ backgroundColor: 'var(--bg)' }}></div>
              <div className="w-8 h-8 rounded-full border border-black/10" style={{ backgroundColor: 'var(--surface)' }}></div>
              <div className="w-8 h-8 rounded-full border border-black/10" style={{ backgroundColor: 'var(--fg)' }}></div>
            </div>
            <p className="text-sm opacity-70">Tokens are instantly piped into CSS variables.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
