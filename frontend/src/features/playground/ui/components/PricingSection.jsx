import React from 'react'

export const PricingSection = ({ tickerVal }) => {
  return (
    <section className="sandbox-container sandbox-section mx-auto w-full px-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold tracking-widest uppercase opacity-85" style={{ color: 'var(--fg)' }}>05 · Pricing & Blueprint Table</p>
        <span className="text-[11px] font-mono opacity-50 uppercase">Plans</span>
      </div>
      <h2 className="display-lg mb-8 font-semibold tracking-tight" style={{ fontFamily: 'var(--heading-font)' }}>Pricing metrics & comparison</h2>
      
      {/* PRICING CARDS */}
      <div className="sandbox-grid grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        
        {/* Card 1 */}
        <div className="rounded-2xl border p-8 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col justify-between" style={{ borderColor: 'var(--border)', borderWidth: 'var(--border-width, 1px)', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius)' }}>
          <div>
            <span className="text-xs font-semibold tracking-widest uppercase opacity-60 mb-2 block">Starter</span>
            <p className="text-4xl font-bold tracking-tight mb-2" style={{ fontFamily: 'var(--heading-font)' }}>Free</p>
            <p className="text-sm opacity-80 mb-6">For individuals exploring ideas and prototype blueprints.</p>
          </div>
          <div className="space-y-3 border-t pt-6" style={{ borderColor: 'var(--border)', borderTopWidth: 'var(--border-width, 1px)' }}>
            <div className="flex items-center gap-2.5 text-sm font-medium"><span style={{ color: 'var(--primary)' }}>✓</span> 3 workspace files</div>
            <div className="flex items-center gap-2.5 text-sm font-medium"><span style={{ color: 'var(--primary)' }}>✓</span> Standard AI generation</div>
          </div>
        </div>

        {/* Card 2: Professional */}
        <div className="rounded-2xl border p-8 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col justify-between relative overflow-hidden" style={{ borderColor: 'var(--primary)', borderWidth: 'var(--border-width, 1px)', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius)' }}>
          <div className="absolute top-0 right-0 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white" style={{ backgroundColor: 'var(--primary)' }}>POPULAR</div>
          <div>
            <span className="text-xs font-semibold tracking-widest uppercase opacity-60 mb-2 block">Professional</span>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-4xl md:text-5xl font-bold tracking-tight font-mono" style={{ fontFamily: 'var(--heading-font)' }}>${tickerVal}</span>
              <span className="text-xs font-mono opacity-60">/editor/mo</span>
            </div>
            <p className="text-sm opacity-80 mb-6">For professional teams and agency creators.</p>
          </div>
          <div className="space-y-3 border-t pt-6" style={{ borderColor: 'var(--border)', borderTopWidth: 'var(--border-width, 1px)' }}>
            <div className="flex items-center gap-2.5 text-sm font-semibold"><span style={{ color: 'var(--primary)' }}>✓</span> Unlimited context files</div>
            <div className="flex items-center gap-2.5 text-sm font-semibold"><span style={{ color: 'var(--primary)' }}>✓</span> Full model whitelists</div>
            <div className="flex items-center gap-2.5 text-sm font-semibold"><span style={{ color: 'var(--primary)' }}>✓</span> Parallel async pipeline</div>
          </div>
        </div>

        {/* Card 3: Enterprise */}
        <div className="rounded-2xl border p-8 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col justify-between" style={{ borderColor: 'var(--border)', borderWidth: 'var(--border-width, 1px)', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius)' }}>
          <div>
            <span className="text-xs font-semibold tracking-widest uppercase opacity-60 mb-2 block">Enterprise</span>
            <p className="text-4xl font-bold tracking-tight mb-2" style={{ fontFamily: 'var(--heading-font)' }}>Custom</p>
            <p className="text-sm opacity-80 mb-6">For large organizations requiring custom SLAs and VPC deployment.</p>
          </div>
          <div className="space-y-3 border-t pt-6" style={{ borderColor: 'var(--border)', borderTopWidth: 'var(--border-width, 1px)' }}>
            <div className="flex items-center gap-2.5 text-sm font-medium"><span style={{ color: 'var(--primary)' }}>✓</span> Dedicated support</div>
            <div className="flex items-center gap-2.5 text-sm font-medium"><span style={{ color: 'var(--primary)' }}>✓</span> Custom RAG pipelines</div>
          </div>
        </div>

      </div>

      {/* COMPARISON TABLE */}
      <h3 className="text-xl font-bold tracking-tight mb-4" style={{ fontFamily: 'var(--heading-font)' }}>Compare blueprint specifications</h3>
      <div className="rounded-2xl border overflow-hidden shadow-sm" style={{ borderColor: 'var(--border)', borderWidth: 'var(--border-width, 1px)', borderRadius: 'var(--radius)' }}>
        <div className="grid grid-cols-4 text-xs font-bold uppercase tracking-wider opacity-80 bg-surface/80 border-b" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderBottomWidth: 'var(--border-width, 1px)' }}>
          <div className="py-4 px-6">Feature</div>
          <div className="py-4 px-6 text-center">Starter</div>
          <div className="py-4 px-6 text-center">Pro</div>
          <div className="py-4 px-6 text-center">Enterprise</div>
        </div>
        <div className="grid grid-cols-4 text-sm border-b transition-colors hover:bg-surface/30" style={{ borderColor: 'var(--border)', borderBottomWidth: 'var(--border-width, 1px)' }}>
          <div className="py-4 px-6 font-semibold">Consolidated blueprint files</div>
          <div className="py-4 px-6 text-center opacity-80">4 files</div>
          <div className="py-4 px-6 text-center font-semibold">4 files</div>
          <div className="py-4 px-6 text-center opacity-80">Custom renaming</div>
        </div>
        <div className="grid grid-cols-4 text-sm border-b transition-colors hover:bg-surface/30" style={{ borderColor: 'var(--border)', borderBottomWidth: 'var(--border-width, 1px)', backgroundColor: 'rgba(var(--bg-rgb, 255, 255, 255), 0.5)' }}>
          <div className="py-4 px-6 font-semibold">Generation model speed</div>
          <div className="py-4 px-6 text-center opacity-80">Standard</div>
          <div className="py-4 px-6 text-center font-semibold">Parallel 8B Instant</div>
          <div className="py-4 px-6 text-center opacity-80">Dedicated cluster</div>
        </div>
        <div className="grid grid-cols-4 text-sm transition-colors hover:bg-surface/30">
          <div className="py-4 px-6 font-semibold">Model whitelisting</div>
          <div className="py-4 px-6 text-center opacity-80">Standard</div>
          <div className="py-4 px-6 text-center font-semibold">Advanced</div>
          <div className="py-4 px-6 text-center opacity-80">Custom</div>
        </div>
      </div>
    </section>
  )
}
