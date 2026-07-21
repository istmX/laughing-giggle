import { motion } from 'framer-motion';
import { RollingButton } from '@/components/ui/RollingButton';

export default function FinalCTA() {
  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    initial: { y: 30, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section className="landing-section relative flex flex-col justify-center items-center overflow-hidden">
      
      {/* Background Radial Glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <div className="w-[600px] h-[600px] rounded-full bg-emerald-500/5 blur-[120px]" />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-10%" }}
        className="landing-container relative z-10 flex flex-col items-center text-center"
      >
        <div className="landing-section-header items-center text-center">
          <motion.span 
            variants={itemVariants} 
            className="landing-eyebrow"
          >
            Next Steps
          </motion.span>

          <motion.h2 
            variants={itemVariants}
            className="landing-heading max-w-2xl"
          >
            Build software. Not prompts.
          </motion.h2>
        </div>

        <motion.p 
          variants={itemVariants}
          className="landing-lead mx-auto"
        >
          Generate development context that aligns your codebase and ensures AI coding agents work in perfect harmony.
        </motion.p>

        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-[16px] w-full sm:w-auto justify-center"
        >
          <RollingButton
            href="/signup"
            text="Start Building"
            className="bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-sm"
          />
          <RollingButton
            href="/github"
            text="Import from GitHub"
            className="border border-zinc-250 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800 px-8"
          />
        </motion.div>

      </motion.div>

    </section>
  );
}
