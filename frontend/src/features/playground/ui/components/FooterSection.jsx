import React from 'react'

export const FooterSection = ({ brandName = 'RED LOVE' }) => {
  return (
    <footer className="pt-16 pb-12 border-t mt-20" style={{ borderColor: 'var(--border)', borderTopWidth: 'var(--border-width, 1px)' }}>
      <div className="sandbox-container mx-auto w-full px-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-12">
          <div>
            <p className="text-2xl font-bold tracking-tight mb-2 uppercase" style={{ color: 'var(--brand)', fontFamily: 'var(--heading-font)' }}>{brandName}</p>
            <p className="text-sm opacity-75 max-w-sm" style={{ fontFamily: 'var(--body-font)' }}>
              Everything your agency needs. Live design systems and developer context architecture.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold uppercase tracking-wider opacity-80">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:opacity-100 transition-opacity hover:underline underline-offset-4">GitHub</a>
            <span>·</span>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:opacity-100 transition-opacity hover:underline underline-offset-4">Twitter / X</a>
            <span>·</span>
            <a href="https://discord.com" target="_blank" rel="noreferrer" className="hover:opacity-100 transition-opacity hover:underline underline-offset-4">Discord</a>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs opacity-75 border-t pt-8" style={{ borderColor: 'var(--border)', borderTopWidth: 'var(--border-width, 1px)' }}>
          <div className="flex flex-col gap-2.5">
            <span className="font-bold uppercase tracking-wider text-fg" style={{ color: 'var(--fg)' }}>Product</span>
            <a href="#colors" className="hover:underline">Preview</a>
            <a href="#typography" className="hover:underline">Tokens</a>
            <a href="#components" className="hover:underline">Missions</a>
          </div>
          <div className="flex flex-col gap-2.5">
            <span className="font-bold uppercase tracking-wider text-fg" style={{ color: 'var(--fg)' }}>Resources</span>
            <a href="#docs" className="hover:underline">Docs</a>
            <a href="#changelog" className="hover:underline">Changelog</a>
            <a href="#community" className="hover:underline">Community</a>
          </div>
          <div className="flex flex-col gap-2.5">
            <span className="font-bold uppercase tracking-wider text-fg" style={{ color: 'var(--fg)' }}>Company</span>
            <a href="#about" className="hover:underline">About</a>
            <a href="#careers" className="hover:underline">Careers</a>
            <a href="#partners" className="hover:underline">Partners</a>
          </div>
          <div className="flex flex-col gap-2.5">
            <span className="font-bold uppercase tracking-wider text-fg" style={{ color: 'var(--fg)' }}>Legal</span>
            <a href="#privacy" className="hover:underline">Privacy</a>
            <a href="#terms" className="hover:underline">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
