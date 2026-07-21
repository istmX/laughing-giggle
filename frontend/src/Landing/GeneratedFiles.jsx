import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FILES = [
  { name: 'AGENTS.md', category: 'agents' },
  { name: 'CLAUDE.md', category: 'agents' },
  { name: 'DESIGN.md', category: 'design' },
  { name: 'README.md', category: 'docs' },
  { name: 'architecture.md', category: 'architecture' },
  { name: 'tasks.md', category: 'tasks' },
  { name: 'roadmap.md', category: 'docs' },
  { name: 'api.md', category: 'architecture' },
  { name: 'database.md', category: 'architecture' },
  { name: 'cursor-rules.md', category: 'agents' },
  { name: 'gemini.md', category: 'agents' },
  { name: 'ui-tokens.md', category: 'design' },
  { name: 'components.md', category: 'design' },
  { name: 'testing.md', category: 'docs' },
  { name: 'deployment.md', category: 'docs' },
  { name: 'mcp-config.json', category: 'architecture' },
  { name: 'prompts.json', category: 'agents' },
  { name: 'developer-docs.md', category: 'docs' }
];

export default function GeneratedFiles() {
  const containerRef = useRef(null);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    gsap.fromTo('.file-card', 
      { 
        opacity: 0, 
        y: 40,
        scale: 0.95
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        stagger: 0.05,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none'
        }
      }
    );

    gsap.fromTo('.folder-backdrop',
      { scale: 0.9, opacity: 0 },
      {
        scale: 1,
        opacity: 0.03,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        }
      }
    );
  }, { scope: containerRef });

  const getCategoryColor = (cat) => {
    switch(cat) {
      case 'agents': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'design': return 'text-lime-700 bg-lime-50 border-lime-200';
      case 'architecture': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'tasks': return 'text-coral-600 bg-coral-50/50 border-coral-200';
      default: return 'text-zinc-600 bg-zinc-50 border-zinc-200';
    }
  };

  return (
    <section ref={containerRef} className="landing-section relative overflow-hidden">
      
      {/* Background Subtle Folder Grid Overlay */}
      <div className="folder-backdrop absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 select-none text-zinc-200">
        <svg className="w-[800px] h-[800px]" viewBox="0 0 100 100" fill="currentColor">
          <path d="M10 20 h30 l5 5 h45 v60 h-80 z" />
        </svg>
      </div>

      <div className="landing-container relative z-10">
        
        {/* Header */}
        <div className="landing-section-header text-left">
          <span className="landing-eyebrow">
            Structure and Outputs
          </span>
          <h2 className="landing-heading">
            Everything Zenix generates
          </h2>
          <p className="landing-lead">
            A comprehensive, clean set of system instructions and context rules mapped to standard folder files.
          </p>
        </div>

        {/* Grid of files */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-[32px]">
          {FILES.map((file, idx) => (
            <div 
              key={idx}
              className="file-card landing-card group flex flex-col justify-between"
            >
              <div className="flex flex-col gap-4">
                {/* File Badge */}
                <div className="flex items-center justify-between">
                  <span className={`font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded border ${getCategoryColor(file.category)}`}>
                    {file.category}
                  </span>
                  <span className="font-mono text-[10px] text-zinc-400">file</span>
                </div>
                {/* File Title */}
                <h4 className="font-mono text-[13px] text-zinc-800 group-hover:text-emerald-600 transition-colors truncate">
                  {file.name}
                </h4>
              </div>

              <div className="mt-6 pt-3 border-t border-zinc-100 flex justify-between items-center text-[10px] font-mono text-zinc-400">
                <span>utf-8</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-600">preview</span>
              </div>
            </div>
          ))}
        </div>

      </div>

    </section>
  );
}
