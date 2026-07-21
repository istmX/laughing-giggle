import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Coffee, Star, Shield, ArrowRight, Check, User } from 'lucide-react';

const TIERS = [
  {
    name: 'Coffee Backer',
    price: '$5',
    period: 'month',
    description: 'Keep the compiler warm. Support server maintenance and API costs.',
    icon: Coffee,
    accent: 'bg-[#f4ecd6] text-amber-800 border-amber-250',
    features: [
      'Early access to beta builds',
      'Exclusive discord backer role',
      'A warm feeling of supporting open-source tools',
    ],
  },
  {
    name: 'Pro Supporter',
    price: '$19',
    period: 'month',
    description: 'Gain premium tools while empowering solo development efforts.',
    icon: Star,
    accent: 'bg-[#c5b0f4] text-purple-800 border-purple-250',
    popular: true,
    features: [
      'Everything in Coffee Backer',
      'Access to premium design templates',
      'Custom Context Engine export configurations',
      'Priority support for bugs and feature requests',
    ],
  },
  {
    name: 'Flagship Sponsor',
    price: '$99',
    period: 'month',
    description: 'Directly influence the roadmap and display your developer identity.',
    icon: Shield,
    accent: 'bg-[#e2f4d6] text-emerald-800 border-emerald-250',
    features: [
      'Everything in Pro Supporter',
      'Your name/logo featured on the Zenix homepage',
      'Monthly 1-on-1 feedback session with Aryan',
      'Premium custom styling integration support',
    ],
  },
];

