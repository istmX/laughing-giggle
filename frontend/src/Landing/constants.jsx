export const MOCKUP_DATA = {
  'architecture.md': {
    iconColor: 'text-emerald-400',
    title: 'Architecture Spec',
    description: 'The platform relies on a multi-agent orchestrator utilizing LangGraph state machines for resilient prompt execution and a 3-iteration self-correction loop.',
    codeSnippet: (
      <>
        <div className="text-emerald-400 mb-1">export const <span className="text-blue-400">ContextEngine</span> = new StateGraph(&#123;</div>
        <div className="pl-4 text-zinc-300">channels: &#123;</div>
        <div className="pl-8 text-zinc-400">messages: <span className="text-orange-300">valueFromReducer</span>,</div>
        <div className="pl-8 text-zinc-400">artifacts: <span className="text-orange-300">artifactReducer</span>,</div>
        <div className="pl-4 text-zinc-300">&#125;</div>
        <div className="text-emerald-400">&#125;)</div>
      </>
    ),
    agentLogs: [
      { status: 'done', text: 'Parsed system requirements' },
      { status: 'done', text: 'Mapped LangGraph nodes' },
      { status: 'loading', text: 'Generating fallback chain logic...' }
    ],
    preview: {
      title: 'Graph Structure',
      file: 'architecture.md',
      element: (
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xs font-bold">In</div>
            <div className="flex-1 h-px bg-zinc-200" />
            <div className="w-20 h-8 rounded bg-zinc-900 text-white text-[10px] flex items-center justify-center font-medium shadow-sm">Router</div>
          </div>
          <div className="flex justify-end pr-8">
            <div className="w-px h-6 bg-zinc-200" />
          </div>
          <div className="flex justify-end">
            <div className="w-24 h-8 rounded border border-zinc-200 bg-white text-zinc-600 text-[10px] flex items-center justify-center shadow-sm">Execute</div>
          </div>
        </div>
      )
    }
  },
  'DESIGN.md': {
    iconColor: 'text-pink-400',
    title: 'Design System Tokens',
    description: 'Core design tokens, typography scales, and component specifications extracted automatically from the brand guidelines.',
    codeSnippet: (
      <>
        <div className="text-zinc-400 mb-1">/* Generated Tailwind Configuration */</div>
        <div className="text-blue-400 mb-1">theme: &#123;</div>
        <div className="pl-4 text-zinc-300">extend: &#123;</div>
        <div className="pl-8 text-zinc-400">colors: &#123;</div>
        <div className="pl-12 text-zinc-300">brand: <span className="text-emerald-300">'#0E0E11'</span>,</div>
        <div className="pl-12 text-zinc-300">accent: <span className="text-emerald-300">'#10B981'</span>,</div>
        <div className="pl-8 text-zinc-400">&#125;</div>
        <div className="pl-4 text-zinc-300">&#125;</div>
        <div className="text-blue-400">&#125;</div>
      </>
    ),
    agentLogs: [
      { status: 'done', text: 'Analyzed brand palette' },
      { status: 'done', text: 'Generated accessible contrast pairs' },
      { status: 'loading', text: 'Exporting to Tailwind CSS...' }
    ],
    preview: {
      title: 'Live Component',
      file: 'DESIGN.md',
      element: (
        <div className="p-4 bg-white border border-zinc-100 rounded-md shadow-sm space-y-4">
          <div className="h-3 w-20 bg-zinc-900 rounded" />
          <div className="h-2 w-full bg-zinc-100 rounded" />
          <div className="flex gap-2 pt-2">
            <div className="px-4 py-1.5 bg-zinc-900 rounded-full text-[10px] text-white">Primary</div>
            <div className="px-4 py-1.5 border border-zinc-200 rounded-full text-[10px] text-zinc-600">Secondary</div>
          </div>
        </div>
      )
    }
  },
  'AGENTS.md': {
    iconColor: 'text-emerald-400',
    title: 'Agent Capabilities',
    description: 'Configuration for autonomous developer agents, defining their scopes, tools, and read/write permissions across the repository.',
    codeSnippet: (
      <>
        <div className="text-orange-300 mb-1">name: <span className="text-zinc-300">"Frontend Specialist"</span></div>
        <div className="text-orange-300 mb-1">role: <span className="text-zinc-300">"UI Engineer"</span></div>
        <div className="text-orange-300 mb-1">tools:</div>
        <div className="pl-4 text-emerald-300">- name: <span className="text-zinc-300">"read_file"</span></div>
        <div className="pl-4 text-emerald-300">- name: <span className="text-zinc-300">"write_file"</span></div>
        <div className="pl-4 text-emerald-300">- name: <span className="text-zinc-300">"run_npm_build"</span></div>
        <div className="text-orange-300 mt-2 mb-1">model: <span className="text-zinc-300">"gemini-2.5-pro"</span></div>
      </>
    ),
    agentLogs: [
      { status: 'done', text: 'Validated agent tool scopes' },
      { status: 'done', text: 'Registered Frontend Specialist' },
      { status: 'loading', text: 'Booting agent container...' }
    ],
    preview: {
      title: 'Agent Status',
      file: 'AGENTS.md',
      element: (
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between p-2 rounded border border-zinc-100 bg-zinc-50">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-medium text-zinc-700">UI Engineer</span>
            </div>
            <span className="text-[9px] text-zinc-400 font-mono">Idle</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded border border-zinc-100 bg-zinc-50">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[10px] font-medium text-zinc-700">Architect</span>
            </div>
            <span className="text-[9px] text-zinc-400 font-mono">Working...</span>
          </div>
        </div>
      )
    }
  },
  'TASKS.md': {
    iconColor: 'text-orange-400',
    title: 'Project Roadmap',
    description: 'Current sprint tasks broken down into sequential steps for the AI agents to execute autonomously.',
    codeSnippet: (
      <>
        <div className="text-zinc-300 mb-1">## Sprint 1: Foundation</div>
        <div className="text-zinc-400 mb-1">- [x] Setup Next.js App Router</div>
        <div className="text-zinc-400 mb-1">- [x] Configure Tailwind design tokens</div>
        <div className="text-emerald-400 mb-1">- [ ] Implement Auth Context</div>
        <div className="pl-6 text-zinc-500 mb-1">Blocked: Waiting on database schema</div>
        <div className="text-emerald-400 mb-1">- [ ] Build Dashboard Layout</div>
      </>
    ),
    agentLogs: [
      { status: 'done', text: 'Completed Next.js setup' },
      { status: 'done', text: 'Completed Tailwind config' },
      { status: 'loading', text: 'Analyzing Auth Context requirements...' }
    ],
    preview: {
      title: 'Task Progress',
      file: 'TASKS.md',
      element: (
        <div className="space-y-3 pt-2">
          <div>
            <div className="flex justify-between text-[10px] mb-1">
              <span className="text-zinc-600 font-medium">Sprint 1</span>
              <span className="text-zinc-400">50%</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
              <div className="h-full w-1/2 bg-zinc-900 rounded-full" />
            </div>
          </div>
          <div className="pt-2 border-t border-zinc-100">
            <div className="text-[10px] text-zinc-500 mb-1">Current Focus:</div>
            <div className="text-[11px] font-medium text-zinc-800">Auth Context Setup</div>
          </div>
        </div>
      )
    }
  }
};
