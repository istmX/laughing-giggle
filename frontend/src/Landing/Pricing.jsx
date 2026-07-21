import React from 'react';

const PLANS = [
  {
    name: "Developer Free",
    price: "0",
    desc: "Perfect for testing Zenix and mapping personal projects.",
    features: [
      "Up to 2 active projects",
      "Core spec files compilation",
      "Standard markdown output",
      "Community templates access"
    ],
    buttonText: "Start Building",
    href: "/signup",
    highlighted: false
  },
  {
    name: "Architect Pro",
    price: "19",
    desc: "For active builders requiring deep agent context alignment.",
    features: [
      "Unlimited active projects",
      "Full multi file sequential streaming",
      "Standard plus custom token schemes",
      "GitHub repository import scan",
      "Draggable context explorer panel",
      "Priority API queue limits"
    ],
    buttonText: "Upgrade to Pro",
    href: "/signup",
    highlighted: true
  },
  {
    name: "Engineering Team",
    price: "49",
    desc: "For teams and agencies managing multiple codebases.",
    features: [
      "Everything in Architect Pro",
      "Shared organizational workspaces",
      "Centralized context sync middleware",
      "Custom system agent instructions",
      "Basic auth admin protection",
      "Dedicated integration support"
    ],
    buttonText: "Contact Sales",
    href: "/contact",
    highlighted: false
  }
];

export default function Pricing() {
  return (
    <section className="landing-section relative z-10">
      <div className="landing-container">
        
        {/* Header */}
        <div className="landing-section-header text-left">
          <span className="landing-eyebrow">
            Pricing Plans
          </span>
          <h2 className="landing-heading animate-fade-in">
            Simple pricing built for developers
          </h2>
          <p className="landing-lead">
            Start free and upgrade as your system architecture scales.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[32px] items-stretch">
          {PLANS.map((plan, idx) => {
            return (
              <div 
                key={idx}
                className={`landing-card relative flex flex-col justify-between transition-all duration-300 ${
                  plan.highlighted 
                    ? 'bg-zinc-950 text-white border-emerald-500 shadow-[0_8px_32px_rgba(16,185,129,0.12)] scale-102 z-10' 
                    : 'bg-zinc-50/40 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 hover:shadow-2xs'
                }`}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 font-mono text-[9px] uppercase tracking-widest text-white bg-emerald-600 px-3 py-1 rounded-full border border-emerald-500/20 font-700">
                    Most Popular
                  </span>
                )}

                <div className="flex flex-col gap-6">
                  <div>
                    <h3 className={`text-[24px] font-bold ${plan.highlighted ? 'text-white' : 'text-zinc-900'}`}>{plan.name}</h3>
                    <p className={`text-[16px] mt-2 leading-relaxed font-light ${plan.highlighted ? 'text-zinc-455' : 'text-zinc-500'}`}>{plan.desc}</p>
                  </div>

                  <div className={`flex items-baseline gap-1 py-2 border-y ${plan.highlighted ? 'border-zinc-800' : 'border-zinc-200/60'}`}>
                    <span className={`text-[48px] font-bold font-sans ${plan.highlighted ? 'text-white' : 'text-zinc-900'}`}>${plan.price}</span>
                    <span className={`text-xs font-mono ${plan.highlighted ? 'text-zinc-500' : 'text-zinc-450'}`}>/ month</span>
                  </div>

                  <ul className="flex flex-col gap-3">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className={`flex gap-3 items-start text-[16px] font-light ${plan.highlighted ? 'text-zinc-300' : 'text-zinc-650'}`}>
                        <span className="text-emerald-500 font-mono mt-0.5">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <a
                    href={plan.href}
                    className={`flex h-11 w-full items-center justify-center rounded-full text-xs font-medium transition-all active:translate-y-px ${
                      plan.highlighted
                        ? 'bg-white text-zinc-950 hover:bg-zinc-200'
                        : 'border border-zinc-250 bg-white text-zinc-700 hover:text-zinc-950 hover:bg-zinc-50'
                    }`}
                  >
                    {plan.buttonText}
                  </a>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