const Sponsor = () => {
  const [selectedTier, setSelectedTier] = useState(null);

  return (
    <div className="min-h-dvh bg-[#fafafa] text-zinc-950 font-sans pb-32">
      {/* Decorative Header Canvas Grid */}
      <div className="absolute top-0 left-0 right-0 h-[480px] opacity-[0.25] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.06) 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />

      {/* Main Nav Bar Header */}
      <header className="relative z-10 mx-auto max-w-7xl px-6 py-8 flex items-center justify-between border-b border-zinc-200">
        <a href="/" className="inline-flex items-start gap-0.5 text-[20px] font-bold tracking-tight text-zinc-950">
          <span>zenix</span><span className="-translate-y-1 text-xs leading-none">*</span>
        </a>
        <a href="/login" className="text-[14px] font-medium text-zinc-650 hover:text-zinc-950 transition-colors">
          Sign In
        </a>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-6 mt-20">
        {/* Intro Hero Section */}
        <section className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 border border-purple-200 px-3 py-1 text-[12px] font-mono uppercase tracking-[0.05em] text-purple-700">
              <Heart className="h-3 w-3 fill-purple-700" /> Support Solo Creator
            </span>
            
            <h1 className="mt-6 text-[56px] lg:text-[72px] font-bold leading-[1.05] tracking-tight text-zinc-950">
              Built by one developer. Sponsored by you.
            </h1>
            
            <p className="mt-6 text-[20px] font-light leading-relaxed text-zinc-650">
              Hi, I’m Aryan. I built Zenix to eliminate the messy, chaotic output of standard prompt engineering. 
              By sponsoring, you directly fund the servers, development tools, and hours spent crafting a premium tool.
            </p>
          </motion.div>
        </section>

        {/* Aryan / Zenix Manifesto Section */}
        <section className="mt-20 grid gap-12 border-t border-zinc-200 pt-16 lg:grid-cols-2">
          <div>
            <h2 className="text-[28px] font-bold tracking-tight text-zinc-950">
              The Mission behind Zenix
            </h2>
            <p className="mt-4 text-[16px] font-light leading-relaxed text-zinc-650">
              In a world crowded with quick-fix AI wraps, Zenix is committed to building a production-grade 
              platform that empowers developers with real structure, layout constraints, design tokens, and clean codebases. 
              No placeholders, no code compromises.
            </p>
          </div>
          <div>
            <h2 className="text-[28px] font-bold tracking-tight text-zinc-950">
              Where your support goes
            </h2>
            <p className="mt-4 text-[16px] font-light leading-relaxed text-zinc-650">
              Every donation helps offset the heavy computational costs of running large language models and hosting 
              compilation engines on cloud services. It gives me the freedom to stay independent, avoiding corporate 
              influence or ad-tech monetization.
            </p>
          </div>
        </section>

        {/* Sponsorship Tiers Grid */}
        <section className="mt-24">
          <div className="text-center mb-16">
            <h2 className="text-[36px] font-bold tracking-tight text-zinc-950">
              Choose your sponsorship tier
            </h2>
            <p className="mt-2 text-[18px] font-light text-zinc-550">
              Support development monthly or check out alternative options below.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {TIERS.map((tier, idx) => {
              const Icon = tier.icon;
              return (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className={`relative flex flex-col rounded-[24px] border bg-white p-8 transition-shadow hover:shadow-lg ${
                    tier.popular ? 'border-purple-300 ring-2 ring-purple-100' : 'border-zinc-200'
                  }`}
                >
                  {tier.popular && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-purple-650 px-3.5 py-1 text-[11px] font-mono uppercase tracking-[0.06em] text-white">
                      Popular Tier
                    </span>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-[18px] font-bold tracking-tight text-zinc-950">{tier.name}</span>
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${tier.accent}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="mt-6 flex items-baseline">
                    <span className="text-[44px] font-bold tracking-tight text-zinc-950">{tier.price}</span>
                    <span className="ml-1.5 text-[15px] font-light text-zinc-500">/ {tier.period}</span>
                  </div>

                  <p className="mt-4 text-[14px] font-light leading-relaxed text-zinc-550 min-h-[48px]">
                    {tier.description}
                  </p>

                  <ul className="mt-8 space-y-4 flex-1">
                    {tier.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5 text-[14px] font-light text-zinc-650">
                        <Check className="h-4 w-4 mt-0.5 text-emerald-500 flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => setSelectedTier(tier.name)}
                    className={`mt-8 w-full rounded-full py-3.5 text-[14px] font-medium transition-all active:scale-[0.98] ${
                      tier.popular
                        ? 'bg-purple-650 text-white hover:bg-purple-750'
                        : 'bg-zinc-950 text-white hover:bg-zinc-850'
                    }`}
                  >
                    Select {tier.name}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Aryan Direct Bio */}
        <section className="mt-28 rounded-[32px] bg-[#f4ecd6] border border-zinc-200 p-8 lg:p-12">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-white border border-zinc-300">
              <User className="h-10 w-10 text-zinc-600" />
            </div>
            <div className="flex-1 text-center lg:text-left">
              <h3 className="text-[24px] font-bold tracking-tight text-zinc-950">
                Message from Aryan
              </h3>
              <p className="mt-3 text-[16px] font-light leading-relaxed text-zinc-700">
                "Zenix started as a local script to clean up my own code generations. Seeing developers around the 
                world adopt it has been incredibly rewarding. Your sponsorship keeps Zenix independent, free from 
                corporate telemetry, and focused 100% on the developer experience. Thank you for supporting solo open source development."
              </p>
              <div className="mt-6 flex flex-wrap justify-center lg:justify-start gap-6">
                <a href="https://github.com/sponsors" className="inline-flex items-center gap-1.5 text-[14px] font-medium text-zinc-950 hover:underline">
                  GitHub Sponsors <ArrowRight className="h-4 w-4" />
                </a>
                <a href="https://ko-fi.com" className="inline-flex items-center gap-1.5 text-[14px] font-medium text-zinc-950 hover:underline">
                  Ko-fi Support <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Acknowledgment Overlay */}
      {selectedTier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[3px] p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-[24px] border border-zinc-200 bg-white p-6 shadow-xl text-center"
          >
            <Heart className="mx-auto h-12 w-12 text-red-500 fill-red-500" />
            <h4 className="mt-4 text-[20px] font-bold text-zinc-950">Thank you for sponsoring Zenix!</h4>
            <p className="mt-2 text-[15px] font-light text-zinc-550">
              Your support for the <strong>{selectedTier}</strong> tier makes a massive difference in keeping this tool active.
            </p>
            <button
              onClick={() => setSelectedTier(null)}
              className="mt-6 w-full rounded-full bg-zinc-950 py-3 text-[14px] font-medium text-white transition-colors hover:bg-zinc-850"
            >
              Continue
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Sponsor;
