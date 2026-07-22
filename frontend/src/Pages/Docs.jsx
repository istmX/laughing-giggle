import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Code2, Play, Users, Layers, Zap, ChevronRight } from 'lucide-react'
import { Navbar } from '@/components/ui/Navbar'
import { GlowingCard } from '@/components/ui/GlowingCard'
import Footer from '@/Landing/Footer'

const SECTIONS = [
  {
    id: 'getting-started',
    icon: <Zap className="h-4 w-4" />,
    title: 'Getting Started',
    description: 'Create an account, describe your idea, and generate your first context package in under five minutes.',
  },
  {
    id: 'context-engine',
    icon: <Sparkles className="h-4 w-4" />,
    title: 'Context Engine',
    description: 'How Zenix transforms raw ideas into structured engineering context through conversational refinement.',
  },
  {
    id: 'blueprints',
    icon: <Code2 className="h-4 w-4" />,
    title: 'Context Blueprints',
    description: 'The generated files — AGENTS.md, ui-tokens.md, architecture.md, and more — that power your AI coding agents.',
  },
  {
    id: 'playground',
    icon: <Play className="h-4 w-4" />,
    title: 'AI Playground',
    description: 'Iterate on UI layouts, tweak design tokens, and preview live output in the built-in sandbox.',
  },
  {
    id: 'projects',
    icon: <Layers className="h-4 w-4" />,
    title: 'Projects & Workspace',
    description: 'Organize work into projects. Each project owns its context, chat history, and generated artifacts.',
  },
  {
    id: 'community',
    icon: <Users className="h-4 w-4" />,
    title: 'Creator Community',
    description: 'Search, follow, download, and fork templates from verified creators.',
  },
]

const GETTING_STARTED_STEPS = [
  {
    step: '01',
    title: 'Sign up',
    body: 'Create a free account at zenix.dev/signup. No credit card required. You get immediate access to the full workspace.',
  },
  {
    step: '02',
    title: 'Describe your idea',
    body: 'Open the Context Engine and tell Zenix what you want to build. A few sentences is enough. The PM Wizard will ask clarifying questions to fill gaps.',
  },
  {
    step: '03',
    title: 'Review the context',
    body: 'Zenix generates a complete context package: architecture, design tokens, agent rules, task breakdowns, and implementation missions. Review and refine anything.',
  },
  {
    step: '04',
    title: 'Use it anywhere',
    body: 'Export the context files to your AI coding tool — Cursor, Claude Code, Copilot, Gemini CLI, or any Markdown-based workflow. The context is tool-agnostic.',
  },
]

const CONTEXT_FILES = [
  {
    name: 'AGENTS.md',
    purpose: 'Agent behavior rules',
    body: 'Defines how AI coding agents should understand, architect, and implement your project. Covers folder structure, component rules, state management, styling conventions, and development principles.',
  },
  {
    name: 'architecture.md',
    purpose: 'System architecture',
    body: 'Standard folder tree, storage layers, API structure, and technology decisions. Gives AI tools a structural map of your project before they write a single line.',
  },
  {
    name: 'ui-tokens.md',
    purpose: 'Design system tokens',
    body: 'Primitive, semantic, and component token hierarchy. Typography scales, color palettes, spacing limits, border radii, and shadow definitions — ready for any styling system.',
  },
  {
    name: 'build-plan.md',
    purpose: 'Development roadmap',
    body: 'Phased implementation plan with dependencies, milestones, and deliverables. Keeps AI agents on track with the project\'s actual development sequence.',
  },
  {
    name: 'code-standards.md',
    purpose: 'Code conventions',
    body: 'Naming conventions, file organization, import patterns, error handling, and testing requirements. Ensures consistent code quality across AI-generated output.',
  },
  {
    name: 'implementation-missions.md',
    purpose: 'Atomic task breakdowns',
    body: 'Feature requests converted into step-by-step development tasks. Each mission is self-contained with context, acceptance criteria, and verification steps.',
  },
]

