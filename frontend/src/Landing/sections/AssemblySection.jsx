import { assemblyTags, workflowSteps } from '../constants'

export function AssemblySection() {
  return (
    <section className="border-b border-white/8 px-4 py-20 sm:px-6">
      <div className="grid gap-14 lg:grid-cols-[22rem_minmax(0,1fr)]">
        <div className="space-y-5">
          <p className="text-[clamp(2.4rem,5vw,4.1rem)] leading-[0.98] tracking-[-0.04em] text-white">
            Context that assembles itself.
          </p>
          <p className="max-w-sm text-base leading-7 text-white/62">
            Your answers become structured inputs. Zenix turns them into a connected system instead of a pile of notes.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)_18rem] lg:items-center">
          <div className="space-y-3">
            {assemblyTags.map((tag) => (
              <div key={tag} className="rounded-full border border-white/12 bg-white/[0.03] px-4 py-3 text-sm text-white/78">
                {tag}
              </div>
            ))}
          </div>

          <div className="relative flex min-h-72 items-center justify-center">
            <div className="absolute h-52 w-52 rounded-[2.4rem] border border-white/14 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.22),transparent_44%)] rotate-45" />
            <div className="absolute h-36 w-36 rounded-[2rem] border border-white/14 rotate-45" />
            <div className="absolute size-4 rounded-full bg-white shadow-[0_0_24px_rgba(255,255,255,0.85)]" />
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5">
            <p className="mb-5 text-sm tracking-[0.22em] text-white/42 uppercase">architecture.md</p>
            <div className="grid gap-3">
              {['client', 'api', 'orchestrator', 'storage'].map((item) => (
                <div key={item} className="rounded-xl border border-white/10 p-3 text-sm text-white/68">{item}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-20">
        <p className="mb-8 text-center text-xs tracking-[0.3em] text-white/45 uppercase">A workflow built for modern teams</p>
        <div className="grid gap-4 lg:grid-cols-7">
          {workflowSteps.map((step, index) => (
            <article key={step.title} className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-5">
              <p className="mb-6 text-sm text-white/42">0{index + 1}</p>
              <p className="mb-2 text-base text-white">{step.title}</p>
              <p className="text-sm leading-6 text-white/58">{step.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
