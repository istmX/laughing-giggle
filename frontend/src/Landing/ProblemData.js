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
    tooltipTitle: 'LLMs',
    tooltipDesc: 'Large Language Models generate responses based on context but do not permanently remember previous conversations.'
  },
  {
    id: 'hallucinates',
    tag: 'Unreliable Code',
    title: 'Hallucinates',
    desc: 'The assistant confidently invents code dependencies, API parameters, or libraries that do not exist, causing compile errors.',
    icon: Sparkles,
    keyword: 'API parameters',
    tooltipTitle: 'API Parameters',
    tooltipDesc: 'Function signature arguments passed to backend endpoints that must align with actual compiler declarations.'
  },
  {
    id: 'repeats-work',
    tag: 'Tech Overhead',
    title: 'Repeats Work',
    desc: 'Suggests changes you already rejected or writes duplicate helper methods that go against your existing system design decisions.',
    icon: RefreshCw,
    keyword: 'system design decisions',
    tooltipTitle: 'System Design',
    tooltipDesc: 'Architectural constraints, directory layouts, and module patterns that define how your codebase fits together.'
  },
  {
    id: 'wastes-tokens',
    tag: 'Inefficient Input',
    title: 'Wastes Tokens',
    desc: 'Repeatedly sends huge directories of code to build simple items, blowing past your rate limits and budget.',
    icon: Coins,
    keyword: 'rate limits',
    tooltipTitle: 'Rate Limits',
    tooltipDesc: 'API request caps enforced by LLM providers to throttle token consumption volume per minute or project budget.'
  },
  {
    id: 'no-shared-context',
    tag: 'Stale Spec',
    title: 'No Shared Context',
    desc: 'Collaborating agents do not share a single source of truth. One agent refactors while the other builds on outdated specs.',
    icon: Boxes,
    keyword: 'source of truth',
    tooltipTitle: 'Source of Truth',
    tooltipDesc: 'A unified workspace specification document ensuring all collaborating agents build on synchronized blueprints.'
  },
  {
    id: 'prompt-fatigue',
    tag: 'Cognitive Load',
    title: 'Prompt Fatigue',
    desc: 'Writing long, detailed explanations of your architectural rules over and over in every chat session to get correct outputs.',
    icon: MessageSquareOff,
    keyword: 'architectural rules',
    tooltipTitle: 'Architectural Rules',
    tooltipDesc: 'Coding guidelines, design tokens, and structural conventions stored inside AGENTS.md to instruct code generation.'
  }
];
