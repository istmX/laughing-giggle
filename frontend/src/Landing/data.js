import {
  BrainCircuit,
  Code2,
  GitBranch,
  Layers3,
  PanelsTopLeft,
  PenLine,
  Rocket,
  Sparkles,
  Workflow,
  FileCode2,
  PanelTop,
} from 'lucide-react'

export const navLinks = [
  { label: 'Product', href: '#product' },
  { label: 'How it works', href: '#process' },
  { label: 'Docs', href: '#generated' },
  { label: 'Ecosystem', href: '#ecosystem' },
  { label: 'About', href: '#final-cta' },
]

export const processSteps = [
  {
    number: '01',
    title: 'Idea',
    text: 'Capture the rough software idea without turning it into a long prompt chain.',
    icon: Sparkles,
  },
  {
    number: '02',
    title: 'Requirements',
    text: 'Collect the missing product details, constraints, and decision points.',
    icon: PenLine,
  },
  {
    number: '03',
    title: 'Architecture',
    text: 'Shape system structure, dependencies, and the implementation path.',
    icon: Layers3,
  },
  {
    number: '04',
    title: 'Context',
    text: 'Package the project intelligence into reusable developer artifacts.',
    icon: FileCode2,
  },
  {
    number: '05',
    title: 'Missions',
    text: 'Break the work into precise, AI-ready implementation missions.',
    icon: Workflow,
  },
  {
    number: '06',
    title: 'Build',
    text: 'Hand off a shared plan that every agent can follow consistently.',
    icon: Rocket,
  },
]

export const generatedArtifacts = [
  {
    title: 'agents.md',
    label: 'AI agents & workflows',
    accent: 'bg-doc-blue',
    variant: 'agents',
    summary: 'Who does what, which prompts they need, and the operating rules.',
    lines: ['Planner', 'Architect', 'Coder', 'Tester', 'Documenter'],
  },
  {
    title: 'architecture.md',
    label: 'System architecture',
    accent: 'bg-doc-orange',
    variant: 'architecture',
    summary: 'A clear system map with services, storage, and dependencies.',
    lines: ['Web app', 'API gateway', 'Auth service', 'Data store'],
  },
  {
    title: 'build-plan.md',
    label: 'Development plan',
    accent: 'bg-doc-green',
    variant: 'plan',
    summary: 'Sequenced phases, milestones, and delivery checkpoints.',
    lines: ['Foundation', 'Core features', 'Advanced work', 'Polish and ship'],
  },
  {
    title: 'ui-rules.md',
    label: 'UI guidelines',
    accent: 'bg-doc-purple',
    variant: 'ui',
    summary: 'Interface principles, tokens, spacing, and visual behavior.',
    lines: ['Clarity', 'Consistency', 'Accessibility', 'Minimalism'],
  },
  {
    title: 'mission-01.md',
    label: 'Implementation mission',
    accent: 'bg-teal',
    tone: 'dark',
    variant: 'mission',
    summary: 'A scoped task with objective, deliverables, and acceptance criteria.',
    lines: ['Objective', 'Deliverables', 'Validation', 'Next mission'],
  },
]

export const ecosystemTools = [
  { name: 'Claude Code', icon: Code2, note: 'Turn context into code.' },
  { name: 'Gemini CLI', icon: PanelTop, note: 'Follow structured project docs.' },
  { name: 'OpenAI Codex', icon: BrainCircuit, note: 'Start from the same source of truth.' },
  { name: 'Cursor', icon: PanelsTopLeft, note: 'Keep the editor aligned.' },
  { name: 'Windsurf', icon: Workflow, note: 'Move through the build flow.' },
  { name: 'GitHub Copilot', icon: GitBranch, note: 'Stay in sync with the repo.' },
]

export const bentoCards = [
  {
    title: 'Architecture',
    text: 'Map services, responsibilities, and the system boundary before implementation begins.',
    variant: 'architecture',
  },
  {
    title: 'AI Agents',
    text: 'Define how specialized agents collaborate, review, and hand work forward.',
    variant: 'agents',
  },
  {
    title: 'Mission Generation',
    text: 'Convert broad scope into tight, executable missions with clear deliverables.',
    variant: 'missions',
  },
  {
    title: 'Documentation',
    text: 'Package the project into artifacts that stay readable for humans and tools.',
    variant: 'docs',
  },
  {
    title: 'Development Workflow',
    text: 'Make the next step obvious from idea to release.',
    variant: 'workflow',
  },
  {
    title: 'Team Alignment',
    text: 'Give every contributor the same context so decisions do not drift.',
    variant: 'alignment',
  },
]

export const galleryItems = [
  {
    title: 'Architecture',
    caption: 'Preview the system map',
    accent: 'bg-doc-orange',
    lines: ['Web app', 'API', 'Storage', 'Auth'],
  },
  {
    title: 'Missions',
    caption: 'Scoped tasks for agents',
    accent: 'bg-doc-green',
    lines: ['Goal', 'Deliverables', 'Validation', 'Next step'],
  },
  {
    title: 'Documentation',
    caption: 'Readable project outputs',
    accent: 'bg-doc-blue',
    lines: ['agents.md', 'architecture.md', 'build-plan.md'],
  },
  {
    title: 'Agents',
    caption: 'Specialized collaborators',
    accent: 'bg-doc-purple',
    lines: ['Planner', 'Architect', 'Coder', 'Tester'],
  },
  {
    title: 'Deployment',
    caption: 'Ship with confidence',
    accent: 'bg-teal',
    tone: 'dark',
    lines: ['Checklists', 'Builds', 'Release notes'],
  },
  {
    title: 'Design System',
    caption: 'Rules that hold the UI together',
    accent: 'bg-teal',
    lines: ['Type scale', 'Spacing', 'Tokens', 'Components'],
  },
]