const FAQS = [
  {
    question: 'What exactly does Zenix generate?',
    answer: 'Zenix produces a set of Markdown and JSON context files: AGENTS.md, architecture.md, ui-tokens.md, build-plan.md, code-standards.md, and implementation missions. These files describe your project\'s structure, conventions, and requirements in a format that any AI coding tool can consume.',
  },
  {
    question: 'Which AI tools work with Zenix output?',
    answer: 'Any tool that reads Markdown. The generated context works with Cursor, Claude Code, GitHub Copilot, Gemini CLI, Windsurf, Continue, Roo Code, Cline, and any other Markdown-based AI workflow. Zenix is provider-agnostic by design.',
  },
  {
    question: 'Do I need to start from scratch?',
    answer: 'No. Zenix can scan an existing GitHub repository, analyze the codebase structure, and generate context that aligns with what you already have. It identifies patterns, dependencies, and conventions automatically.',
  },
  {
    question: 'How is this different from writing prompts?',
    answer: 'Prompts are ephemeral and project-agnostic. Zenix context is persistent, structured, and specific to your project. Instead of re-explaining your codebase to every AI session, you generate the context once and every agent reads the same source of truth.',
  },
  {
    question: 'Is there a limit to how much I can generate?',
    answer: 'Free accounts can create projects, run the Context Engine, and export all generated files. There are no generation limits during early access.',
  },
  {
    question: 'Can I edit the generated files?',
    answer: 'Yes. All generated context is plain Markdown. You can edit any file directly in the workspace or export and modify it locally. Zenix regenerates from your current state, not from a cached snapshot.',
  },
]

