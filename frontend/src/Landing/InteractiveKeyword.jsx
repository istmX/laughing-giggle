import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InteractiveKeyword({ word, tooltip, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null);

  return (
    <span className="relative inline-block overflow-visible">
      <span
        ref={triggerRef}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="cursor-help underline decoration-dotted decoration-zinc-400 dark:decoration-zinc-700 hover:decoration-solid font-bold text-zinc-950 dark:text-zinc-50 transition-colors"
      >
        {children || word}
      </span>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 4 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50 w-52 p-3.5 rounded-none border border-zinc-200/80 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md shadow-xl text-left pointer-events-none"
          >
            {/* Pointer arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1.5 border-[6px] border-transparent border-t-zinc-200 dark:border-t-zinc-800" />
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-2 border-[6px] border-transparent border-t-white dark:border-t-zinc-900" />
            
            <h4 className="text-[9.5px] font-mono font-bold uppercase tracking-wider text-zinc-950 dark:text-zinc-100 mb-1 leading-none">
              {word}
            </h4>
            <p className="text-[10px] leading-snug text-zinc-500 dark:text-zinc-400">
              {tooltip}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
