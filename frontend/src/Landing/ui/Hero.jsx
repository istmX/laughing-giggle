import { ArrowRight, Play, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ArtifactPreview from '@/Landing/components/ArtifactPreview'

const Hero = () => {
  return (
    <section id="product" className="relative overflow-hidden pt-10 pb-14 lg:pt-16 lg:pb-16">
      <div className="absolute left-1/2 top-12 h-[46rem] w-[46rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(97,168,255,0.12),transparent_60%)] blur-3xl" />
      <div className="absolute right-0 top-24 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle,rgba(139,124,255,0.12),transparent_62%)] blur-3xl" />

      <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div className="pt-6 lg:pt-12">
          <h1 className="max-w-[10ch] text-[clamp(3.6rem,7.8vw,7.1rem)] leading-[0.9] tracking-[-0.075em] text-balance font-medium">
            Your AI doesn’t
            <br />
            need more prompts.
            <br />
            It needs <span className="text-teal">context.</span>
          </h1>
          <p className="mt-6 max-w-[34rem] text-[1.07rem] leading-8 text-muted-foreground sm:text-xl">
            Zenix turns your ideas into implementation-ready context for AI coding agents.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              size="3xl"
              className="gap-3 rounded-full bg-black px-7 text-white shadow-[0_10px_24px_rgba(0,0,0,0.18)] hover:bg-black/90"
            >
              Get started for free
              <ArrowRight className="size-5" />
            </Button>
            <a href="#process" className="inline-flex items-center gap-3 text-sm text-black">
              See how it works
              <span className="flex size-8 items-center justify-center rounded-full border border-black/20">
                <Play className="size-3 fill-black text-black" />
              </span>
            </a>
          </div>
        </div>

        <div className="relative min-h-[34rem] pt-2 lg:min-h-[38rem]">
          <div className="absolute right-2 top-0 hidden h-28 w-28 rounded-full border border-dashed border-border/70 lg:block" />
          <div className="absolute right-[2%] top-[10%] hidden text-muted-foreground lg:block">
            <ArrowRight className="size-7 rotate-[18deg]" />
          </div>

          <div className="absolute right-[13%] top-0 w-[69%] rotate-[5deg]">
            <ArtifactPreview
              title="architecture.md"
              label="# System Architecture"
              summary=""
              accent="bg-border"
              lines={[]}
            >
              <div className="space-y-4 p-1">
                <div className="grid grid-cols-3 gap-4 text-[0.65rem] text-muted-foreground">
                  {['Web App', 'API Gateway', 'Auth Service', 'AI Agents', 'Data Store', 'File Storage'].map((item, index) => (
                    <div
                      key={item}
                      className="rounded-[8px] border border-border bg-white px-3 py-4 text-center shadow-[0_4px_12px_rgba(0,0,0,0.04)]"
                      style={{
                        gridColumn: index < 3 ? 'auto' : 'auto',
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
                <div className="space-y-2 pt-2 text-xs text-muted-foreground">
                  <p className="font-medium text-black">## Tech Stack</p>
                  <p>- Next.js</p>
                  <p>- Node.js</p>
                  <p>- PostgreSQL</p>
                  <p>- Redis</p>
                  <p>- Docker</p>
                </div>
              </div>
            </ArtifactPreview>
          </div>

          <div className="absolute right-[-1%] top-[26%] w-[38%] -rotate-[3deg]">
            <ArtifactPreview
              title="mission-01.md"
              label="Mission 01"
              summary="Implement Authentication System"
              accent="bg-[#1b1b1b]"
              tone="dark"
              lines={[]}
            >
              <div className="space-y-5 p-1">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/55">## Objective</p>
                  <p className="text-sm leading-6 text-white/80">
                    Build a secure authentication system with registration, login and JWT support.
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/55">## Deliverables</p>
                  <ul className="space-y-1 text-sm text-white/80">
                    <li>• auth.controller.ts</li>
                    <li>• auth.service.ts</li>
                    <li>• auth.routes.ts</li>
                    <li>• auth.middleware.ts</li>
                  </ul>
                </div>
              </div>
            </ArtifactPreview>
          </div>

          <div className="absolute left-0 bottom-[24%] w-[33%] -rotate-[7deg]">
            <ArtifactPreview
              title="agents.md"
              label="AI Agents"
              summary=""
              accent="bg-border"
              lines={[]}
            >
              <div className="space-y-3">
                {[
                  ['Planner', 'Create implementation roadmap'],
                  ['Architect', 'Design system architecture'],
                  ['Coder', 'Write clean, efficient code'],
                  ['Tester', 'Ensure quality and reliability'],
                  ['Documenter', 'Write technical documentation'],
                ].map(([role, desc]) => (
                  <div key={role} className="flex items-start gap-3">
                    <div className="flex size-6 items-center justify-center rounded-[6px] border border-border bg-black text-[0.55rem] text-white">
                      {role[0]}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-black">{role}</p>
                      <p className="text-[0.72rem] leading-5 text-muted-foreground">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ArtifactPreview>
          </div>

          <div className="absolute bottom-0 left-1/2 w-[96%] -translate-x-1/2">
            <div className="rounded-[28px] border border-border bg-white p-5 shadow-[0_20px_60px_rgba(0,0,0,0.08)] lg:p-8">
              <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
                <div className="space-y-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    What are we building?
                  </p>
                  <div className="border-b border-border pb-4 text-[1.65rem] leading-tight text-muted-foreground sm:text-[2rem]">
                    Describe your idea in a few sentences.
                    <span className="ml-1 inline-block h-6 w-0.5 translate-y-1 bg-teal align-middle" />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {['Smart Analysis', 'Context Engine', 'Mission Planner'].map((chip) => (
                    <span
                      key={chip}
                      className="rounded-full border border-border bg-white px-4 py-2 text-xs uppercase tracking-[0.2em] text-muted-foreground shadow-sm"
                    >
                      {chip}
                    </span>
                  ))}
                  <Button
                    size="3xl"
                    className="gap-3 rounded-full bg-[linear-gradient(135deg,#5f54ff_0%,#6d4dff_48%,#5d3fff_100%)] px-7 text-white shadow-[0_10px_30px_rgba(95,84,255,0.35)] hover:opacity-95"
                  >
                    <Sparkles className="size-5" />
                    Generate Context
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
