import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import InteractiveKeyword from './InteractiveKeyword';

export default function ProblemCard({ item }) {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });

  // Spring animations for the magnetic effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 100, damping: 18 });
  const springY = useSpring(y, { stiffness: 100, damping: 18 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Magnetic pull coordinates
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    const force = 6; // Max pixels displacement
    x.set((mouseX / width) * force);
    y.set((mouseY / height) * force);

    // Glowing border coordinates
    setGlowPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  // Helper to parse description text and wrap interactive keywords
  const formatDesc = (text) => {
    const keywords = ['AI Forgets', 'Hallucinates', 'Context', 'Tokens', 'AGENTS.md', 'Context Engineering'];
    let parts = [text];

    keywords.forEach((keyword) => {
      const nextParts = [];
      parts.forEach((part) => {
        if (typeof part === 'string') {
          const segments = part.split(new RegExp(`(${keyword})`, 'g'));
          segments.forEach((segment) => {
            if (segment === keyword) {
              nextParts.push(
                <InteractiveKeyword key={keyword + '-' + Math.random()} word={keyword}>
                  {keyword}
                </InteractiveKeyword>
              );
            } else {
              nextParts.push(segment);
            }
          });
        } else {
          nextParts.push(part);
        }
      });
      parts = nextParts;
    });
    return parts;
  };

  const IconComponent = item.icon;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={`pcard relative w-full ${item.height} p-6 sm:p-8 rounded-[28px] border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/40 dark:bg-zinc-900/30 shadow-[0_8px_30px_rgba(0,0,0,0.02)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-300 ease-out cursor-default overflow-hidden flex flex-col justify-between group`}
    >
      {/* Radial Hover Glow Background */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(300px circle at ${glowPos.x}px ${glowPos.y}px, rgba(99,102,241,0.05) 0%, rgba(255,255,255,0.01) 80%, transparent 100%)`
        }}
      />

      <div className="flex flex-col gap-4">
        {/* Header line: Tag & Animated Icon */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-800/60 px-2.5 py-0.5 rounded-full select-none">
            {item.tag}
          </span>
          <IconComponent className="w-4.5 h-4.5 text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-950 dark:group-hover:text-zinc-200 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 ease-out" />
        </div>

        {/* Title */}
        <h3 className="pheadline text-lg sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 select-none">
          {item.title}
        </h3>

        {/* Description with highlights */}
        <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-[13px] leading-relaxed tracking-wide font-normal">
          {formatDesc(item.desc)}
        </p>
      </div>
    </motion.div>
  );
}
