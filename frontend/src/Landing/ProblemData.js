import { 
  BrainCircuit, 
  Sparkles, 
  RefreshCw, 
  Coins, 
  Boxes, 
  MessageSquareOff 
} from 'lucide-react';

export const PROBLEMS = [
  {
    id: 'ai-forgets',
    tag: 'Memory Loss',
    title: 'AI Forgets',
    desc: 'LLMs have no permanent memory. Start a new chat, and it has no idea what you built yesterday. Every session starts from scratch.',
    icon: BrainCircuit,
    colSpan: 1,
    height: 'h-[250px] sm:h-[280px]',
    gradient: 'from-zinc-900/60 to-zinc-950/20'
  },
  {
    id: 'hallucinates',
    tag: 'Unreliable Code',
    title: 'Hallucinates',
    desc: 'The assistant confidently invents code dependencies, API parameters, or libraries that do not exist, causing compile errors.',
    icon: Sparkles,
    colSpan: 1,
    height: 'h-[210px] sm:h-[230px]',
    gradient: 'from-zinc-900/50 to-zinc-950/30'
  },
  {
    id: 'repeats-work',
    tag: 'Tech Overhead',
    title: 'Repeats Work',
    desc: 'Suggests changes you already rejected or writes duplicate helper methods that go against your existing system design decisions.',
    icon: RefreshCw,
    colSpan: 1,
    height: 'h-[260px] sm:h-[290px]',
    gradient: 'from-zinc-900/70 to-zinc-950/20'
  },
  {
    id: 'wastes-tokens',
    tag: 'Inefficient Input',
    title: 'Wastes Tokens',
    desc: 'Repeatedly sends huge directories of code to build simple helper methods, blowing past your rate limits and budget.',
    icon: Coins,
    colSpan: 1,
    height: 'h-[230px] sm:h-[250px]',
    gradient: 'from-zinc-900/40 to-zinc-950/40'
  },
  {
    id: 'no-shared-context',
    tag: 'Stale Spec',
    title: 'No Shared Context',
    desc: 'Collaborating agents do not share a single source of truth. One agent refactors while the other builds on outdated specs.',
    icon: Boxes,
    colSpan: 1,
    height: 'h-[270px] sm:h-[300px]',
    gradient: 'from-zinc-900/80 to-zinc-950/20'
  },
  {
    id: 'prompt-fatigue',
    tag: 'Cognitive Load',
    title: 'Prompt Fatigue',
    desc: 'Writing long, detailed explanations of your architectural rules over and over in every chat session to get correct outputs.',
    icon: MessageSquareOff,
    colSpan: 1,
    height: 'h-[220px] sm:h-[240px]',
    gradient: 'from-zinc-900/60 to-zinc-950/30'
  }
];
