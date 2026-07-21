import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Folder, 
  Sparkles, 
  User, 
  Plus, 
  CheckCircle, 
  Lock,
  Globe,
  Users,
  ArrowRight
} from 'lucide-react';
import { GlowingEffect } from '@/components/ui/glowing-effect';

const MOCK_PROJECTS = [
  {
    id: 'scribble-app',
    title: 'ScribbleBox Expo App',
    category: 'Mobile App',
    files: 12,
    date: '2h ago',
    desc: 'Conversational scrapbook memory box application with customized RAG storage.',
    spec: 'AGENTS.md, TASKS.md, ui-tokens.md, app.json, index.tsx'
  },
  {
    id: 'zenix-marketing',
    title: 'Zenix Landing Page',
    category: 'Web App',
    files: 15,
    date: 'Just now',
    desc: 'Premium landing page with rolling buttons and interactive dashboard previews.',
    spec: 'AGENTS.md, ui-tokens.md, FAQ.jsx, Hero.jsx, progress.md'
  },
  {
    id: 'quantum-core',
    title: 'Quantum Analytics',
    category: 'AI Pipeline',
    files: 8,
    date: '1d ago',
    desc: 'Context graphs and database schema analyzer for trading models.',
    spec: 'AGENTS.md, schema.sql, connection.py, pipeline_task.md'
  }
];

const MOCK_USERS = [
  {
    id: 'usr-1',
    name: 'alex_dev',
    role: 'Frontend Engineer',
    projects: 14,
    followers: 120,
    avatarColor: 'from-zinc-700 to-zinc-900',
    badges: ['Pro', 'Contributor']
  },
  {
    id: 'usr-2',
    name: 'design_pro',
    role: 'UI/UX Architect',
    projects: 28,
    followers: 432,
    avatarColor: 'from-zinc-800 to-zinc-950',
    badges: ['Pro']
  },
  {
    id: 'usr-3',
    name: 'ml_wizard',
    role: 'AI Model Engineer',
    projects: 9,
    followers: 78,
    avatarColor: 'from-zinc-600 to-zinc-800',
    badges: ['Contributor']
  }
];

