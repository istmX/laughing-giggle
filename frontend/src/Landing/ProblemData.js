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
    keyword: 'LLMs',
    tooltip: 'Large language models'
  },
  {
    id: 'hallucinates',
    tag: 'Unreliable Code',
    title: 'Hallucinates',
    desc: 'The assistant confidently invents code dependencies, API parameters, or libraries that do not exist, causing compile errors.',
    icon: Sparkles,
    keyword: 'API parameters',
    tooltip: 'Signature function arguments'
  },
  {
    id: 'repeats-work',
    tag: 'Tech Overhead',
    title: 'Repeats Work',
    desc: 'Suggests changes you already rejected or writes duplicate helper methods that go against your existing system design decisions.',
    icon: RefreshCw,
    keyword: 'system design decisions',
    tooltip: 'Code architectural conventions'
  },
  {
    id: 'wastes-tokens',
    tag: 'Inefficient Input',
    title: 'Wastes Tokens',
    desc: 'Repeatedly sends huge directories of code to build simple items, blowing past your rate limits and budget.',
    icon: Coins,
    keyword: 'rate limits',
    tooltip: 'API request caps'
  },
  {
    id: 'no-shared-context',
    tag: 'Stale Spec',
    title: 'No Shared Context',
    desc: 'Collaborating agents do not share a single source of truth. One agent refactors while the other builds on outdated specs.',
    icon: Boxes,
    keyword: 'source of truth',
    tooltip: 'Unified layout blueprints'
  },
  {
    id: 'prompt-fatigue',
    tag: 'Cognitive Load',
    title: 'Prompt Fatigue',
    desc: 'Writing long, detailed explanations of your architectural rules over and over in every chat session to get correct outputs.',
    icon: MessageSquareOff,
    keyword: 'architectural rules',
    tooltip: 'Code standards docs'
  }
];
