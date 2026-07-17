import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCKUP_DATA } from './constants.jsx';
import { ContainerScroll } from '../components/ui/container-scroll-animation';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import SplitType from 'split-type';
import { useRef } from 'react';

const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Docs', href: '/docs' },
  { name: 'Sponsor', href: '/sponsor' },
];

export default function Hero() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [activeFile, setActiveFile] = useState('architecture.md');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const containerRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const { contextSafe } = useGSAP({ scope: containerRef });

  const activeData = MOCKUP_DATA[activeFile] || MOCKUP_DATA['architecture.md'];

  useGSAP(() => {
    // 1. Split the headline and subheadline text
    const headline = new SplitType('.split-headline', { types: 'words, chars' });
    const subhead = new SplitType('.split-subhead', { types: 'lines, words' });

    // 2. Animate the characters of the headline from the center
    gsap.from(headline.chars, {
      y: 60,
      opacity: 0,
      rotationX: -90,
      stagger: {
        amount: 0.8,
        from: 'center'
      },
      duration: 1.2,
      ease: 'expo.out',
      transformOrigin: '50% 50% -20px',
    });

    // 3. Animate the subheadline words
    gsap.from(subhead.words, {
      y: 20,
      opacity: 0,
      stagger: 0.015,
      duration: 1,
      ease: 'expo.out',
      delay: 0.3,
    });

    // 4. Fade in the CTAs
    gsap.from('.hero-ctas', {
      y: 20,
      opacity: 0,
      duration: 1,
      ease: 'expo.out',
      delay: 0.6,
    });

    // 5. Animate Nav Bar dropping in
    gsap.from('.hero-nav', {
      y: -100,
      opacity: 0,
      duration: 1.2,
      ease: 'expo.out',
      delay: 0.1,
    });
  }, { scope: containerRef });

  const toggleMobileMenu = contextSafe(() => {
    const tl = gsap.timeline();
    if (!isMobileMenuOpen) {
      setIsMobileMenuOpen(true);
      gsap.to(mobileMenuRef.current, { display: 'flex', opacity: 1, duration: 0.4, ease: 'power2.out' });
      gsap.fromTo('.mobile-link', 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power3.out', delay: 0.1 }
      );
      gsap.to('.hamburger-top', { rotation: 45, y: 6, duration: 0.3 });
      gsap.to('.hamburger-mid', { opacity: 0, duration: 0.3 });
      gsap.to('.hamburger-bot', { rotation: -45, y: -6, duration: 0.3 });
    } else {
      tl.to('.mobile-link', { y: 20, opacity: 0, duration: 0.3, stagger: -0.05, ease: 'power2.in' })
        .to(mobileMenuRef.current, { opacity: 0, duration: 0.3, onComplete: () => setIsMobileMenuOpen(false) }, "-=0.1")
        .set(mobileMenuRef.current, { display: 'none' });
      
      gsap.to('.hamburger-top', { rotation: 0, y: 0, duration: 0.3 });
      gsap.to('.hamburger-mid', { opacity: 1, duration: 0.3 });
      gsap.to('.hamburger-bot', { rotation: 0, y: 0, duration: 0.3 });
    }
  });

  return (
    <div ref={containerRef} className="relative w-full min-h-screen bg-white text-zinc-950 font-sans selection:bg-zinc-200 overflow-hidden flex flex-col">
      {/* Navigation */}
      <nav className="hero-nav fixed top-0 inset-x-0 h-20 flex items-center justify-between px-6 lg:px-12 z-50 bg-white/90 backdrop-blur-md border-b border-zinc-100">
        
        {/* Left: Logo Placeholder */}
        <div className="flex-1 flex items-center gap-3">
          <div className="w-8 h-8 bg-zinc-950 rounded-lg flex items-center justify-center overflow-hidden shadow-sm">
            <span className="text-white text-xs font-bold">Z</span>
          </div>
          <span className="font-semibold tracking-tight text-lg">Zenix</span>
        </div>

        {/* Center: Gliding Nav Links */}
        <div className="flex-none hidden md:flex items-center p-1.5 rounded-full border border-zinc-100 bg-zinc-50/50">
          {NAV_LINKS.map((link, idx) => (
            <a
              key={link.name}
              href={link.href}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative px-5 py-2 rounded-full text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950 z-10"
            >
              {hoveredIndex === idx && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-white rounded-full shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)] border border-zinc-200/50 -z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                />
              )}
              <span className="relative z-10">{link.name}</span>
            </a>
          ))}
        </div>

        {/* Right: CTAs */}
        <div className="flex-1 hidden md:flex items-center justify-end gap-2 lg:gap-4">
          <RollingButton 
            href="/login" 
            text="Log in"
            className="hidden sm:inline-flex text-zinc-500 hover:text-zinc-900 bg-transparent px-4 lg:px-6"
          />
          <RollingButton 
            href="/signup" 
            text="Get Started"
            className="text-white bg-zinc-950 hover:bg-zinc-800 shadow-sm"
          />
        </div>

        {/* Mobile Hamburger */}
        <button 
          onClick={toggleMobileMenu}
          className="md:hidden flex flex-col items-center justify-center w-10 h-10 gap-1.5 z-[60]"
          aria-label="Toggle menu"
        >
          <span className="hamburger-top w-6 h-[2px] bg-zinc-900 block origin-center transition-transform"></span>
          <span className="hamburger-mid w-6 h-[2px] bg-zinc-900 block transition-opacity"></span>
          <span className="hamburger-bot w-6 h-[2px] bg-zinc-900 block origin-center transition-transform"></span>
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        ref={mobileMenuRef}
        className="fixed inset-0 z-40 bg-white pt-24 px-6 pb-6 hidden flex-col"
        style={{ display: 'none', opacity: 0 }}
      >
        <div className="flex flex-col gap-6 text-2xl font-medium tracking-tight">
          {NAV_LINKS.map((link) => (
            <a key={link.name} href={link.href} className="mobile-link text-zinc-900 hover:text-zinc-600 border-b border-zinc-100 pb-4">
              {link.name}
            </a>
          ))}
        </div>
        <div className="mt-auto flex flex-col gap-4">
          <a href="/login" className="mobile-link flex h-14 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-900 font-medium">
            Log in
          </a>
          <a href="/signup" className="mobile-link flex h-14 items-center justify-center rounded-full bg-zinc-950 text-white font-medium">
            Get Started
          </a>
        </div>
      </div>

      {/* Hero Content */}
      <main className="flex-1 flex flex-col items-center justify-start text-center px-6 z-10 pt-20 pb-24">
        
        <ContainerScroll
          titleComponent={
            <>
              {/* Headline */}
              <h1 className="split-headline text-5xl md:text-7xl lg:text-[104px] font-bold tracking-[-0.05em] max-w-6xl leading-[0.95] text-zinc-950 mx-auto" style={{ perspective: "1000px" }}>
                Stop shipping AI slop.
              </h1>
              
              {/* Subheadline */}
              <p className="split-subhead mt-8 text-lg md:text-xl text-zinc-500 max-w-2xl leading-relaxed font-light tracking-[-0.01em] mx-auto">
                Build software with context, architecture and design systems not prompts.
              </p>

              {/* CTAs */}
              <div className="hero-ctas mt-12 flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center mb-10">
                <RollingButton 
                  href="/signup" 
                  text="Start Building" 
                  className="bg-zinc-950 text-white hover:bg-zinc-800 shadow-sm hover:shadow-md"
                />
                <RollingButton 
                  href="/github" 
                  text="Import from GitHub" 
                  className="border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 hover:border-zinc-300 shadow-sm"
                />
              </div>
            </>
          }
        >
          {/* Realistic Dashboard Mockup */}
          <div className="relative w-full h-[450px] md:h-[500px] lg:h-auto lg:aspect-[16/9] bg-[#0E0E11] rounded-2xl border border-zinc-800 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col text-left">
            
            {/* Mac Window Controls */}
            <div className="h-12 border-b border-zinc-800/80 flex items-center px-4 gap-2 bg-[#18181B] shrink-0">
              <div className="w-3 h-3 rounded-full bg-[#ED6A5E]" />
              <div className="w-3 h-3 rounded-full bg-[#F4BF4F]" />
              <div className="w-3 h-3 rounded-full bg-[#61C554]" />
              <div className="ml-4 flex-1 flex justify-center">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={activeFile}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="px-3 py-1 bg-zinc-800 rounded-md text-[11px] font-mono text-zinc-400 flex items-center gap-2"
                  >
                    <span className="text-zinc-500">zenix</span> / {activeFile}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
            
            {/* Mockup Body */}
            <div className="flex-1 flex overflow-hidden">
              {/* Sidebar */}
              <div className="w-64 border-r border-zinc-800/80 bg-[#121214] p-4 flex flex-col gap-1 hidden md:flex shrink-0">
                <div className="text-[10px] font-mono tracking-[0.1em] text-zinc-500 uppercase mb-2 px-2">Context Files</div>
                
                {Object.keys(MOCKUP_DATA).map((fileName) => {
                  const isActive = activeFile === fileName;
                  return (
                    <button
                      key={fileName}
                      onClick={() => setActiveFile(fileName)}
                      className={`px-2 py-1.5 rounded-md text-xs font-mono flex items-center gap-2 text-left transition-colors ${
                        isActive 
                          ? 'bg-zinc-800/80 border border-zinc-700/50 text-zinc-200 shadow-sm' 
                          : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-300 border border-transparent'
                      }`}
                    >
                      <span className={MOCKUP_DATA[fileName].iconColor}>#</span> {fileName}
                    </button>
                  );
                })}
              </div>
              
              {/* Main Editor/Canvas */}
              <div className="flex-1 bg-[#0E0E11] p-6 lg:p-10 overflow-hidden relative">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={activeFile}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="max-w-3xl font-mono text-[13px] leading-relaxed"
                  >
                    <div className="text-zinc-500 mb-6">{"// Auto-generated by Zenix Context Engine v2.0"}</div>
                    <div className="text-zinc-200 text-xl font-sans font-medium tracking-tight mb-4 border-b border-zinc-800 pb-2">
                      {activeData.title}
                    </div>
                    <div className="text-zinc-400 mb-6 leading-relaxed">
                      {activeData.description}
                    </div>
                    <div className="bg-[#18181B] border border-zinc-800 rounded-lg p-5 mb-6 font-mono text-[13px] shadow-inner overflow-x-auto">
                      {activeData.codeSnippet}
                    </div>
                  </motion.div>
                </AnimatePresence>
                
                {/* AI Thinking gradient overlay at bottom */}
                <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#0E0E11] to-transparent pointer-events-none z-10" />
              </div>
            </div>
            
            {/* Floating Window: Interactive Live Preview */}
            <div className="absolute right-12 top-24 w-80 bg-white border border-zinc-200 rounded-xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] p-1 hidden lg:block transform transition-transform duration-500 group-hover:-translate-y-4 group-hover:-rotate-2 z-20">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={`preview-${activeFile}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="bg-zinc-50 border border-zinc-100 rounded-lg p-4 h-full"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-[10px] font-mono font-medium text-zinc-500 uppercase tracking-wider">{activeData.preview.title}</span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-400">{activeData.preview.file}</span>
                  </div>
                  {activeData.preview.element}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Floating Window: Terminal/Agent */}
            <div className="absolute right-24 bottom-16 w-72 bg-[#18181B] border border-zinc-800 rounded-lg shadow-[0_20px_40px_-10px_rgba(0,0,0,0.4)] p-5 hidden lg:block transform transition-transform duration-500 delay-100 group-hover:-translate-y-2 group-hover:rotate-1 z-30">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-5 h-5 rounded bg-purple-500/20 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                </div>
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">Developer Agent</span>
              </div>
              <div className="space-y-2.5 text-xs font-mono text-zinc-500">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={`logs-${activeFile}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-2.5"
                  >
                    {activeData.agentLogs.map((log, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        {log.status === 'done' ? (
                          <span className="text-emerald-400 mt-0.5">✔</span>
                        ) : (
                          <span className="text-amber-400 animate-pulse mt-0.5">⟳</span>
                        )}
                        <span className={log.status === 'loading' ? 'text-zinc-300' : ''}>
                          {log.text}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

          </div>
        </ContainerScroll>

      </main>
    </div>
  );
}

// Base Rolling Text logic (Char by Char)
function RollingText({ text }) {
  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      className="relative overflow-hidden h-[1.5em] flex items-center justify-center whitespace-pre"
    >
      <div className="flex">
        {text.split("").map((char, i) => (
          <motion.span
            key={`top-${i}`}
            variants={{
              rest: { y: 0 },
              hover: { y: "-150%" },
            }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: i * 0.02 }}
            className="block"
          >
            {char}
          </motion.span>
        ))}
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        {text.split("").map((char, i) => (
          <motion.span
            key={`bottom-${i}`}
            variants={{
              rest: { y: "150%" },
              hover: { y: 0 },
            }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: i * 0.02 }}
            className="block"
          >
            {char}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

// Rolling Text Button Component
function RollingButton({ href, text, className }) {
  return (
    <a
      href={href}
      className={`inline-flex h-12 items-center justify-center rounded-full px-8 text-sm font-medium transition-transform active:translate-y-px ${className}`}
    >
      <RollingText text={text} />
    </a>
  );
}