const PLAYGROUND_PRESETS = [
  {
    label: "Generate Auth UI",
    userPrompt: "Create a login form with a simple dark border",
    response: "Zenix created a premium Login page. Added component: features/auth/Login.jsx",
    preview: (
      <div className="flex flex-col items-center justify-center h-full p-4 bg-zinc-900 rounded-lg text-white border border-zinc-800">
        <div className="w-full max-w-[240px] p-4 bg-black border border-zinc-800 rounded-xl shadow-md">
          <div className="text-center mb-3">
            <h4 className="text-[11px] font-semibold tracking-tight text-zinc-100">Welcome Back</h4>
            <p className="text-[9px] text-zinc-500">Sign in to Zenix</p>
          </div>
          <div className="space-y-1.5 mb-3">
            <div className="h-6 w-full bg-zinc-900 border border-zinc-850 rounded px-2 text-[9px] flex items-center text-zinc-600">email@example.com</div>
            <div className="h-6 w-full bg-zinc-900 border border-zinc-850 rounded px-2 text-[9px] flex items-center text-zinc-600">••••••••</div>
          </div>
          <button className="w-full h-7 bg-zinc-800 hover:bg-zinc-755 border border-zinc-700 transition-colors text-[9px] font-semibold rounded-md text-zinc-200">
            Sign In
          </button>
        </div>
      </div>
    )
  },
  {
    label: "Build Bento Grid",
    userPrompt: "Create a 3-column bento grid for features",
    response: "Zenix compiled ui-tokens.md & generated features/landing/Bento.jsx",
    preview: (
      <div className="grid grid-cols-3 gap-1.5 h-full p-3 bg-zinc-950 rounded-lg text-white border border-zinc-800">
        <div className="col-span-2 bg-zinc-900 p-2.5 rounded-lg border border-zinc-800 flex flex-col justify-between">
          <span className="text-[8px] font-bold uppercase tracking-wider text-zinc-400">Context Engine</span>
          <span className="text-[9px] font-medium leading-tight text-zinc-300">Structured specifications</span>
        </div>
        <div className="col-span-1 bg-zinc-900 p-2 rounded-lg border border-zinc-800 flex flex-col justify-between">
          <span className="text-[8px] text-zinc-500">Speed</span>
          <span className="text-[10px] font-bold text-zinc-300">100ms</span>
        </div>
        <div className="col-span-1 bg-zinc-900 p-2 rounded-lg border border-zinc-800 flex flex-col justify-between">
          <span className="text-[8px] text-zinc-500">Theme</span>
          <span className="text-[9px] font-semibold text-zinc-300">Default</span>
        </div>
        <div className="col-span-2 bg-zinc-900 p-2.5 rounded-lg border border-zinc-800 flex flex-col justify-between">
          <span className="text-[8px] text-zinc-500">Loyalty Rewards</span>
          <div className="flex gap-1 items-center">
            <span className="w-1.5 h-1.5 bg-zinc-650 rounded-full" />
            <span className="text-[8px] font-bold text-zinc-350">Founder Badge</span>
          </div>
        </div>
      </div>
    )
  },
  {
    label: "Create Team Panel",
    userPrompt: "Design an active member card with green online dot",
    response: "Zenix applied layout tokens. Created features/profile/Team.jsx",
    preview: (
      <div className="flex items-center justify-center h-full p-4 bg-zinc-900 rounded-lg text-white border border-zinc-800">
        <div className="flex items-center gap-2.5 bg-zinc-950 border border-zinc-800 p-2.5 rounded-xl w-56 shadow-md">
          <div className="relative w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-[11px] text-zinc-300 shrink-0 border border-zinc-700">
            IS
            <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 border border-zinc-950 rounded-full" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-bold truncate text-zinc-200">istm</div>
            <div className="text-[8px] text-zinc-500 truncate">Active now · building apps</div>
          </div>
          <span className="ml-auto text-[8px] font-mono font-medium text-zinc-400 border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 rounded-full shrink-0">Founder</span>
        </div>
      </div>
    )
  }
];