export default function DocsPage() {
  return (
    <div className="bg-background text-foreground font-sans overflow-x-hidden">
      <Navbar />

      <main>
        {/* ===================== HERO ===================== */}
        <section className="relative flex min-h-[70vh] w-full items-center justify-center overflow-hidden px-6 py-32 text-center">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center select-none opacity-[0.035]">
            <span className="font-tall text-[28vw] leading-none">DOCS</span>
          </div>

          <div className="relative z-10 flex w-full max-w-5xl flex-col items-center">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">Reference & Guides</p>
            <h1 className="mt-8 flex w-full justify-center items-center gap-1 overflow-hidden font-tall text-[clamp(6rem,18vw,22rem)] leading-[0.75] tracking-tighter sm:gap-2">
              {'DOCS'.split('').map((letter, index) => (
                <span key={`${letter}-${index}`} className="inline-flex overflow-hidden">
                  <span className="inline-block">{letter}</span>
                </span>
              ))}
            </h1>
            <p className="mt-10 w-full max-w-2xl text-lg leading-relaxed text-ink-muted sm:text-xl">
              Everything you need to understand how Zenix works, what it generates, and how to use the output in your AI coding workflow.
            </p>
          </div>
        </section>

        <div className="mx-auto h-px w-full max-w-6xl bg-hairline" />

        {/* ===================== QUICK NAV ===================== */}
        <section className="mx-auto w-full max-w-6xl px-6 py-24 sm:py-32">
          <div className="max-w-3xl mb-12 sm:mb-16">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted block mb-3">
              Sections
            </span>
            <h2 className="text-display-sm sm:text-display-md tracking-tight font-semibold text-ink mb-4">
              What&apos;s in the docs
            </h2>
            <p className="text-body-lg text-ink-muted font-light leading-relaxed">
              Jump to the section you need. Each covers a specific part of the Zenix workflow from idea to exported context.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SECTIONS.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="group flex flex-col gap-4 rounded-2xl border border-hairline bg-surface-soft p-6 transition-colors hover:bg-surface-elevated"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-hairline bg-background text-ink-muted">
                  {section.icon}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-ink mb-1 flex items-center gap-2">
                    {section.title}
                    <ChevronRight className="h-3.5 w-3.5 text-ink-muted opacity-0 transition-opacity group-hover:opacity-100" />
                  </h3>
                  <p className="text-sm leading-relaxed text-ink-muted">
                    {section.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>

        <div className="mx-auto h-px w-full max-w-6xl bg-hairline" />

        {/* ===================== GETTING STARTED ===================== */}
        <section id="getting-started" className="mx-auto w-full max-w-6xl px-6 py-24 sm:py-32">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted block mb-3">
                Quick start
              </span>
              <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] font-[var(--font-weight-540)] leading-[0.95] tracking-tight">
                FROM IDEA TO CONTEXT IN FOUR STEPS
              </h2>
            </div>

            <div className="flex flex-col gap-8">
              {GETTING_STARTED_STEPS.map((s) => (
                <div key={s.step} className="flex gap-6">
                  <span className="font-mono text-xs text-ink-muted mt-1 shrink-0">{s.step}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-ink mb-2">{s.title}</h3>
                    <p className="text-body text-ink-muted leading-relaxed">{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 flex flex-col gap-4 sm:flex-row">
            <Link
              to="/signup"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-foreground px-7 py-3 text-sm text-background transition-transform hover:-translate-y-0.5 sm:w-auto"
            >
              Create a free account <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/about"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-foreground/60 px-7 py-3 text-sm transition-colors hover:bg-surface-elevated sm:w-auto"
            >
              Read the About page
            </Link>
          </div>
        </section>

        <div className="mx-auto h-px w-full max-w-6xl bg-hairline" />

        {/* ===================== CONTEXT ENGINE ===================== */}
        <section id="context-engine" className="mx-auto w-full max-w-6xl px-6 py-24 sm:py-32">
          <div className="max-w-3xl mb-12 sm:mb-16">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted block mb-3">
              Core
            </span>
            <h2 className="text-display-sm sm:text-display-md tracking-tight font-semibold text-ink mb-4">
              Context Engine
            </h2>
            <p className="text-body-lg text-ink-muted font-light leading-relaxed">
              The Context Engine is the core of Zenix. It takes a raw software idea and transforms it into a complete set of engineering context files through a structured, conversational process.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-hairline bg-surface-soft p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-ink mb-3">PM Wizard</h3>
              <p className="text-body text-ink-muted leading-relaxed mb-4">
                A conversational requirements-gathering agent. It asks targeted questions about your project&apos;s scope, users, tech stack, and constraints. Each answer refines the specification.
              </p>
              <p className="text-body-sm text-ink-muted leading-relaxed">
                The wizard uses a stateful graph with checkpointing, so you can pause and resume without losing progress. It maps both snake_case and camelCase payloads and handles flexible request models.
              </p>
            </div>

            <div className="rounded-2xl border border-hairline bg-surface-soft p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-ink mb-3">Context Synthesis</h3>
              <p className="text-body text-ink-muted leading-relaxed mb-4">
                Once requirements are complete, the engine runs a multi-pass synthesis. It generates architecture decisions, design tokens, agent rules, and task breakdowns in sequence.
              </p>
              <p className="text-body-sm text-ink-muted leading-relaxed">
                A built-in QA loop validates each artifact against the requirements before output. If something doesn&apos;t align, it self-corrects through up to three iterations.
              </p>
            </div>

            <div className="rounded-2xl border border-hairline bg-surface-soft p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-ink mb-3">Repository Scanning</h3>
              <p className="text-body text-ink-muted leading-relaxed mb-4">
                Zenix can scan public or private GitHub repositories to understand existing codebases. It reads the file tree, analyzes dependencies, and generates architecture maps.
              </p>
              <p className="text-body-sm text-ink-muted leading-relaxed">
                This means you don&apos;t start from zero. The engine builds on top of what you already have, identifying patterns and generating context that matches your existing conventions.
              </p>
            </div>

            <div className="rounded-2xl border border-hairline bg-surface-soft p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-ink mb-3">Export</h3>
              <p className="text-body text-ink-muted leading-relaxed mb-4">
                Generated context is plain Markdown and JSON. Export it directly to your AI coding tool, download as files, or copy individual sections.
              </p>
              <p className="text-body-sm text-ink-muted leading-relaxed">
                The output is tool-agnostic. It works with Cursor, Claude Code, Copilot, Gemini CLI, Windsurf, and any Markdown-based AI workflow. No vendor lock-in.
              </p>
            </div>
          </div>
        </section>

        <div className="mx-auto h-px w-full max-w-6xl bg-hairline" />

        {/* ===================== CONTEXT BLUEPRINTS ===================== */}
        <section id="blueprints" className="mx-auto w-full max-w-6xl px-6 py-24 sm:py-32">
          <div className="max-w-3xl mb-12 sm:mb-16">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted block mb-3">
              Generated files
            </span>
            <h2 className="text-display-sm sm:text-display-md tracking-tight font-semibold text-ink mb-4">
              Context Blueprints
            </h2>
            <p className="text-body-lg text-ink-muted font-light leading-relaxed">
              Every Zenix project produces a set of structured context files. Each file serves a specific purpose and is designed to be consumed by AI coding agents as a source of truth.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CONTEXT_FILES.map((file) => (
              <GlowingCard key={file.name}>
                <div className="flex flex-1 flex-col gap-4 rounded-xl bg-white dark:bg-zinc-950 p-6 sm:p-8 border border-zinc-100/50 dark:border-zinc-800/60 w-full h-auto min-h-full">
                  <div>
                    <code className="font-mono text-sm font-semibold text-ink">{file.name}</code>
                    <p className="mt-1 text-xs text-ink-muted">{file.purpose}</p>
                  </div>
                  <p className="text-body-sm text-ink-muted leading-relaxed">{file.body}</p>
                </div>
              </GlowingCard>
            ))}
          </div>
        </section>

        <div className="mx-auto h-px w-full max-w-6xl bg-hairline" />

        {/* ===================== PLAYGROUND ===================== */}
        <section id="playground" className="mx-auto w-full max-w-6xl px-6 py-24 sm:py-32">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted block mb-3">
                Sandbox
              </span>
              <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] font-[var(--font-weight-540)] leading-[0.95] tracking-tight">
                AI PLAYGROUND
              </h2>
            </div>

            <div className="flex flex-col gap-8">
              <div>
                <h3 className="text-lg font-semibold text-ink mb-2">Live iteration</h3>
                <p className="text-body text-ink-muted leading-relaxed">
                  The Playground is a built-in sandbox for iterating on UI layouts, tweaking design tokens, and previewing live output. Changes reflect immediately in the preview pane.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-ink mb-2">Session history</h3>
                <p className="text-body text-ink-muted leading-relaxed">
                  Every session is saved. Return to previous conversations, review design decisions, and pick up where you left off without re-explaining context.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-ink mb-2">Design feedback</h3>
                <p className="text-body text-ink-muted leading-relaxed">
                  Feed design feedback into the Playground and the AI compiles HTML previews in real time. Iterate on visual direction before committing to implementation.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-ink mb-2">Token editing</h3>
                <p className="text-body text-ink-muted leading-relaxed">
                  Modify color palettes, typography scales, spacing, and component tokens directly. The Playground regenerates the preview with your updated design system.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto h-px w-full max-w-6xl bg-hairline" />

        {/* ===================== PROJECTS ===================== */}
        <section id="projects" className="mx-auto w-full max-w-6xl px-6 py-24 sm:py-32">
          <div className="max-w-3xl mb-12 sm:mb-16">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted block mb-3">
              Workspace
            </span>
            <h2 className="text-display-sm sm:text-display-md tracking-tight font-semibold text-ink mb-4">
              Projects & Workspace
            </h2>
            <p className="text-body-lg text-ink-muted font-light leading-relaxed">
              Organize your work into projects. Each project owns its own context, chat history, and generated artifacts. Everything stays scoped and searchable.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'Project Dashboard', body: 'Overview of all projects with recent activity, favorites, and quick access to context files.' },
              { title: 'Chat Workspace', body: 'Conversational interface tied to a specific project. Ask questions, refine context, and iterate on design decisions.' },
              { title: 'Generated Artifacts', body: 'All context files, architecture maps, and task breakdowns stored per project. Download or copy any file.' },
              { title: 'Community Templates', body: 'Browse and fork templates from other creators. Use them as starting points for new projects.' },
              { title: 'Profile & Badges', body: 'Public profile showcasing your projects, loyalty badges, and design collections.' },
              { title: 'Preferences', body: 'Theme selection (Light, Dark, Midnight), account settings, and notification preferences.' },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-hairline bg-surface-soft p-6">
                <h3 className="text-base font-semibold text-ink mb-2">{item.title}</h3>
                <p className="text-sm leading-relaxed text-ink-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mx-auto h-px w-full max-w-6xl bg-hairline" />

        {/* ===================== COMMUNITY ===================== */}
        <section id="community" className="mx-auto w-full max-w-6xl px-6 py-24 sm:py-32">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted block mb-3">
                Marketplace
              </span>
              <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] font-[var(--font-weight-540)] leading-[0.95] tracking-tight">
                CREATOR COMMUNITY
              </h2>
            </div>

            <div className="flex flex-col gap-8">
              <div>
                <h3 className="text-lg font-semibold text-ink mb-2">Templates</h3>
                <p className="text-body text-ink-muted leading-relaxed">
                  Browse verified project templates from other creators. Each template includes pre-built context files, design tokens, and architecture decisions you can fork and customize.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-ink mb-2">Profiles</h3>
                <p className="text-body text-ink-muted leading-relaxed">
                  Creator profiles display loyalty badges, published templates, and project portfolios. Follow creators to stay updated on new releases.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-ink mb-2">Search & Discover</h3>
                <p className="text-body text-ink-muted leading-relaxed">
                  Find templates by technology, use case, or creator. Fork any public template to use as a starting point for your own project.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto h-px w-full max-w-6xl bg-hairline" />

        {/* ===================== TECHNICAL REFERENCE ===================== */}
        <section className="mx-auto w-full max-w-6xl px-6 py-24 sm:py-32">
          <div className="max-w-3xl mb-12 sm:mb-16">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted block mb-3">
              Technical
            </span>
            <h2 className="text-display-sm sm:text-display-md tracking-tight font-semibold text-ink mb-4">
              Architecture & Stack
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-hairline bg-surface-soft p-6">
              <h3 className="text-base font-semibold text-ink mb-3">Frontend</h3>
              <ul className="flex flex-col gap-2 text-sm text-ink-muted">
                <li>React with Vite</li>
                <li>Tailwind CSS with design tokens</li>
                <li>GSAP + ScrollTrigger for animations</li>
                <li>Lenis smooth scrolling</li>
                <li>Framer Motion for micro-interactions</li>
                <li>Feature-based architecture</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-hairline bg-surface-soft p-6">
              <h3 className="text-base font-semibold text-ink mb-3">Backend</h3>
              <ul className="flex flex-col gap-2 text-sm text-ink-muted">
                <li>Node.js + Express</li>
                <li>Python RAG service (FastAPI)</li>
                <li>LangGraph orchestration</li>
                <li>MongoDB for persistence</li>
                <li>Firebase Auth</li>
                <li>Upstash Redis rate limiting</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-hairline bg-surface-soft p-6">
              <h3 className="text-base font-semibold text-ink mb-3">AI Layer</h3>
              <ul className="flex flex-col gap-2 text-sm text-ink-muted">
                <li>LangChain + LangGraph graphs</li>
                <li>Groq, Mistral, Gemini fallback chain</li>
                <li>Context engine with QA validation loop</li>
                <li>PM Wizard with stateful checkpointing</li>
                <li>Streaming SSE for real-time output</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-hairline bg-surface-soft p-6">
              <h3 className="text-base font-semibold text-ink mb-3">Infrastructure</h3>
              <ul className="flex flex-col gap-2 text-sm text-ink-muted">
                <li>Qdrant vectorstore for RAG</li>
                <li>Markdown chunker for document processing</li>
                <li>Firebase Admin SDK for Google auth</li>
                <li>DiceBear for avatar generation</li>
                <li>Vite build system</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="mx-auto h-px w-full max-w-6xl bg-hairline" />

        {/* ===================== FAQ ===================== */}
        <section className="mx-auto w-full max-w-6xl px-6 py-24 sm:py-32">
          <div className="max-w-3xl mb-12 sm:mb-16">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted block mb-3">
              Common questions
            </span>
            <h2 className="text-display-sm sm:text-display-md tracking-tight font-semibold text-ink mb-4">
              Frequently asked
            </h2>
          </div>

          <div className="flex flex-col border-t border-hairline">
            {FAQS.map((faq, idx) => (
              <details key={idx} className="group border-b border-hairline">
                <summary className="flex w-full cursor-pointer items-center justify-between py-6 text-left font-medium text-ink hover:text-ink-muted transition-colors list-none">
                  <span className="text-lg pr-4">{faq.question}</span>
                  <span className="text-ink-muted text-lg shrink-0 transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="text-body text-ink-muted leading-relaxed pb-6 pr-8">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        <div className="mx-auto h-px w-full max-w-6xl bg-hairline" />

        {/* ===================== CTA ===================== */}
        <section className="mx-auto w-full max-w-4xl px-6 py-24 sm:py-32 text-center">
          <h2 className="text-[clamp(2rem,5vw,3rem)] font-[var(--font-weight-540)] leading-[1.05] tracking-tight">
            Ready to build with context?
          </h2>
          <p className="mt-4 w-full max-w-prose mx-auto text-lg text-ink-muted">
            Create a free account and generate your first context package in under five minutes.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-8 py-3 text-sm text-background transition-transform hover:-translate-y-0.5"
            >
              Start building <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-foreground/60 px-8 py-3 text-sm transition-colors hover:bg-surface-elevated"
            >
              Read the About page
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
