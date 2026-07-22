import { TextHoverEffect } from '@/components/ui/text-hover-effect';

const LINKS = {
  product: [
    { label: 'Overview', href: '/' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Playground', href: '/playground' },
    { label: 'Docs', href: '/docs' }
  ],
  resources: [
    { label: 'GitHub', href: '/github' },
    { label: 'Templates', href: '/dashboard/community' },
    { label: 'Guides', href: '/docs' },
    { label: 'Status', href: '/status' }
  ],
  company: [
    { label: 'About', href: '/about' },
    { label: 'Sponsor', href: '/sponsor' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' }
  ],
  legal: [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
    { label: 'Security', href: '/security' }
  ]
};

export default function Footer() {
  return (
    <footer className="landing-section relative z-10 bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 border-t border-zinc-200 dark:border-zinc-900/50 py-16 transition-colors duration-300">
      <div className="landing-container">
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          
          <div className="col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="font-semibold tracking-tight text-zinc-900 dark:text-white">Zenix</span>
            </div>
            <p className="text-zinc-500 dark:text-zinc-400 text-xs max-w-xs leading-relaxed font-light">
              Structured architecture and development context blueprints for modern software engineering workflows.
            </p>
          </div>

          {Object.entries(LINKS).map(([title, list]) => (
            <div key={title} className="flex flex-col gap-3">
              <h5 className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 dark:text-zinc-400 font-700">
                {title}
              </h5>
              <ul className="flex flex-col gap-2">
                {list.map((link) => (
                  <li key={link.label}>
                    <a 
                      href={link.href}
                      className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors duration-150 font-light"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        <div className="w-full h-[8rem] sm:h-[12rem] md:h-[16rem] flex items-center justify-center my-6 overflow-hidden select-none">
          <TextHoverEffect text="ZENIX" />
        </div>

        <div className="border-t border-zinc-200 dark:border-zinc-900 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] font-mono text-zinc-500">
          <div>
            &copy; 2026 Zenix. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="/github" className="hover:text-zinc-900 dark:hover:text-white transition-colors duration-150">GitHub</a>
            <a href="/x" className="hover:text-zinc-900 dark:hover:text-white transition-colors duration-150">Twitter</a>
            <a href="/discord" className="hover:text-zinc-900 dark:hover:text-white transition-colors duration-150">Discord</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
