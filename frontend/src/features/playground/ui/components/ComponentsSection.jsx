import React from 'react'

export const ComponentsSection = ({ activeTab, setActiveTab }) => {
  return (
    <section id="components" className="sandbox-container sandbox-section mx-auto w-full px-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-semibold tracking-widest uppercase opacity-85" style={{ color: 'var(--fg)' }}>03 · Interface Components</p>
        <span className="text-[11px] font-mono opacity-50 uppercase">Interactive</span>
      </div>
      <h2 className="display-lg mb-8 font-semibold tracking-tight" style={{ fontFamily: 'var(--heading-font)' }}>Pills, inputs, interactive tabs</h2>
      
      <div className="grid md:grid-cols-2 gap-12 p-8 border rounded-2xl shadow-sm" style={{ borderColor: 'var(--border)', borderWidth: 'var(--border-width, 1px)', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius)' }}>
        
        {/* Column 1: Buttons */}
        <div className="flex flex-col gap-6">
          <h3 className="text-lg font-semibold tracking-tight">Unified Button System</h3>
          <div className="flex flex-wrap items-center gap-3">
            <button 
              className="h-11 px-6 text-xs font-bold tracking-wider uppercase transition-all duration-300 hover:opacity-90 hover:-translate-y-0.5 active:scale-95 cursor-pointer shadow-sm" 
              style={{ backgroundColor: 'var(--primary)', color: 'var(--bg)', borderRadius: 'var(--radius)' }}
            >
              Primary pill
            </button>
            <button 
              className="h-11 px-6 text-xs font-bold tracking-wider uppercase border transition-all duration-300 hover:bg-[var(--primary)] hover:text-[var(--bg)] hover:border-[var(--primary)] hover:-translate-y-0.5 active:scale-95 cursor-pointer" 
              style={{ backgroundColor: 'transparent', color: 'var(--fg)', borderColor: 'var(--border)', borderWidth: 'var(--border-width, 1px)', borderRadius: 'var(--radius)' }}
            >
              Hover fill pill
            </button>
            <button 
              className="h-11 px-4 text-xs font-bold tracking-wider uppercase transition-all duration-200 hover:underline underline-offset-4 cursor-pointer" 
              style={{ color: 'var(--primary)' }}
            >
              Text link ➔
            </button>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button className="w-11 h-11 rounded-full border flex items-center justify-center text-sm font-semibold transition-all duration-300 hover:bg-[var(--primary)] hover:text-[var(--bg)] hover:scale-105 active:scale-95 cursor-pointer shadow-sm" style={{ borderColor: 'var(--border)', borderWidth: 'var(--border-width, 1px)', backgroundColor: 'var(--bg)', color: 'var(--fg)' }}>➔</button>
            <button className="w-11 h-11 rounded-full flex items-center justify-center text-sm text-white transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-sm" style={{ backgroundColor: 'var(--accent)' }}>★</button>
          </div>
        </div>

        {/* Column 2: Navigation Tabs & Sample Input */}
        <div className="flex flex-col gap-6">
          <h3 className="text-lg font-semibold tracking-tight">Navigation & Form Controls</h3>
          
          {/* Sliding Tab Bar */}
          <div className="relative flex gap-1 p-1 border w-fit shadow-inner" style={{ borderColor: 'var(--border)', borderWidth: 'var(--border-width, 1px)', borderRadius: 'var(--radius)', backgroundColor: 'var(--bg)' }}>
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
                className="px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors duration-200 relative z-10 cursor-pointer"
                style={{ 
                  color: activeTab === idx ? 'var(--bg)' : 'var(--fg)',
                  backgroundColor: 'transparent',
                  border: 'none',
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Styled Input */}
          <div className="flex flex-col gap-1.5 w-full max-w-md">
            <label className="text-xs font-semibold tracking-wider uppercase opacity-75">Sample Form Input</label>
            <input 
              type="text" 
              placeholder="Enter work email address..." 
              className="h-11 px-4 text-sm w-full border transition-all duration-200 hover:border-fg/40 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-inner"
              style={{ borderColor: 'var(--border)', borderWidth: 'var(--border-width, 1px)', borderRadius: 'var(--radius)', backgroundColor: 'var(--bg)', color: 'var(--fg)' }}
            />
          </div>
        </div>

      </div>
    </section>
  )
}
