import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EXPLANATIONS = {
  'AI Forgets': {
    title: 'AI Memory Limitation',
    desc: 'Large language models do not remember previous conversations unless context is provided. Every session starts fresh.',
  },
  'Hallucinates': {
    title: 'Code Hallucinations',
    desc: 'AI models confidently invent API endpoints, library imports, and variable parameters that do not exist, leading to compile errors.',
  },
  'Context': {
    title: 'Semantic Context',
    desc: 'The code, rules, tokens, and active files. Providing proper context ensures the AI understands your system constraints.',
  },
  'Tokens': {
    title: 'Context Window',
    desc: 'Every AI model has a limited number of tokens it can process. More repeated context means less room for useful work.',
  },
  'AGENTS.md': {
    title: 'Active Context Spec',
    desc: 'A single, structured markdown blueprint that documents code conventions, library stacks, and rules for active AI assistants.',
  },
  'Context Engineering': {
    title: 'Context Engineering',
    desc: 'The discipline of organizing, structuring, and pruning directory context so that models produce predictable codebases.',
  }
};

export default function InteractiveKeyword({ word, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null);

  const info = EXPLANATIONS[word] || { title: word, desc: 'Contextual definition details.' };

  return (
    <span className="relative inline-block select-none">
      <span
        ref={triggerRef}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="cursor-help underline decoration-dotted decoration-zinc-400 dark:decoration-zinc-700 hover:decoration-solid font-medium text-zinc-900 dark:text-zinc-200 transition-colors"
      >
        {children || word}
      </span>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 4 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3.5 z-50 w-60 p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md shadow-xl text-left pointer-events-none"
          >
            {/* Pointer arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1.5 border-[6px] border-transparent border-t-zinc-200 dark:border-t-zinc-800" />
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-2 border-[6px] border-transparent border-t-white dark:border-t-zinc-900" />
            
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-950 dark:text-zinc-100 mb-1.5">
              {info.title}
            </h4>
            <p className="text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400 mb-3">
              {info.desc}
            </p>
            <span className="text-[9.5px] font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-0.5">
              Learn more <span className="text-[8px]">→</span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
