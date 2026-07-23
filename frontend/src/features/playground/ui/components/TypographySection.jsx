import React from 'react'

export const TypographySection = ({ headingFont, bodyFont }) => {
  return (
    <section id="typography" className="sandbox-container sandbox-section mx-auto w-full px-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold tracking-widest uppercase opacity-85" style={{ color: 'var(--fg)' }}>02 · Typography Scale</p>
        <span className="text-[11px] font-mono opacity-50 uppercase">Matrix</span>
      </div>
      <h2 className="display-lg mb-8 font-semibold tracking-tight" style={{ fontFamily: 'var(--heading-font)' }}>System weights & scale</h2>
      <div className="divide-y border-t border-b" style={{ borderColor: 'var(--border)', borderWidth: 'var(--border-width, 1px)' }}>
        
        <div className="py-8 flex flex-col md:flex-row md:items-baseline justify-between gap-6">
          <span className="text-xs font-mono uppercase tracking-wider w-48 shrink-0 opacity-60">display-xl / {headingFont.split(',')[0]}</span>
          <span className="display-xl font-bold tracking-tight flex-1">Aa Bb Cc</span>
        </div>

        <div className="py-8 flex flex-col md:flex-row md:items-baseline justify-between gap-6">
          <span className="text-xs font-mono uppercase tracking-wider w-48 shrink-0 opacity-60">display-lg / {headingFont.split(',')[0]}</span>
          <span className="display-lg font-semibold tracking-tight flex-1">Aa Bb Cc Dd</span>
        </div>

        <div className="py-8 flex flex-col md:flex-row md:items-baseline justify-between gap-6">
          <span className="text-xs font-mono uppercase tracking-wider w-48 shrink-0 opacity-60">headline / {headingFont.split(',')[0]}</span>
          <span className="headline text-xl font-semibold tracking-tight flex-1">Section headings display at bold 600 weight</span>
        </div>

        <div className="py-8 flex flex-col md:flex-row md:items-baseline justify-between gap-6">
          <span className="text-xs font-mono uppercase tracking-wider w-48 shrink-0 opacity-60">body / {bodyFont.split(',')[0]}</span>
          <p className="text-base md:text-lg leading-relaxed max-w-2xl w-full min-w-0 opacity-85 flex-1" style={{ fontFamily: 'var(--body-font)' }}>
            Main content body runs at standard 400 weight with generous line-height for maximum readability across screen breakpoints. Paragraph widths are constrained to 45–75 characters per line.
          </p>
        </div>

      </div>
    </section>
  )
}
