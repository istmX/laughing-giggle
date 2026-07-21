import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FILE_GROUPS, findProductFile, PRODUCT_FILES, PROJECT_ROOT_FILES } from './productContext';

gsap.registerPlugin(ScrollTrigger);

const initialLogs = [
  { text: '$ zenix start --workspace', type: 'command' },
  { text: '› Zenix Engine ready · live preview connected', type: 'info' },
  { text: '✓ Loaded Architecture Context · 10 documents', type: 'success' },
];

const KEYWORDS = new Set([
  'as', 'const', 'default', 'export', 'from', 'function', 'import', 'interface', 'return', 'type', 'typeof',
]);
const TYPES = new Set(['boolean', 'number', 'string', 'StyleSheet', 'Platform', 'Pressable', 'ScrollView']);

/* ── file-type icon SVGs ── */

function FileIcon({ language, isSelected, isContext }) {
  const color = isContext ? '#5cbf88' : isSelected ? '#c8b9ff' : '#71717a';
  if (language === 'typescript') {
    return (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0">
        <rect x="1" y="1" width="14" height="14" rx="2" fill="#3178c6" />
        <text x="8" y="12" textAnchor="middle" fill="#fff" fontSize="9" fontFamily="monospace" fontWeight="700">TS</text>
      </svg>
    );
  }
  if (language === 'css') {
    return (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0">
        <rect x="1" y="1" width="14" height="14" rx="2" fill="#1572b6" />
        <text x="8" y="11.5" textAnchor="middle" fill="#fff" fontSize="7.5" fontFamily="monospace" fontWeight="700">CSS</text>
      </svg>
    );
  }
  if (language === 'json') {
    return (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0">
        <rect x="1" y="1" width="14" height="14" rx="2" fill="#f6bd4d" />
        <text x="8" y="11.5" textAnchor="middle" fill="#1a1a1a" fontSize="6.5" fontFamily="monospace" fontWeight="700">{'{}'}</text>
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0">
      <path d="M4 1h6l4 4v10H4a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2z" stroke={color} strokeWidth="1.2" fill="none" />
      <path d="M10 1v4h4" stroke={color} strokeWidth="1.2" fill="none" />
    </svg>
  );
}

function FolderIcon({ isOpen, isContext }) {
  const color1 = isContext ? '#5cbf88' : '#f6bd4d';
  const color2 = isContext ? '#4db379' : '#e5a50a';
  if (isOpen) {
    return (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0">
        <path d="M1.5 3.5A1.5 1.5 0 0 1 3 2h3.17a1.5 1.5 0 0 1 1.24.66L8.5 4.5H13a1.5 1.5 0 0 1 1.5 1.5v1H3.5L1.5 13V3.5z" fill={color1} />
        <path d="M3.5 7h11L13 13H1.5L3.5 7z" fill={color2} />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0">
      <path d="M1.5 3.5A1.5 1.5 0 0 1 3 2h3.17a1.5 1.5 0 0 1 1.24.66L8.5 4.5H13a1.5 1.5 0 0 1 1.5 1.5v7a1.5 1.5 0 0 1-1.5 1.5H3A1.5 1.5 0 0 1 1.5 12V3.5z" fill={color1} />
    </svg>
  );
}

function ChevronIcon({ isOpen }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true" className={`shrink-0 transition-transform duration-150 ${isOpen ? 'rotate-90' : ''}`}>
      <path d="M3 1.5L7 5L3 8.5" stroke="#a1a1aa" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ── syntax highlighting ── */

function tokenClass(token) {
  if (token.startsWith('//') || token.startsWith('#')) return 'text-[#8F8F96]';
  if (/^['"`]w*/.test(token)) return 'text-[#56C271]';
  if (/^\d/.test(token)) return 'text-[#F6BD4D]';
  if (KEYWORDS.has(token)) return 'text-[#FF5F56]';
  if (TYPES.has(token)) return 'text-[#3E9FFF]';
  return 'text-[#D4D4D8]';
}

function highlightLine(line, lineIndex) {
  const pattern = /(\/\/.*|#[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b\d+(?:\.\d+)?\b|\b[A-Za-z_$][\w$]*\b)/g;
  const tokens = [];
  let cursor = 0;
  let match;
  while ((match = pattern.exec(line)) !== null) {
    if (match.index > cursor) tokens.push(<span key={`${lineIndex}-p-${cursor}`}>{line.slice(cursor, match.index)}</span>);
    tokens.push(<span key={`${lineIndex}-${match.index}`} className={tokenClass(match[0])}>{match[0]}</span>);
    cursor = match.index + match[0].length;
  }
  if (cursor < line.length) tokens.push(<span key={`${lineIndex}-t`}>{line.slice(cursor)}</span>);
  return tokens.length ? tokens : '\u00a0';
}

/* ── preview model (reads editable index.tsx) ── */

function cleanText(value) {
  return value.replace(/\{[^}]*\}/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

function getPreviewModel(source) {
  const title = source.match(/<ThemedText[^>]*type="title"[^>]*>([\s\S]*?)<\/ThemedText>/)?.[1];
  const hintCopy = {
    'Try editing': 'src/app/index.tsx',
    'Dev tools': 'use browser devtools',
    'Fresh start': 'npm run reset-project',
  };
  const hints = [...source.matchAll(/<HintRow\s+title="([^"]+)"/g)].map((m) => ({
    label: m[1],
    hint: hintCopy[m[1]] || 'Open source file',
  }));
  return {
    title: cleanText(title || 'Welcome to Expo'),
    hints: hints.length ? hints : Object.entries(hintCopy).map(([label, hint]) => ({ label, hint })),
  };
}

function getDisplayPath(path) {
  return path.startsWith('src/') ? path.slice(4) : path;
}

/* ── Explorer sub-components ── */

function FileButton({ file, selectedPath, onSelect, isContext }) {
  const isSelected = selectedPath === file.path;
  const fileName = file.path.split('/').pop();
  
  let selectedBg = 'bg-white/[0.08]';
  let hoverText = 'hover:text-zinc-200';
  let baseText = isContext ? 'text-[#5cbf88]' : 'text-zinc-500';
  
  if (isContext && isSelected) {
    selectedBg = 'bg-white/[0.08] text-white';
  } else if (isSelected) {
    baseText = 'text-white';
  } else if (isContext) {
    hoverText = 'hover:text-[#5cbf88]/80';
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(file.path)}
      title={file.path}
      className={`flex min-h-8 w-full items-center gap-2.5 rounded-[6px] px-2.5 text-left font-mono text-[12px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF]/80 ${
        isSelected ? selectedBg : `${baseText} hover:bg-white/[0.06] ${hoverText}`
      }`}
    >
      <FileIcon language={file.language} isSelected={isSelected} isContext={isContext} />
      <span className="truncate">{fileName}</span>
    </button>
  );
}

function ExplorerGroup({ label, files, selectedPath, onSelect, isOpen, onToggle }) {
  if (!files.length) return null;
  const isContext = label === 'context';
  
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className={`flex min-h-8 w-full items-center gap-1.5 font-mono text-[12px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF]/80 ${
          isContext ? 'text-[#5cbf88] hover:text-[#5cbf88]/80' : 'text-zinc-400 hover:text-zinc-200'
        }`}
      >
        <ChevronIcon isOpen={isOpen} />
        <FolderIcon isOpen={isOpen} isContext={isContext} />
        <span>{label}</span>
        <span className={`ml-auto ${isContext ? 'text-[#5cbf88]/60' : 'text-zinc-700'}`}>{files.length}</span>
      </button>
      {isOpen && (
        <div className="space-y-0.5 pl-5 border-l border-white/[0.04] ml-[5px] mt-1 mb-2">
          {[...files].sort((a, b) => a.path.localeCompare(b.path)).map((file) => (
            <FileButton key={file.path} file={file} selectedPath={selectedPath} onSelect={onSelect} isContext={isContext} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── AGENTS.md pinned entry ── */

function AgentsFileButton({ file, selectedPath, onSelect }) {
  const isSelected = selectedPath === file.path;
  return (
    <button
      type="button"
      onClick={() => onSelect(file.path)}
      title={file.path}
      className={`flex min-h-8 w-full items-center gap-2.5 rounded-[6px] px-2.5 text-left font-mono text-[12px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF]/80 ${
        isSelected ? 'bg-white/[0.08] text-white' : 'text-[#c8b9ff]/90 hover:bg-white/[0.06] hover:text-[#c8b9ff]'
      }`}
    >
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0">
        <rect x="1" y="1" width="14" height="14" rx="2" fill="#6E56CF" />
        <text x="8" y="11.5" textAnchor="middle" fill="#fff" fontSize="6" fontFamily="monospace" fontWeight="700">AGT</text>
      </svg>
      <span className="truncate">AGENTS.md</span>
      <span className="ml-auto shrink-0 rounded px-1 py-0.5 font-mono text-[9px] text-[#6E56CF] ring-1 ring-[#6E56CF]/40">pinned</span>
    </button>
  );
}

/* ── main component ── */

export default function ProductPreview() {
  const [selectedPath, setSelectedPath] = useState('src/app/index.tsx');
  // Mutable contents so edits reflect in preview
  const [contents, setContents] = useState(() =>
    Object.fromEntries(PRODUCT_FILES.map((f) => [f.path, f.content]))
  );
  const [terminalLogs, setTerminalLogs] = useState(initialLogs);
  const [isCompiling, setIsCompiling] = useState(false);
  const [openGroup, setOpenGroup] = useState('app');
  const [activeMobileTab, setActiveMobileTab] = useState('editor'); // 'explorer' | 'editor' | 'terminal' | 'preview'
  const codeScrollRef = useRef(null);
  
  const sectionRef = useRef(null);
  const ideRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(ideRef.current, {
        y: 80,
        opacity: 0,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
        }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const selectedFile = findProductFile(selectedPath);
  const source = contents[selectedPath] ?? selectedFile.content;
  const lines = source.split('\n');
  // Preview for Expo app reads from index.tsx
  const preview = useMemo(() => getPreviewModel(contents['src/app/index.tsx'] || ''), [contents]);

  const selectFile = useCallback((path) => {
    setSelectedPath(path);
    if (codeScrollRef.current) {
      codeScrollRef.current.scrollTop = 0;
      codeScrollRef.current.scrollLeft = 0;
    }
    setTerminalLogs((logs) => [...logs.slice(-3), { text: `Opened ${getDisplayPath(path)}`, type: 'info' }]);
  }, []);

  const updateSource = useCallback((event) => {
    const next = event.target.value;
    setContents((cur) => ({ ...cur, [selectedPath]: next }));
  }, [selectedPath]);

  const runCompiler = () => {
    if (isCompiling) return;
    setIsCompiling(true);
    setTerminalLogs((logs) => [...logs, { text: '$ zenix build --preview', type: 'command' }]);
    window.setTimeout(() => setTerminalLogs((logs) => [...logs, { text: '✓ TypeScript check passed', type: 'success' }]), 450);
    window.setTimeout(() => {
      setTerminalLogs((logs) => [...logs, { text: `✓ Preview refreshed for ${getDisplayPath(selectedPath)}`, type: 'success' }]);
      setIsCompiling(false);
    }, 900);
  };

  // Explorer groups in priority order: app → components → context
  const priorityGroups = FILE_GROUPS.filter((g) => ['app', 'components', 'context'].includes(g.label));
  const otherGroups = FILE_GROUPS.filter((g) => !['app', 'components', 'context'].includes(g.label));

  // AGENTS.md: the pinned file from PROJECT_ROOT_FILES
  const agentsFile = PROJECT_ROOT_FILES.find((f) => f.path === 'AGENTS.md');
  const rootFiles = PROJECT_ROOT_FILES.filter((f) => f.path !== 'AGENTS.md');

  const renderDynamicPreview = () => {
    if (selectedFile.language === 'markdown') {
      return (
        <div className="font-sans text-[#1A1A1A] min-h-full">
          <div className="mb-8 flex items-center justify-between font-mono text-[10px] text-zinc-400 border-b border-zinc-200/60 pb-3">
            <span className="uppercase tracking-[0.2em] font-medium">Context Sync</span>
            <span className="rounded-full border border-zinc-200 px-2.5 py-1 bg-zinc-50 text-zinc-500">{getDisplayPath(selectedPath)}</span>
          </div>
          <div className="prose prose-sm max-w-none text-[15px] leading-[1.8] text-zinc-600">
            {source.split('\n\n').map((para, i) => {
              if (para.startsWith('# ')) return <h1 key={i} className="text-[32px] font-semibold tracking-[-0.03em] text-zinc-900 mt-10 mb-6">{para.replace('# ', '')}</h1>;
              if (para.startsWith('## ')) return <h2 key={i} className="text-[22px] font-medium tracking-tight text-zinc-800 mt-8 mb-5 flex items-center gap-4"><span className="h-px flex-1 bg-zinc-200/60"></span><span>{para.replace('## ', '')}</span><span className="h-px flex-1 bg-zinc-200/60"></span></h2>;
              if (para.startsWith('### ')) return <h3 key={i} className="text-[17px] font-medium text-zinc-800 mt-6 mb-3">{para.replace('### ', '')}</h3>;
              if (para.startsWith('- ')) {
                return (
                  <ul key={i} className="pl-0 my-5 space-y-2.5 text-zinc-600">
                    {para.split('\n').filter(Boolean).map((li, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <span className="text-zinc-300 text-[12px] mt-[6px]">◆</span>
                        <span className="leading-relaxed">{li.replace('- ', '')}</span>
                      </li>
                    ))}
                  </ul>
                );
              }
              if (para.startsWith('> ')) return <blockquote key={i} className="border-l-2 border-zinc-300 pl-5 italic text-zinc-500 my-6">{para.replace(/> /g, '')}</blockquote>;
              if (para.startsWith('---')) return <hr key={i} className="border-t border-zinc-200/60 my-10" />;
              return <p key={i} className="my-5">{para}</p>;
            })}
          </div>
        </div>
      );
    }
    
    if (selectedFile.language === 'json') {
      return (
        <div className="font-sans text-[#1A1A1A] h-full flex flex-col">
          <div className="mb-6 flex items-center justify-between font-mono text-[10px] text-zinc-400 border-b border-zinc-200/60 pb-3 shrink-0">
            <span className="uppercase tracking-[0.2em] font-medium">Config Viewer</span>
            <span className="rounded-full border border-zinc-200 px-2.5 py-1 bg-zinc-50 text-zinc-500">{getDisplayPath(selectedPath)}</span>
          </div>
          <div className="flex-1 rounded-[14px] border border-zinc-200/60 bg-[#FAFAFA] p-6 overflow-hidden shadow-sm">
            <pre className="font-mono text-[13px] leading-[1.8] text-zinc-600 overflow-auto h-full [scrollbar-width:none]">
              {source}
            </pre>
          </div>
        </div>
      );
    }
    
    // Default Zenix App Preview
    return (
      <div className="flex flex-col h-full font-sans text-zinc-900">
        <div className="mb-8 flex items-center justify-between font-mono text-[10px] text-zinc-400">
          <span className="uppercase tracking-[0.2em] font-medium">Zenix Engine</span>
          <span className="rounded-full border border-zinc-200 px-2.5 py-1 text-zinc-500 shadow-sm bg-white">Localhost:3000</span>
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-zinc-800 to-zinc-950 rounded-2xl shadow-[0_8px_32px_-8px_rgba(0,0,0,0.3)] mb-8 flex items-center justify-center transform transition-transform hover:scale-105 duration-300">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100/80 border border-zinc-200 text-[11px] font-medium text-zinc-600 mb-6 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Syncing Context
          </div>
          
          <h3 className="max-w-[300px] text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] mb-4 text-zinc-900">
            {preview.title}
          </h3>
          <p className="text-zinc-500 text-[15px] mb-10 max-w-[280px] leading-relaxed">
            Your workspace is active. Edit files to see live updates.
          </p>
          
          <div className="w-full max-w-[320px] space-y-3">
            {preview.hints.slice(0, 3).map((hint, i) => (
              <div key={`${hint.label}-${i}`} className="group flex items-center justify-between gap-4 rounded-xl border border-zinc-200/80 bg-white px-4 py-3.5 shadow-sm transition-all hover:shadow-md hover:border-zinc-300 cursor-pointer">
                <span className="text-[14px] font-medium text-zinc-800">{hint.label}</span>
                <span className="ml-auto truncate text-right font-mono text-[11px] text-zinc-400 group-hover:text-zinc-600 transition-colors">{hint.hint}</span>
                <span className="text-zinc-300 group-hover:text-zinc-800 transition-colors transform group-hover:translate-x-0.5 duration-200">→</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section ref={sectionRef} className="landing-section relative z-30 border-t border-zinc-200/70 bg-white text-zinc-950 py-16 md:py-24">
      <div className="w-full max-w-[1920px] mx-auto px-4 md:px-8">
        <header className="landing-section-header text-left max-w-3xl mb-8">
          <span className="font-mono text-[14px] font-medium uppercase tracking-[0.16em] text-emerald-600">Interactive Workspace</span>
          <h2>Build the app from its context</h2>
          <p>Open the real ScribbleBox project, read every instruction, and see the mobile screen update from the code you edit.</p>
        </header>

        {/* IDE shell - full width and height */}
        <div
          ref={ideRef}
          data-lenis-prevent="true"
          className="overflow-hidden rounded-[20px] border border-white/[0.1] bg-[#0E0E11] text-zinc-300 shadow-[0_32px_80px_-16px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.05)_inset,0_4px_16px_rgba(0,0,0,0.2)] flex flex-col max-w-[1440px] mx-auto mt-6"
          style={{ height: 'calc(100vh - 160px)', minHeight: '640px' }}
        >
          {/* Title bar */}
          <div className="flex h-[52px] shrink-0 items-center justify-between border-b border-white/[0.06] bg-[#161618] px-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex items-center gap-1.5" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff665e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#f6bd4d]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#56c271]" />
              </div>
              <span className="truncate font-mono text-[13px] font-medium tracking-wide text-zinc-500">zenix <span className="mx-2 text-zinc-700">/</span> <span className="text-zinc-300">{getDisplayPath(selectedPath)}</span></span>
            </div>
            <button
              type="button"
              onClick={runCompiler}
              disabled={isCompiling}
              className="flex items-center gap-2 rounded-[8px] bg-white/[0.04] px-3.5 py-[6px] font-mono text-[12px] font-medium text-zinc-300 transition-all hover:bg-white/[0.08] hover:text-white disabled:cursor-wait disabled:opacity-70 ring-1 ring-inset ring-white/[0.08]"
            >
              <span className={`h-1.5 w-1.5 rounded-full ${isCompiling ? 'animate-pulse bg-[#f6bd4d]' : 'bg-emerald-400'}`} />
              {isCompiling ? 'Syncing...' : 'Sync Context'}
            </button>
          </div>

          {/* Mobile IDE Tabs Selector */}
          <div className="flex lg:hidden bg-[#131314] border-b border-white/[0.06] h-10 items-center justify-around px-2 shrink-0 z-20">
            <button 
              type="button" 
              onClick={() => setActiveMobileTab('explorer')} 
              className={`text-[11px] font-mono px-3 py-1 rounded-md transition-colors ${activeMobileTab === 'explorer' ? 'bg-[#2A2A2E] text-zinc-100 font-semibold' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Explorer
            </button>
            <button 
              type="button" 
              onClick={() => setActiveMobileTab('editor')} 
              className={`text-[11px] font-mono px-3 py-1 rounded-md transition-colors ${activeMobileTab === 'editor' ? 'bg-[#2A2A2E] text-zinc-100 font-semibold' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Code
            </button>
            <button 
              type="button" 
              onClick={() => setActiveMobileTab('terminal')} 
              className={`text-[11px] font-mono px-3 py-1 rounded-md transition-colors ${activeMobileTab === 'terminal' ? 'bg-[#2A2A2E] text-zinc-100 font-semibold' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Terminal
            </button>
            <button 
              type="button" 
              onClick={() => setActiveMobileTab('preview')} 
              className={`text-[11px] font-mono px-3 py-1 rounded-md transition-colors ${activeMobileTab === 'preview' ? 'bg-[#2A2A2E] text-zinc-100 font-semibold' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Preview
            </button>
          </div>

          {/* Body — fills remaining IDE height */}
          <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1.1fr)_minmax(360px,0.9fr)]">
            {/* ── Explorer sidebar ── */}
            <aside className={`flex-col overflow-hidden border-b border-white/[0.06] bg-[#131314] lg:border-b-0 lg:border-r ${activeMobileTab === 'explorer' ? 'flex' : 'hidden lg:flex'}`}>
              <div className="flex shrink-0 items-center justify-between px-5 pb-3 pt-5 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-500">
                <span>Explorer</span>
                <span>⌘P</span>
              </div>
              {/* Root: scribblebox */}
              <div className="flex shrink-0 items-center gap-2 px-5 pb-3 font-mono text-[13px] font-medium text-zinc-300">
                <ChevronIcon isOpen />
                <FolderIcon isOpen />
                <span>workspace</span>
              </div>
              {/* Scrollable file tree */}
              <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="space-y-1 px-2 pb-4 pl-6">
                  {/* AGENTS.md — always pinned at top, highlighted */}
                  {agentsFile && (
                    <div className="mb-3">
                      <AgentsFileButton
                        file={agentsFile}
                        selectedPath={selectedPath}
                        onSelect={selectFile}
                      />
                    </div>
                  )}

                  {/* Priority groups: app → components → context */}
                  {priorityGroups.map((group) => (
                    <ExplorerGroup
                      key={group.label}
                      {...group}
                      selectedPath={selectedPath}
                      onSelect={selectFile}
                      isOpen={openGroup === group.label || (group.label === 'context' && selectedFile.language === 'markdown')}
                      onToggle={() => setOpenGroup((cur) => cur === group.label ? null : group.label)}
                    />
                  ))}

                  {/* Other groups (hooks, constants, etc.) */}
                  {otherGroups.map((group) => (
                    <ExplorerGroup
                      key={group.label}
                      {...group}
                      selectedPath={selectedPath}
                      onSelect={selectFile}
                      isOpen={openGroup === group.label}
                      onToggle={() => setOpenGroup((cur) => cur === group.label ? null : group.label)}
                    />
                  ))}

                  {/* Root files: json, readme, etc. at the bottom */}
                  {rootFiles.length > 0 && (
                    <>
                      <div className="my-2 border-t border-white/[0.07]" />
                      {[...rootFiles].sort((a, b) => a.path.localeCompare(b.path)).map((file) => (
                        <FileButton key={file.path} file={file} selectedPath={selectedPath} onSelect={selectFile} />
                      ))}
                    </>
                  )}
                </div>
              </div>
            </aside>

            {/* ── Editor pane ── */}
            <div className={`min-w-0 flex-col overflow-hidden bg-[#0C0C0D] ${activeMobileTab === 'editor' || activeMobileTab === 'terminal' ? 'flex' : 'hidden lg:flex'}`}>
              {/* Tab bar */}
              <div className="flex shrink-0 items-center justify-between border-b border-white/[0.06] bg-[#131314] px-4 h-[46px]">
                <div className="flex min-w-0 items-center gap-2 border-t-2 border-zinc-300 px-3 py-[11px] font-mono text-[13px] text-zinc-100">
                  <FileIcon language={selectedFile.language} isSelected isContext={selectedFile.path.startsWith('context/')} />
                  <span className="truncate">{getDisplayPath(selectedFile.path)}</span>
                </div>
                <span className="hidden truncate pl-4 font-mono text-[11px] text-zinc-600 sm:block">{selectedFile.source}</span>
              </div>

              {/* Code editor — editable textarea layered under syntax-highlight pre, no scrollbars */}
              <div
                ref={codeScrollRef}
                data-lenis-prevent="true"
                className={`relative min-h-0 flex-1 overflow-hidden ${activeMobileTab === 'editor' ? 'block' : 'hidden lg:block'}`}
              >
                {/* Syntax-highlighted display layer */}
                <div
                  className="pointer-events-none absolute inset-0 grid w-max min-w-full grid-cols-[48px_1fr] px-4 py-6 font-mono text-[14.5px] leading-[1.8] sm:px-6"
                  aria-hidden="true"
                >
                  <div className="select-none pr-5 text-right text-zinc-600/60">
                    {lines.map((_, i) => <div key={i}>{i + 1}</div>)}
                  </div>
                  <pre className="m-0 whitespace-pre text-zinc-300">
                    {lines.map((line, i) => <div key={i}>{highlightLine(line, i)}</div>)}
                  </pre>
                </div>

                {/* Editable textarea — transparent text so syntax layer shows through */}
                <textarea
                  aria-label={`Edit ${selectedFile.path}`}
                  value={source}
                  onChange={updateSource}
                  spellCheck="false"
                  className="absolute inset-0 min-h-full w-full resize-none border-none whitespace-pre overflow-hidden bg-transparent pl-[64px] pr-4 py-6 font-mono text-[14.5px] leading-[1.8] caret-white outline-none selection:bg-emerald-500/30 sm:pl-[72px]"
                  style={{
                    color: 'transparent',
                    WebkitTextFillColor: 'transparent',
                    height: `${Math.max(100, lines.length * 26.1 + 48)}px`,
                    minHeight: '100%',
                  }}
                />
              </div>

              {/* Terminal */}
              <div className={`h-[180px] shrink-0 border-t border-white/[0.06] bg-[#131314] flex flex-col ${activeMobileTab === 'terminal' ? 'flex' : 'hidden lg:flex'}`}>
                <div className="border-b border-white/[0.04] px-5 py-2.5 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-500 shrink-0 flex items-center justify-between"><span>Terminal Output</span><span className="text-zinc-700 normal-case tracking-normal">zenix-cli</span></div>
                <div className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-5 py-4 font-mono text-[12.5px] space-y-2">
                  {terminalLogs.map((log, i) => (
                    <div
                      key={`${log.text}-${i}`}
                      className={log.type === 'command' ? 'text-zinc-500' : log.type === 'success' ? 'text-emerald-400' : 'text-zinc-300'}
                    >
                      {log.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Preview pane — reflects live edits & context ── */}
            <div className={`overflow-hidden border-l border-white/[0.06] bg-[#0E0E11] p-5 text-zinc-900 ${activeMobileTab === 'preview' ? 'flex flex-col flex-1' : 'hidden xl:flex xl:flex-col'}`}>
              <div className="flex h-full flex-col overflow-hidden rounded-[16px] border border-zinc-200/80 bg-[#FAFAFA] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)]">
                {/* Browser chrome */}
                <div className="flex shrink-0 items-center gap-2 border-b border-zinc-200/80 bg-white px-5 py-3.5 relative">
                  <div className="flex items-center gap-2 absolute left-5">
                    <span className="h-3 w-3 rounded-full bg-[#ff5f56] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)]" />
                    <span className="h-3 w-3 rounded-full bg-[#ffbd2e] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)]" />
                    <span className="h-3 w-3 rounded-full bg-[#27c93f] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)]" />
                  </div>
                  <div className="mx-auto flex items-center justify-center w-64 rounded-md bg-zinc-100/80 border border-zinc-200/50 px-3 py-1 font-mono text-[11px] text-zinc-500 shadow-sm">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2 opacity-50"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/></svg>
                    localhost:3000
                  </div>
                </div>
                {/* Dynamic Preview Container */}
                <div className="flex min-h-0 flex-1 flex-col justify-between overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden p-6 sm:p-10 bg-[#FAFAFA]">
                  {renderDynamicPreview()}
                  <div className="border-t border-zinc-200/80 pt-5 font-mono text-[10px] text-zinc-400 mt-10 shrink-0 flex items-center justify-center uppercase tracking-widest font-medium">
                    <span className="mr-2 text-emerald-500 animate-pulse">●</span>
                    Live Preview Synced
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status bar */}
          <div className="flex h-10 shrink-0 items-center justify-between border-t border-white/[0.06] bg-[#161618] px-5 font-mono text-[11px] text-zinc-500">
            <span className="flex items-center"><span className="mr-2 text-emerald-500 w-2 h-2 rounded-full"></span>Workspace Active</span>
            <span className="hidden sm:block">UTF-8 <span className="mx-2 opacity-30">|</span> TypeScript/Markdown <span className="mx-2 opacity-30">|</span> main</span>
          </div>
        </div>
      </div>
    </section>
  );
}
