import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQS = [
  {
    question: "What is Zenix?",
    answer: "Zenix is an engineering workspace that translates software ideas into comprehensive developer context files. Instead of writing long prompts to AI tools, Zenix structures the design tokens, database schemas, API contracts, and team goals once."
  },
  {
    question: "How does it align coding agents?",
    answer: "Zenix generates standardized system files like AGENTS.md, ui-tokens.md, and database.md. These files act as the single source of truth that you feed into IDE extensions, Cursor, Claude Code, or Gemini CLI."
  },
  {
    question: "Do I need to change my coding framework?",
    answer: "No. Zenix is completely framework agnostic. It compiles specifications into Markdown and JSON files that any development environment, compiler, or AI context pipeline can read directly."
  },
  {
    question: "Can I import from GitHub?",
    answer: "Yes. Zenix can scan public or private repositories, read the repository tree structure, analyze existing dependencies, and generate visual architecture maps of your codebase automatically."
  },
  {
    question: "How are design tokens structured?",
    answer: "Design tokens are generated following a primitive, semantic, and component token hierarchy. They align with your target styling system, outputting clean layouts and variables."
  },
  {
    question: "Is there a limit to generation outputs?",
    answer: "Free projects can compile core files. Pro plans unlock deep multi-file sequential streaming, context graphs, database schemas, and marketplace publishing."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleIndex = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="landing-section relative z-10 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 border-t border-zinc-200/70 dark:border-zinc-800/70 transition-colors duration-300">
      <div className="landing-container">
        
        {/* Header */}
        <div className="landing-section-header text-left">
          <span className="landing-eyebrow">
            Common Questions
          </span>
          <h2 className="landing-heading text-zinc-900 dark:text-white">
            Frequently asked questions
          </h2>
        </div>

        {/* Accordions */}
        <div className="flex flex-col border-t border-zinc-150 dark:border-zinc-800">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx} 
                className="border-b border-zinc-150 dark:border-zinc-800 py-6 transition-all duration-300"
              >
                <button
                  onClick={() => toggleIndex(idx)}
                  className="w-full flex justify-between items-center text-left py-2 font-medium text-zinc-800 dark:text-zinc-100 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  <span className="text-[20px] font-medium leading-snug">{faq.question}</span>
                  <span className="text-zinc-400 dark:text-zinc-500 text-lg transition-transform duration-300 pl-4">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p className="text-zinc-550 dark:text-zinc-400 text-[18px] font-light leading-relaxed pt-4 pb-2 pr-6 max-w-3xl">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
