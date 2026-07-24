import React from 'react'

export const HeaderNav = ({ brandName = 'RED LOVE', glassmorphism = true }) => {
  return (
    <header 
      className="sticky top-0 z-40 border-b py-4 backdrop-blur-xl mb-10 transition-all duration-300 shadow-sm" 
      style={{ 
        borderColor: 'var(--border)', 
        borderBottomWidth: 'var(--border-width, 1px)',
        backgroundColor: glassmorphism ? 'rgba(var(--bg-rgb, 247, 247, 247), 0.78)' : 'var(--bg)',
        backdropFilter: glassmorphism ? 'blur(16px) saturate(180%)' : 'none',
        WebkitBackdropFilter: glassmorphism ? 'blur(16px) saturate(180%)' : 'none',
      }}
    >
      <div className="sandbox-container mx-auto w-full flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold tracking-tight uppercase" style={{ color: 'var(--brand)', fontFamily: 'var(--heading-font)' }}>
            {brandName}
          </span>
          <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 border rounded-full opacity-70" style={{ borderColor: 'var(--border)', color: 'var(--fg)', backgroundColor: 'var(--surface)' }}>
            Agency v2.4
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium opacity-85">
          <a href="#colors" className="hover:opacity-100 transition-opacity hover:underline underline-offset-4">Design</a>
          <a href="#typography" className="hover:opacity-100 transition-opacity hover:underline underline-offset-4">Typography</a>
          <a href="#components" className="hover:opacity-100 transition-opacity hover:underline underline-offset-4">Components</a>
          <a href="#blocks" className="hover:opacity-100 transition-opacity hover:underline underline-offset-4">Pricing</a>
        </nav>

        <div className="flex items-center gap-3">
          <button 
            className="h-10 px-5 border text-xs font-semibold tracking-wider uppercase transition-all duration-300 hover:bg-[var(--primary)] hover:text-[var(--bg)] hover:border-[var(--primary)] active:scale-95 cursor-pointer shadow-sm" 
            style={{ 
              borderColor: 'var(--border)', 
              borderWidth: 'var(--border-width, 1px)',
              borderRadius: 'var(--radius)', 
              backgroundColor: 'var(--surface)', 
              color: 'var(--fg)' 
            }}
          >
            Contact sales
          </button>
          <button 
            className="h-10 px-5 text-xs font-semibold tracking-wider uppercase transition-all duration-300 hover:opacity-90 hover:shadow-md hover:scale-[1.02] active:scale-95 cursor-pointer" 
            style={{ 
              backgroundColor: 'var(--primary)', 
              color: 'var(--bg)', 
              borderRadius: 'var(--radius)' 
            }}
          >
            Get started
          </button>
        </div>
      </div>
    </header>
  )
}
