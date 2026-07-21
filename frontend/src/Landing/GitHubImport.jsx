import React from 'react';

const PIPELINE = [
  { label: "Repository Scan", status: "complete", desc: "Access path parameters." },
  { label: "Dependency Analysis", status: "complete", desc: "Read package imports." },
  { label: "Architecture Graph", status: "active", desc: "Synthesizing directory nodes." },
  { label: "Context Blueprint", status: "pending", desc: "Write output files." }
];

export default function GitHubImport() {
  return (
    <section className="landing-section relative z-10">
      <div className="landing-container">
        
        {/* Header */}
        <div className="landing-section-header text-left">
          <span className="landing-eyebrow">
            Repository Sync
          </span>
          <h2 className="landing-heading">
            Import from GitHub
          </h2>
          <p className="landing-lead">
            Scan and convert legacy codebases into structured context rules automatically.
          </p>
        </div>

        {/* Timeline Visualization */}
        <div className="max-w-xl w-full flex flex-col gap-[32px] relative pl-6 border-l border-zinc-200">
          {PIPELINE.map((step, idx) => (
            <div key={idx} className="relative flex flex-col gap-2 py-2">
              
              {/* Timeline indicator node */}
              <span className={`absolute -left-[32px] top-4 w-4.5 h-4.5 rounded-full border ${
                step.status === 'complete' 
                  ? 'bg-emerald-500 border-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.2)]' 
                  : step.status === 'active'
                  ? 'bg-white border-emerald-500 border-[3px] animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.2)]'
                  : 'bg-white border-zinc-250'
              }`} />

              <div className="flex justify-between items-center">
                <h4 className="text-[20px] font-bold text-zinc-900">{step.label}</h4>
                <span className="font-mono text-[12px] uppercase tracking-wider text-zinc-400">
                  {step.status}
                </span>
              </div>
              <p className="text-[16px] text-zinc-550 font-light leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
