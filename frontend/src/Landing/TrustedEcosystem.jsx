const ECOSYSTEM_ITEMS = [
  { name: "GitHub", src: "/github.png" },
  { name: "Cursor", src: "/cursor.png" },
  { name: "Claude Code", src: "/claude.png" },
  { name: "Gemini", src: "/gemini.png" },
  { name: "VS Code", src: "/vscode.png" },
  { name: "Windsurf", src: "/windsurf.svg" },
  { name: "Codex", src: "/codex.png" },
];

export default function TrustedEcosystem() {
  return (
    <section className="w-full bg-white dark:bg-zinc-950 py-24 overflow-hidden border-b border-zinc-100 dark:border-zinc-900 flex flex-col items-center transition-colors duration-300">
      
      {/* Section Heading */}
      <div className="text-center mb-12 px-6">
        <h2 className="text-sm font-medium tracking-wide text-zinc-400 dark:text-zinc-500 uppercase">
          Use and integrate with your fav agents and editors
        </h2>
      </div>

      {/* Marquee Container */}
      <div className="relative w-full max-w-7xl mx-auto flex overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
        
        {/* Scrolling Track */}
        <div className="flex w-max min-w-full animate-marquee hover:[animation-play-state:paused] flex-nowrap">
          
          {/* Double the array for seamless looping */}
          {[...ECOSYSTEM_ITEMS, ...ECOSYSTEM_ITEMS].map((item, idx) => (
            <div 
              key={`${item.name}-${idx}`} 
              className="flex shrink-0 items-center justify-center h-16 px-8 mx-4 rounded-xl border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(0,0,0,0.1)] dark:hover:shadow-none group cursor-pointer bg-white dark:bg-zinc-900"
            >
              {/* Logo */}
              <div className="w-8 h-8 mr-3 flex shrink-0 items-center justify-center">
                <img 
                  src={item.src} 
                  alt={`${item.name} logo`} 
                  className={`w-full h-full object-contain drop-shadow-sm group-hover:scale-125 group-hover:-translate-y-1 transition-all duration-300 ease-out ${item.name === 'GitHub' ? 'dark:brightness-0 dark:invert' : ''}`} 
                />
              </div>
              <span className="text-lg font-medium whitespace-nowrap text-zinc-400 dark:text-zinc-500 transition-colors duration-300 group-hover:text-zinc-950 dark:group-hover:text-white">
                {item.name}
              </span>
            </div>
          ))}

        </div>
      </div>
      
    </section>
  );
}
