import React from 'react'

export const ColorBlocksSection = ({ colorBlocks }) => {
  return (
    <section id="blocks" className="sandbox-container sandbox-section mx-auto w-full px-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold tracking-widest uppercase opacity-85" style={{ color: 'var(--fg)' }}>04 · Background & Layout Blocks</p>
        <span className="text-[11px] font-mono opacity-50 uppercase">Composition</span>
      </div>
      <h2 className="display-lg mb-8 font-semibold tracking-tight" style={{ fontFamily: 'var(--heading-font)' }}>Modular section color blocks</h2>
      
      <div className="sandbox-grid grid md:grid-cols-2 gap-6">
        {colorBlocks.map((block, idx) => {
          if (block.isPromo) {
            return (
              <div 
                key={idx} 
                className="md:col-span-2 p-8 md:p-10 border shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-lg transition-all duration-300"
                style={{ backgroundColor: block.bg, color: block.color, borderColor: 'var(--border)', borderWidth: 'var(--border-width, 1px)', borderRadius: 'var(--radius)' }}
              >
                <div className="space-y-3 max-w-2xl w-full min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 border rounded-md" style={{ borderColor: 'var(--border)', borderWidth: 'var(--border-width, 1px)', backgroundColor: 'var(--bg)', color: 'var(--fg)' }}>v2.4 RELEASE</span>
                    <span className="text-xs font-mono opacity-70">JULY 2026</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--heading-font)' }}>{block.category}</h3>
                  <p className="text-base leading-relaxed opacity-85" style={{ fontFamily: 'var(--body-font)' }}>{block.desc}</p>
                </div>
                <button className="h-11 px-6 text-xs font-semibold tracking-widest uppercase shrink-0 transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-95 cursor-pointer shadow-sm" style={{ backgroundColor: 'var(--primary)', color: 'var(--bg)', borderRadius: 'var(--radius)' }}>
                  Reserve spot ➔
                </button>
              </div>
            )
          }

          return (
            <div 
              key={idx} 
              className="p-8 border shadow-sm flex flex-col justify-between min-h-[220px] hover:-translate-y-1 hover:shadow-md transition-all duration-300"
              style={{ backgroundColor: block.bg, color: block.color, borderColor: 'var(--border)', borderWidth: 'var(--border-width, 1px)', borderRadius: 'var(--radius)' }}
            >
              <div className="w-full min-w-0">
                <span className="text-xs font-semibold tracking-widest uppercase opacity-75 mb-3 block">{block.category}</span>
                <h3 className="text-lg md:text-xl font-bold tracking-tight leading-snug" style={{ fontFamily: 'var(--heading-font)' }}>{block.desc}</h3>
              </div>
              <div className="pt-6 border-t mt-6 flex items-center justify-between text-xs font-medium opacity-60" style={{ borderColor: 'var(--border)', borderTopWidth: 'var(--border-width, 1px)' }}>
                <span>Module spec</span>
                <span>Ready ➔</span>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
