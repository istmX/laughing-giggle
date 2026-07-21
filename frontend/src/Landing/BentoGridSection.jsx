import { GlowingEffect } from "@/components/ui/glowing-effect";
import { Sparkles, Code2, Play, Users, Terminal } from "lucide-react";

const ITEMS = [
  {
    area: "md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]",
    icon: <Sparkles className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />,
    title: "Context Synthesis",
    description: "Enter your software idea. Zenix runs a conversational wizard to refine requirements and generate alignment specifications.",
  },
  {
    area: "md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]",
    icon: <Code2 className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />,
    title: "Context Blueprints",
    description: "Creates rich context documents (AGENTS.md, TASKS.md, ui-tokens.md) designed specifically for downstream AI coding agents.",
  },
  {
    area: "md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]",
    icon: <Play className="h-4 w-4 text-zinc-950 dark:text-zinc-50" />,
    title: "Interactive AI Playground",
    description: (
      <>
        Built-in sandbox to iterate <br />
        on UI layouts, tweak design tokens, and preview the live UI in front of you while editing with AI.
      </>
    ),
  },
  {
    area: "md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]",
    icon: <Users className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />,
    title: "Creator Community",
    description: "Search, follow, download, and fork templates from verified creators. Active profiles display loyalty badges and design collections.",
  },
  {
    area: "md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]",
    icon: <Terminal className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />,
    title: "Task & Mission Control",
    description: "Converts feature requests into atomic, step-by-step development tasks and implementation missions for structured execution.",
  },
];

export default function BentoGridSection() {
  return (
    <section className="landing-section bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 py-16 sm:py-24 transition-colors duration-300">
      <div className="landing-container">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-bold block mb-3">
            Zenix Engine
          </span>
          <h2 className="text-display-sm sm:text-display-md tracking-tight font-semibold text-zinc-900 dark:text-white mb-4">
            Engineered for AI Collaboration
          </h2>
          <p className="text-body-lg text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
            Zenix bridges the gap between raw prompts and production software by generating rich, structured engineering context for your AI coding agents.
          </p>
        </div>

        {/* Bento Grid */}
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-6 xl:grid-rows-2">
          {ITEMS.map((item, index) => (
            <li key={index} className={`min-h-[12rem] md:min-h-[14rem] h-auto list-none ${item.area}`}>
              <div className="relative min-h-full h-auto rounded-2xl border border-zinc-100 dark:border-zinc-800/80 p-2 md:rounded-3xl md:p-3 bg-zinc-50/50 dark:bg-zinc-900/50 flex flex-col">
                <GlowingEffect
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                />
                <div className="relative flex flex-1 flex-col justify-between gap-6 rounded-xl bg-white dark:bg-zinc-900 p-6 md:p-8 border border-zinc-100/50 dark:border-zinc-800/60 w-full h-auto min-h-full">
                  <div className="relative flex flex-1 flex-col justify-between gap-4">
                    <div className="w-fit rounded-lg border border-zinc-200 dark:border-zinc-805 bg-zinc-50 dark:bg-zinc-800 p-2 text-zinc-700 dark:text-zinc-300">
                      {item.icon}
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-sans text-lg sm:text-xl font-semibold text-zinc-900 dark:text-white leading-tight">
                        {item.title}
                      </h3>
                      <p className="font-sans text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-light pr-4 md:pr-8">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

      </div>
    </section>
  );
}