export default function InteractiveMiniDashboard() {
  const [activeTab, setActiveTab] = useState('projects'); // 'projects' | 'playground' | 'profile' | 'community'
  const [selectedProject, setSelectedProject] = useState(null);
  
  // Playground state
  const [chatHistory, setChatHistory] = useState([
    { role: 'user', text: 'Create a glassmorphic context card' },
    { role: 'agent', text: 'Zenix Agent generated design tokens and configured layout guide.' }
  ]);
  const [activePresetIndex, setActivePresetIndex] = useState(0);
  const [isCompiling, setIsCompiling] = useState(false);

  // Profile state
  const [isPublic, setIsPublic] = useState(true);

  const handleActionRedirect = () => {
    window.location.href = '/signup';
  };

  const handleApplyPreset = (index) => {
    if (isCompiling) return;
    setIsCompiling(true);
    
    // Simulate generation loop
    setTimeout(() => {
      setActivePresetIndex(index);
      setChatHistory([
        { role: 'user', text: PLAYGROUND_PRESETS[index].userPrompt },
        { role: 'agent', text: PLAYGROUND_PRESETS[index].response }
      ]);
      setIsCompiling(false);
    }, 1000);
  };

  // Enforce premium dark HUD look to avoid colors and keep theme simple as requested
  const currentTheme = {
    bg: 'bg-[#0E0E11] text-zinc-300 border-zinc-800/80',
    sidebar: 'bg-[#141417] border-zinc-800/60',
    card: 'bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700/60',
    textMuted: 'text-zinc-500',
    accentBorder: 'border-zinc-800/50',
    innerBg: 'bg-zinc-900/85',
    titleColor: 'text-zinc-100'
  };

  return (
    <div className="relative w-full min-h-[480px] lg:min-h-[430px] xl:min-h-0 xl:aspect-[16/9.2] rounded-2xl border border-zinc-800/80 p-1.5 bg-zinc-900/30">
      
      {/* Proximity Glow Outline Border */}
      <GlowingEffect
        spread={50}
        glow={true}
        disabled={false}
        proximity={70}
        inactiveZone={0.01}
      />
      
      {/* Inner Dashboard HUD */}
      <div className={`relative flex flex-col w-full h-full ${currentTheme.bg} overflow-hidden rounded-xl border border-zinc-800/50 text-left transition-all duration-300`}>
        
        {/* 1. Header Bar */}
        <div className={`h-11 border-b ${currentTheme.accentBorder} flex items-center justify-between px-4 shrink-0 bg-black/20`}>
          {/* Mac traffic light buttons */}
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ED6A5E]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#F4BF4F]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#61C554]" />
          </div>
          
          {/* Workspace indicator */}
          <div className={`text-[10px] font-mono tracking-wider ${currentTheme.textMuted} uppercase`}>
            Zenix Workspace / <span className="font-semibold text-zinc-350">@istm</span>
          </div>

          <div className={`text-[9.5px] font-mono ${currentTheme.textMuted}`}>
            v2.1.0
          </div>
        </div>

        {/* Mobile top tabs navigation (only visible on mobile to avoid squeezing/no-width problem) */}
        <div className="flex sm:hidden border-b border-zinc-800 bg-[#141417] px-2 py-1.5 overflow-x-auto gap-1.5 shrink-0">
          <button 
            onClick={() => { setActiveTab('projects'); setSelectedProject(null); }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-medium whitespace-nowrap cursor-pointer ${
              activeTab === 'projects' ? 'bg-zinc-800 text-zinc-100 border border-zinc-700' : 'text-zinc-500'
            }`}
          >
            <Folder className="w-3 h-3" /> Projects
          </button>
          <button 
            onClick={() => { setActiveTab('playground'); setSelectedProject(null); }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-medium whitespace-nowrap cursor-pointer ${
              activeTab === 'playground' ? 'bg-zinc-800 text-zinc-100 border border-zinc-700' : 'text-zinc-500'
            }`}
          >
            <Sparkles className="w-3 h-3" /> Playground
          </button>
          <button 
            onClick={() => { setActiveTab('profile'); setSelectedProject(null); }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-medium whitespace-nowrap cursor-pointer ${
              activeTab === 'profile' ? 'bg-zinc-800 text-zinc-100 border border-zinc-700' : 'text-zinc-500'
            }`}
          >
            <User className="w-3 h-3" /> Profile
          </button>
          <button 
            onClick={() => { setActiveTab('community'); setSelectedProject(null); }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-medium whitespace-nowrap cursor-pointer ${
              activeTab === 'community' ? 'bg-zinc-800 text-zinc-100 border border-zinc-700' : 'text-zinc-500'
            }`}
          >
            <Users className="w-3 h-3" /> Users
          </button>
        </div>

        {/* 2. Main Area */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          
          {/* 2.1 Sidebar (hidden on mobile, visible on tablet/desktop) */}
          <div className={`hidden sm:flex w-36 sm:w-44 border-r ${currentTheme.accentBorder} ${currentTheme.sidebar} p-2.5 flex flex-col gap-1 shrink-0`}>
            <div className={`text-[9px] font-mono tracking-[0.15em] ${currentTheme.textMuted} uppercase mb-2 px-2`}>
              Console Links
            </div>
            
            <button 
              onClick={() => { setActiveTab('projects'); setSelectedProject(null); }}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-left transition-colors cursor-pointer w-full ${
                activeTab === 'projects' 
                  ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 font-semibold shadow-sm' 
                  : `${currentTheme.textMuted} hover:text-zinc-200 hover:bg-zinc-800/30 border border-transparent`
              }`}
            >
              <Folder className="w-3.5 h-3.5 shrink-0" />
              <span>All Projects</span>
            </button>

            <button 
              onClick={() => { setActiveTab('playground'); setSelectedProject(null); }}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-left transition-colors cursor-pointer w-full ${
                activeTab === 'playground' 
                  ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 font-semibold shadow-sm' 
                  : `${currentTheme.textMuted} hover:text-zinc-200 hover:bg-zinc-800/30 border border-transparent`
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              <span>Playground</span>
            </button>

            <button 
              onClick={() => { setActiveTab('profile'); setSelectedProject(null); }}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-left transition-colors cursor-pointer w-full ${
                activeTab === 'profile' 
                  ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 font-semibold shadow-sm' 
                  : `${currentTheme.textMuted} hover:text-zinc-200 hover:bg-zinc-800/30 border border-transparent`
              }`}
            >
              <User className="w-3.5 h-3.5 shrink-0" />
              <span>My Profile</span>
            </button>

            <button 
              onClick={() => { setActiveTab('community'); setSelectedProject(null); }}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] font-medium text-left transition-colors cursor-pointer w-full ${
                activeTab === 'community' 
                  ? 'bg-zinc-800 text-zinc-100 border border-zinc-700 font-semibold shadow-sm' 
                  : `${currentTheme.textMuted} hover:text-zinc-200 hover:bg-zinc-800/30 border border-transparent`
              }`}
            >
              <Users className="w-3.5 h-3.5 shrink-0" />
              <span>Community</span>
            </button>
          </div>

          {/* 2.2 Content Panel */}
          <div className="flex-1 flex flex-col min-w-0 p-4 sm:p-5 overflow-y-auto">
            
            {/* TAB 1: ALL PROJECTS */}
            {activeTab === 'projects' && !selectedProject && (
              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h3 className={`text-xs sm:text-sm font-bold ${currentTheme.titleColor}`}>Active Codebases</h3>
                    <p className={`text-[10px] ${currentTheme.textMuted}`}>Click a project to view generated AI blueprints.</p>
                  </div>
                  <button 
                    onClick={handleActionRedirect}
                    className="flex items-center gap-1 bg-[#18181B] border border-zinc-800 hover:bg-zinc-800 text-zinc-200 transition-colors text-[9.5px] font-semibold px-2.5 py-1.5 rounded-md cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> New Project
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {MOCK_PROJECTS.map((proj) => (
                    <div
                      key={proj.id}
                      onClick={() => setSelectedProject(proj)}
                      className={`p-3 rounded-xl border ${currentTheme.card} transition-all cursor-pointer flex flex-col justify-between min-h-[110px]`}
                    >
                      <div className="w-full">
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <h4 className="text-[11.5px] font-bold tracking-tight truncate w-full">{proj.title}</h4>
                          <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-zinc-850 text-zinc-350 border border-zinc-800 whitespace-nowrap shrink-0">{proj.category}</span>
                        </div>
                        <p className={`text-[10px] ${currentTheme.textMuted} line-clamp-2 leading-relaxed mb-2 w-full break-words`}>
                          {proj.desc}
                        </p>
                      </div>
                      <div className="flex items-center justify-between border-t border-zinc-800/20 pt-2 text-[9px] font-mono text-zinc-500">
                        <span>{proj.files} files</span>
                        <span>{proj.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PROJECT DETAIL SPEC WORKSPACE */}
            {activeTab === 'projects' && selectedProject && (
              <div className="flex-1 flex flex-col min-h-0">
                <button 
                  onClick={() => setSelectedProject(null)}
                  className={`text-[10px] font-mono ${currentTheme.textMuted} hover:text-zinc-300 mb-2.5 text-left flex items-center gap-1 cursor-pointer`}
                >
                  ← Back to active projects
                </button>

                <div className={`p-3.5 rounded-xl border ${currentTheme.card} flex-1 flex flex-col min-h-0`}>
                  <div className="flex justify-between items-start border-b border-zinc-805 pb-2.5 mb-2.5 gap-4">
                    <div className="min-w-0">
                      <h3 className="text-[12px] font-bold text-zinc-200 truncate">{selectedProject.title} Workspace</h3>
                      <p className={`text-[9.5px] ${currentTheme.textMuted} truncate mt-0.5`}>{selectedProject.desc}</p>
                    </div>
                    <button 
                      onClick={handleActionRedirect}
                      className="text-[9px] font-mono text-zinc-400 bg-zinc-950 border border-zinc-800 px-2.5 py-0.5 rounded-full shrink-0 cursor-pointer hover:bg-zinc-900"
                    >
                      Export Spec
                    </button>
                  </div>

                  <div className="flex-1 grid grid-cols-3 gap-3 min-h-0">
                    <div className="col-span-1 flex flex-col gap-1.5">
                      <span className={`text-[8px] font-mono uppercase tracking-widest ${currentTheme.textMuted}`}>Files</span>
                      {selectedProject.spec.split(', ').map((file) => (
                        <div key={file} className="flex items-center justify-between bg-zinc-950 border border-zinc-850 p-2 rounded-lg text-[9.5px] font-mono text-zinc-350">
                          <span className="truncate mr-1">{file}</span>
                          <CheckCircle className="w-3 h-3 text-zinc-400 shrink-0" />
                        </div>
                      ))}
                    </div>
                    
                    <div className="col-span-2 bg-zinc-950 border border-zinc-850 p-3 rounded-lg flex flex-col font-mono text-[10px] text-zinc-400 overflow-y-auto">
                      <div className="text-zinc-500 border-b border-zinc-855 pb-1 mb-2"># {selectedProject.title} / AGENTS.md</div>
                      <div className="text-zinc-350 font-bold mb-1">role: AI Context Orchestrator</div>
                      <div className="text-zinc-500 mb-2"># Directives & Standards</div>
                      <div className="truncate">• Strict functional React patterns</div>
                      <div className="truncate">• Zero hardcoded colors, enforce system tokens</div>
                      <div className="truncate">• responsive-first scaling breakpoints</div>
                      <div className="text-zinc-550 mt-2">// Sync verified by Zenix compiler</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: AI PLAYGROUND */}
            {activeTab === 'playground' && (
              <div className="flex-1 flex flex-col min-h-0">
                <div className="mb-2.5">
                  <h3 className={`text-xs sm:text-sm font-bold ${currentTheme.titleColor}`}>AI Sandbox Playground</h3>
                  <p className={`text-[10px] ${currentTheme.textMuted}`}>Select prompt preset to trigger real-time UI code preview builds.</p>
                </div>

                <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-3.5 min-h-0">
                  {/* Left: prompt presets & simulated chat */}
                  <div className="lg:col-span-2 flex flex-col gap-2 min-h-0 justify-between min-w-0">
                    <div className="flex flex-col gap-1 shrink-0">
                      <span className={`text-[8px] font-mono uppercase tracking-widest ${currentTheme.textMuted}`}>Prompt Preset</span>
                      <div className="flex flex-col gap-1">
                        {PLAYGROUND_PRESETS.map((preset, i) => (
                          <button
                            key={i}
                            onClick={() => handleApplyPreset(i)}
                            className={`px-3 py-1.5 rounded-lg border text-left text-[10px] font-semibold transition-all cursor-pointer truncate ${
                              activePresetIndex === i 
                                ? 'bg-zinc-800 text-zinc-100 border-zinc-700'
                                : 'bg-zinc-950 border-zinc-850 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/60'
                            }`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Chat Logs Pane - Fix width squishing with w-full & flex properties */}
                    <div className="flex-1 bg-zinc-950 border border-zinc-850 rounded-xl p-3 flex flex-col justify-end min-h-[120px] font-mono text-[10px] w-full min-w-0">
                      <div className="flex-1 overflow-y-auto space-y-2.5 mb-1.5 flex flex-col justify-end w-full">
                        {chatHistory.map((msg, i) => (
                          <div 
                            key={i} 
                            className={`p-2 rounded-lg max-w-[90%] break-words w-auto shrink-0 ${
                              msg.role === 'user' 
                                ? 'bg-zinc-900 text-zinc-100 border border-zinc-800' 
                                : 'bg-zinc-950 border border-zinc-850 text-zinc-400'
                            }`}
                          >
                            <div className="text-[7.5px] opacity-40 uppercase tracking-widest mb-0.5 font-bold text-zinc-500">
                              {msg.role === 'user' ? 'Prompt' : 'Zenix Agent'}
                            </div>
                            <div className="leading-normal w-full break-words text-[9.5px]">
                              {msg.text}
                            </div>
                          </div>
                        ))}
                        {isCompiling && (
                          <div className="text-zinc-400 animate-pulse text-[9px] flex items-center gap-1.5 shrink-0">
                            <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-ping" />
                            Compiling specs & building layout...
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Visual Sandbox Preview */}
                  <div className="lg:col-span-3 bg-zinc-950 border border-zinc-850 rounded-xl p-3 flex flex-col min-h-[200px] min-w-0">
                    <div className="flex items-center justify-between mb-2 border-b border-zinc-850 pb-1.5 shrink-0">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-zinc-550 border border-zinc-700 animate-pulse" />
                        <span className="text-[9px] font-mono tracking-wider text-zinc-550 uppercase">Live Preview Frame</span>
                      </div>
                      <button 
                        onClick={handleActionRedirect}
                        className="text-[8.5px] font-mono text-zinc-400 hover:text-zinc-200 cursor-pointer flex items-center gap-1"
                      >
                        Launch Sandbox <ArrowRight className="w-2.5 h-2.5" />
                      </button>
                    </div>
                    
                    <div className="flex-1 relative min-h-0 w-full">
                      <AnimatePresence mode="wait">
                        <motion.div 
                          key={activePresetIndex}
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ duration: 0.15 }}
                          className="w-full h-full"
                        >
                          {PLAYGROUND_PRESETS[activePresetIndex].preview}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: PROFILE */}
            {activeTab === 'profile' && (
              <div className="flex-1 flex flex-col justify-center max-w-lg mx-auto w-full min-w-0">
                <div className={`p-4 sm:p-5 rounded-2xl border ${currentTheme.card} bg-zinc-900/40 shadow-xl flex flex-col gap-4 w-full`}>
                  {/* Clean up spacing: use dynamic flex wrapping for avatar/username/badges to prevent squishing */}
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 w-full min-w-0 text-center sm:text-left border-b border-zinc-800/40 pb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-900 flex items-center justify-center font-bold text-sm text-zinc-200 shrink-0 border border-zinc-800">
                      IS
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-[13px] font-bold text-zinc-100">istm</h3>
                      <p className={`text-[10px] ${currentTheme.textMuted}`}>@istm · zenix.dev/u/istm</p>
                    </div>
                    
                    {/* Badges */}
                    <div className="flex items-center gap-1.5 shrink-0 mt-2 sm:mt-0">
                      <span className="text-[8px] font-mono font-semibold tracking-wider text-zinc-400 border border-zinc-800 bg-zinc-900 px-2 py-0.5 rounded-full">
                        Founder
                      </span>
                      <span className="text-[8px] font-mono font-semibold tracking-wider text-zinc-400 border border-zinc-800 bg-zinc-900 px-2 py-0.5 rounded-full">
                        Pro
                      </span>
                    </div>
                  </div>

                  {/* Bio details - prevent flex compression with w-full and block paragraphs */}
                  <div className={`p-3 rounded-xl ${currentTheme.innerBg} border border-zinc-800 text-[10.5px] leading-relaxed w-full`}>
                    <div className={`font-mono text-[8px] uppercase tracking-wider ${currentTheme.textMuted} mb-1 font-bold`}>
                      Biography
                    </div>
                    <p className="w-full text-zinc-300 leading-normal block text-[10.5px] whitespace-normal">
                      "Building next-generation context-aware codebases using AI orchestration models and design tokens."
                    </p>
                  </div>

                  {/* Profile toggle */}
                  <div className="flex justify-between items-center border-t border-zinc-800/20 pt-3.5">
                    <div className="min-w-0 flex-1 pr-4">
                      <div className="text-[11px] font-bold">Public Developer Profile</div>
                      <p className={`text-[9px] ${currentTheme.textMuted} truncate mt-0.5`}>Visible to the Zenix developer registry.</p>
                    </div>
                    
                    <button 
                      onClick={() => setIsPublic(!isPublic)}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer shrink-0 ${isPublic ? 'bg-zinc-800 border border-zinc-700' : 'bg-zinc-950 border border-zinc-850'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-zinc-300 transition-transform duration-200 ${isPublic ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {/* Creator Analytics Row */}
                  <div className="grid grid-cols-3 gap-2 text-center border-t border-zinc-800/20 pt-3.5 font-mono w-full">
                    <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-850 cursor-pointer hover:border-zinc-800 transition-colors" onClick={handleActionRedirect}>
                      <div className="text-[13px] font-bold text-zinc-300">12</div>
                      <div className="text-[7.5px] uppercase tracking-wider text-zinc-500 mt-0.5">Projects</div>
                    </div>
                    <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-855 cursor-pointer hover:border-zinc-800 transition-colors" onClick={handleActionRedirect}>
                      <div className="text-[13px] font-bold text-zinc-300">248</div>
                      <div className="text-[7.5px] uppercase tracking-wider text-zinc-500 mt-0.5">Followers</div>
                    </div>
                    <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-855 cursor-pointer hover:border-zinc-800 transition-colors" onClick={handleActionRedirect}>
                      <div className="text-[13px] font-bold text-zinc-300">185</div>
                      <div className="text-[7.5px] uppercase tracking-wider text-zinc-500 mt-0.5">Following</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: COMMUNITY USERS (Show mock community users instead of templates) */}
            {activeTab === 'community' && (
              <div className="flex-1 flex flex-col min-h-0">
                <div className="mb-3">
                  <h3 className={`text-xs sm:text-sm font-bold ${currentTheme.titleColor}`}>Community Developers</h3>
                  <p className={`text-[10px] ${currentTheme.textMuted}`}>Explore profiles and follow developers in the Zenix registry.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {MOCK_USERS.map((usr) => (
                    <div 
                      key={usr.id}
                      className={`p-3 rounded-xl border ${currentTheme.card} flex flex-col justify-between min-h-[120px]`}
                    >
                      <div className="w-full flex items-start gap-3 mb-2">
                        {/* Avatar */}
                        <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${usr.avatarColor} border border-zinc-800 flex items-center justify-center font-bold text-[10px] text-zinc-300 shrink-0`}>
                          {usr.name.slice(0, 2).toUpperCase()}
                        </div>
                        
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 justify-between">
                            <h4 className="text-[11.5px] font-bold truncate leading-none text-zinc-200">@{usr.name}</h4>
                            <span className="text-[7.5px] px-1 py-0.5 rounded-full bg-zinc-850 text-zinc-400 border border-zinc-800 shrink-0">{usr.badges[0]}</span>
                          </div>
                          <span className="text-[9px] text-zinc-500 mt-0.5 block">{usr.role}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-zinc-800/20 pt-2">
                        <div className="flex items-center gap-2 text-[9px] font-mono text-zinc-500">
                          <span>{usr.projects} projects</span>
                          <span>{usr.followers} followers</span>
                        </div>
                        <button 
                          onClick={handleActionRedirect}
                          className="bg-zinc-800 hover:bg-zinc-755 border border-zinc-700 text-zinc-300 text-[8.5px] font-bold px-2.5 py-1 rounded cursor-pointer"
                        >
                          Follow
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
