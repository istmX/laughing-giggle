import { GlowingEffect } from '@/components/ui/glowing-effect'

export function GlowingCard({ className = '', children }) {
  return (
    <div className={`relative min-h-[12rem] h-auto rounded-2xl border border-zinc-100 dark:border-zinc-800/80 p-1 md:p-1.5 bg-zinc-50/50 dark:bg-zinc-900/50 flex flex-col ${className}`}>
      <GlowingEffect
        spread={40}
        glow={true}
        disabled={false}
        proximity={64}
        inactiveZone={0.01}
      />
      {children}
    </div>
  )
}
