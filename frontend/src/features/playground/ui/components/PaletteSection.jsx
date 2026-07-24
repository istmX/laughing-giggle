import React from 'react'

export const PaletteSection = ({ systemSwatches }) => {
  return (
    <section id="colors" className="sandbox-container sandbox-section mx-auto w-full px-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold tracking-widest uppercase opacity-85" style={{ color: 'var(--fg)' }}>01 · Palette Swatches</p>
        <span className="text-[11px] font-mono opacity-50 uppercase">6 Tokens</span>
      </div>
      <h2 className="display-lg mb-8 font-semibold tracking-tight" style={{ fontFamily: 'var(--heading-font)' }}>Monochrome core, brand accents</h2>
      <div className="sandbox-grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {systemSwatches.map((swatch) => (
          <div key={swatch.name} className="flex flex-col justify-between p-3.5 border rounded-xl hover:-translate-y-1 hover:shadow-md transition-all duration-300 group cursor-pointer" style={{ borderColor: 'var(--border)', borderWidth: 'var(--border-width, 1px)', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius)' }}>
            <div className="h-14 rounded-lg border transition-colors duration-500 mb-3 shadow-inner" style={{ backgroundColor: swatch.bg, borderColor: swatch.border, borderWidth: 'var(--border-width, 1px)' }} />
            <div>
              <p className="text-xs font-medium tracking-tight mb-1 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--fg)' }}>{swatch.name}</p>
              <p className="font-mono opacity-60 text-[11px] truncate">{swatch.hex}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
