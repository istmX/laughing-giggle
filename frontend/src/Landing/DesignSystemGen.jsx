import React from 'react';

export default function DesignSystemGen() {
  return (
    <section className="landing-section relative z-10">
      <div className="landing-container">
        
        {/* Header */}
        <div className="landing-section-header text-left">
          <span className="landing-eyebrow">
            Styling Tokens
          </span>
          <h2 className="landing-heading">
            Design system compiler
          </h2>
          <p className="landing-lead">
            Generate and export design tokens mapped directly to variables and Tailwind utility files.
          </p>
        </div>

        {/* Split Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[32px] items-stretch max-w-5xl mx-auto">
          
          {/* Left panel: Code Editor */}
          <div className="landing-card landing-code flex flex-col gap-4 bg-surface-soft">
            <div className="text-zinc-400">{"// Compiled ui-tokens.md"}</div>
            <div className="flex flex-col gap-2 bg-white border border-zinc-150 p-6 rounded-xl text-zinc-800 font-mono">
              <div>:root &#123;</div>
              <div className="pl-4 text-emerald-600">--color-brand-emerald: #10b981;</div>
              <div className="pl-4 text-lime-700">--color-block-lime: #dceeb1;</div>
              <div className="pl-4 text-zinc-500">--radius-lg: 24px;</div>
              <div className="pl-4 text-zinc-500">--spacing-md: 16px;</div>
              <div>&#125;</div>
            </div>
          </div>

          {/* Right panel: Preview swatches */}
          <div className="landing-card flex flex-col justify-between">
            <div className="flex flex-col gap-4">
              <h4 className="font-mono text-xs uppercase tracking-widest text-zinc-500 font-700">
                Live Component Preview
              </h4>
              
              <div className="flex flex-wrap gap-4 items-center bg-white border border-zinc-150 p-6 rounded-xl">
                <button className="h-10 px-5 rounded-full bg-zinc-950 text-white font-medium text-xs hover:bg-zinc-800 transition-colors">
                  Primary Button
                </button>
                <button className="h-10 px-5 rounded-full border border-zinc-250 text-zinc-700 text-xs hover:text-zinc-950 hover:bg-zinc-50 transition-colors bg-white">
                  Secondary Button
                </button>
                <div className="w-8 h-8 rounded-full bg-emerald-500" />
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button className="h-9 px-4 rounded bg-zinc-100 border border-zinc-200 text-zinc-800 text-xs hover:bg-zinc-200 transition-colors">
                Copy CSS
              </button>
              <button className="h-9 px-4 rounded bg-zinc-100 border border-zinc-200 text-zinc-800 text-xs hover:bg-zinc-200 transition-colors">
                Download JSON
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
