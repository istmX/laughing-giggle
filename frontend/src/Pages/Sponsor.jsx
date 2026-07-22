import React, { useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { Navbar } from "../components/ui/Navbar"
import { GlowingEffect } from "@/components/ui/glowing-effect"
import Footer from "../Landing/Footer"

gsap.registerPlugin(ScrollTrigger, useGSAP)


const IconSeedling = ({ className = "" }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    className={className}
    stroke="currentColor"
    strokeWidth="1.4"
  >
    <path d="M24 44V24" strokeLinecap="round" />
    <path
      d="M24 24C24 14 16 10 8 10C8 20 14 26 24 24Z"
      strokeLinejoin="round"
    />
    <path
      d="M24 18C24 10 32 6 40 6C40 16 33 22 24 18Z"
      strokeLinejoin="round"
    />
  </svg>
);

const IconNetwork = ({ className = "" }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    className={className}
    stroke="currentColor"
    strokeWidth="1.4"
  >
    <circle cx="24" cy="10" r="4.5" />
    <circle cx="9" cy="34" r="4.5" />
    <circle cx="39" cy="34" r="4.5" />
    <path d="M21 13.5L12 30" strokeLinecap="round" />
    <path d="M27 13.5L36 30" strokeLinecap="round" />
    <path d="M13.5 34H34.5" strokeLinecap="round" />
  </svg>
);

const IconInfinity = ({ className = "" }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    className={className}
    stroke="currentColor"
    strokeWidth="1.4"
  >
    <path
      d="M14 17C8 17 5 21 5 24C5 27 8 31 14 31C21 31 21 17 27 17C33 17 43 21 43 24C43 27 33 31 27 31C21 31 21 17 14 17Z"
      strokeLinejoin="round"
    />
  </svg>
);

const IconCheck = ({ className = "", pathRef }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <path
      ref={pathRef}
      d="M4 12.5L9.5 18L20 6"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconArrow = ({ className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    stroke="currentColor"
    strokeWidth="1.6"
  >
    <path d="M5 12H19" strokeLinecap="round" />
    <path d="M13 6L19 12L13 18" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ============================== DATA ============================== */

const WHY_PARTNER = [
  {
    icon: IconSeedling,
    title: "Support Independent Development",
    body: "Help build tools that empower the next generation of developers.",
  },
  {
    icon: IconNetwork,
    title: "Reach AI Developers",
    body: "Connect with builders exploring AI, context engineering, and modern software workflows.",
  },
  {
    icon: IconInfinity,
    title: "Long-Term Partnership",
    body: "More than sponsorship. Build something meaningful together.",
  },
];

const BENEFITS = [
  "Homepage Recognition",
  "Dedicated Partner Page",
  "Product Launch Mentions",
  "Community Recognition",
  "Early Feature Access",
  "Long-Term Collaboration",
];

const LEVELS = [
  {
    title: "Founding Partner",
    body: "The earliest supporters helping shape Zenix.",
  },
  {
    title: "Growth Partner",
    body: "Organizations supporting long-term development.",
  },
  {
    title: "Community Partner",
    body: "Supporting the open ecosystem and developer community.",
  },
];

export default function SponsorsPage() {
  const root = useRef(null);
  const checkPathRefs = useRef([]);
  const ctaButtonRefs = useRef([]);
  const skeletonRefs = useRef([]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          noPreference: "(prefers-reduced-motion: no-preference)",
        },
        (ctx) => {
          const { reduce } = ctx.conditions;

          /* ---------- HERO ---------- */
          const heroTl = gsap.timeline({
            defaults: { ease: "power3.out", duration: reduce ? 0 : 1.4 },
          });

          heroTl
            .from(".sponsors-hero__letter", {
              yPercent: reduce ? 0 : 110,
              autoAlpha: reduce ? 1 : 0,
              stagger: reduce ? 0 : 0.08,
              duration: reduce ? 0 : 1.2,
              ease: "power4.out",
            })
            .from(
              ".sponsors-hero__sub",
              { yPercent: reduce ? 0 : 40, autoAlpha: 0, duration: reduce ? 0 : 1 },
              "-=0.9"
            )
            .from(
              ".sponsors-hero__ghost",
              { autoAlpha: 0, duration: reduce ? 0 : 1.8 },
              "-=1.2"
            );

          if (!reduce) {
            gsap.to(".sponsors-hero__ghost", {
              yPercent: -26,
              ease: "none",
              scrollTrigger: {
                trigger: ".sponsors-hero",
                start: "top top",
                end: "bottom top",
                scrub: true,
              },
            });

            gsap.to(".sponsors-hero__title", {
              scale: 0.85,
              autoAlpha: 0,
              ease: "none",
              scrollTrigger: {
                trigger: ".sponsors-hero",
                start: "top top",
                end: "bottom top",
                scrub: true,
              },
            });
          }

          /* ---------- SECTION 02 — INDEPENDENT JOURNEY ---------- */
          gsap.utils.toArray(".journey-line").forEach((line) => {
            gsap.from(line, {
              yPercent: reduce ? 0 : 100,
              autoAlpha: 0,
              duration: reduce ? 0 : 0.9,
              ease: "power3.out",
              scrollTrigger: {
                trigger: line,
                start: "top 90%",
                toggleActions: "play none none reverse",
              },
            });
          });

          /* ---------- SECTION 03 — EMPTY STATE ---------- */
          gsap.from(".empty-state-card", {
            autoAlpha: 0,
            y: reduce ? 0 : 30,
            duration: reduce ? 0 : 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".empty-state-card",
              start: "top 80%",
            },
          });

          gsap.from(".skeleton-slot", {
            autoAlpha: 0,
            y: reduce ? 0 : 16,
            duration: reduce ? 0 : 0.8,
            stagger: reduce ? 0 : 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".empty-state",
              start: "top 78%",
            },
          });

          if (!reduce) {
            skeletonRefs.current.forEach((el, i) => {
              if (!el) return;
              gsap.to(el, {
                opacity: 0.55,
                duration: 1.8 + i * 0.15,
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true,
                delay: i * 0.2,
              });
            });
          }

          /* ---------- SECTION 04 — WHY PARTNER ---------- */
          gsap.from(".why-card", {
            autoAlpha: 0,
            y: reduce ? 0 : 40,
            duration: reduce ? 0 : 0.8,
            stagger: reduce ? 0 : 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".why-grid",
              start: "top 80%",
            },
          });

          /* ---------- SECTION 05 — BENEFITS ---------- */
          gsap.from(".benefit-row", {
            autoAlpha: 0,
            x: reduce ? 0 : -16,
            duration: reduce ? 0 : 0.6,
            stagger: reduce ? 0 : 0.08,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".benefits-list",
              start: "top 80%",
            },
          });

          checkPathRefs.current.forEach((path, i) => {
            if (!path) return;
            const length = path.getTotalLength();
            gsap.set(path, { strokeDasharray: length, strokeDashoffset: reduce ? 0 : length });
            if (!reduce) {
              gsap.to(path, {
                strokeDashoffset: 0,
                duration: 0.6,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: ".benefits-list",
                  start: "top 78%",
                },
                delay: 0.15 + i * 0.08,
              });
            }
          });

          /* ---------- SECTION 06 — PARTNERSHIP LEVELS ---------- */
          gsap.from(".level-card", {
            autoAlpha: 0,
            y: reduce ? 0 : 30,
            duration: reduce ? 0 : 0.8,
            stagger: reduce ? 0 : 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".levels-grid",
              start: "top 80%",
            },
          });

          /* ---------- SECTION 07 — LOOKING AHEAD ---------- */
          gsap.utils.toArray(".ahead-line").forEach((line) => {
            gsap.from(line, {
              yPercent: reduce ? 0 : 100,
              autoAlpha: 0,
              duration: reduce ? 0 : 0.9,
              ease: "power3.out",
              scrollTrigger: {
                trigger: line,
                start: "top 88%",
                toggleActions: "play none none reverse",
              },
            });
          });

          /* ---------- SECTION 08 — CTA ---------- */
          gsap.from(".cta-card", {
            autoAlpha: 0,
            y: reduce ? 0 : 30,
            duration: reduce ? 0 : 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".cta-card",
              start: "top 82%",
            },
          });

          /* ---------- DIVIDERS ---------- */
          gsap.utils.toArray(".thin-divider").forEach((div) => {
            gsap.from(div, {
              scaleX: 0,
              transformOrigin: "left center",
              duration: reduce ? 0 : 1,
              ease: "power2.inOut",
              scrollTrigger: {
                trigger: div,
                start: "top 90%",
              },
            });
          });

          return () => {};
        }
      );

      return () => mm.revert();
    },
    { scope: root }
  );

  /* Reusable magnetic hover */
  const magnetMove = (refArray, i, strengthX = 0.06, strengthY = 0.08) => (e) => {
    const el = refArray.current[i];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    gsap.to(el, {
      x: relX * strengthX,
      y: relY * strengthY,
      duration: 0.5,
      ease: "power3.out",
    });
  };

  const magnetLeave = (refArray, i) => () => {
    const el = refArray.current[i];
    if (!el) return;
    gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
  };

  return (
    <div
      ref={root}
      className="bg-background text-foreground font-sans overflow-x-hidden"
    >
      <Navbar />

      {/* ===================== HERO ===================== */}
      <section className="sponsors-hero relative flex h-screen w-full items-center justify-center overflow-hidden">
        <div className="sponsors-hero__ghost font-tall pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 select-none text-foreground opacity-[0.035] leading-[0.95] will-change-transform">
          <span className="text-[8vw] sm:text-[5.5rem]">SUPPORT</span>
          <span className="text-[8vw] sm:text-[5.5rem]">BUILD</span>
          <span className="text-[8vw] sm:text-[5.5rem]">FUTURE</span>
          <span className="text-[8vw] sm:text-[5.5rem]">PARTNERSHIP</span>
        </div>

        <div className="relative z-10 flex flex-col items-center px-6 text-center w-full">
          <h1 className="sponsors-hero__title font-tall leading-[0.75] tracking-tighter text-[clamp(8rem,24vw,28rem)] flex justify-center items-center gap-1 sm:gap-2 select-none">
            <span className="inline-flex overflow-hidden"><span className="sponsors-hero__letter inline-block transform-gpu">P</span></span>
            <span className="inline-flex overflow-hidden"><span className="sponsors-hero__letter inline-block transform-gpu">A</span></span>
            <span className="inline-flex overflow-hidden"><span className="sponsors-hero__letter inline-block transform-gpu">R</span></span>
            <span className="inline-flex overflow-hidden"><span className="sponsors-hero__letter inline-block transform-gpu">T</span></span>
            <span className="inline-flex overflow-hidden"><span className="sponsors-hero__letter inline-block transform-gpu">N</span></span>
            <span className="inline-flex overflow-hidden"><span className="sponsors-hero__letter inline-block transform-gpu">E</span></span>
            <span className="inline-flex overflow-hidden"><span className="sponsors-hero__letter inline-block transform-gpu">R</span></span>
            <span className="inline-flex overflow-hidden"><span className="sponsors-hero__letter inline-block transform-gpu">S</span></span>
          </h1>
          <p className="sponsors-hero__sub mt-8 w-full max-w-2xl font-sans text-base sm:text-lg text-ink-muted">
            Helping build the future of AI-native software development.
          </p>
        </div>
      </section>

      {/* ===================== 02 — INDEPENDENT JOURNEY ===================== */}
      <section className="journey relative mx-auto max-w-5xl px-6 py-40 sm:py-56">
        <div className="overflow-hidden">
          <p className="journey-line font-tall text-[6.5vw] sm:text-[3rem] leading-[1.15]">
            Zenix is currently developed independently.
          </p>
        </div>
        <div className="mt-10 overflow-hidden">
          <p className="journey-line font-tall text-[6.5vw] sm:text-[3rem] leading-[1.15] text-ink-muted">
            Every feature, design decision, and line of code is built with
            one goal: creating better workflows for AI-native software
            development.
          </p>
        </div>
        <div className="mt-16 overflow-hidden">
          <p className="journey-line font-tall text-[6.5vw] sm:text-[3rem] leading-[1.15]">
            The first partner won&rsquo;t simply sponsor a product.
          </p>
        </div>
        <div className="mt-4 overflow-hidden">
          <p className="journey-line font-tall text-[6.5vw] sm:text-[3rem] leading-[1.15] italic">
            They&rsquo;ll help shape its future.
          </p>
        </div>
      </section>

      <div className="thin-divider mx-6 h-px bg-hairline" />

      {/* ===================== 03 — EMPTY STATE ===================== */}
      <section className="empty-state relative mx-auto max-w-5xl px-6 py-40 sm:py-56">
        {/* skeleton logo placeholders, arranged behind the card */}
        <div className="pointer-events-none absolute inset-0 flex flex-wrap items-center justify-center gap-6 px-10 opacity-70">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              ref={(el) => (skeletonRefs.current[i] = el)}
              className="skeleton-slot h-16 w-36 rounded-lg border border-hairline bg-surface-soft opacity-30"
            />
          ))}
        </div>

        <div className="empty-state-card relative z-10 mx-auto flex max-w-md flex-col items-center gap-6 border border-hairline bg-background/90 px-10 py-16 text-center backdrop-blur-sm rounded-2xl">
          <svg
            viewBox="0 0 48 48"
            fill="none"
            className="h-10 w-10 text-ink-muted"
            stroke="currentColor"
            strokeWidth="1.2"
          >
            <rect x="6" y="14" width="36" height="24" rx="3" />
            <path d="M6 20H42" />
            <circle cx="14" cy="17" r="1.2" fill="currentColor" stroke="none" />
            <circle cx="19" cy="17" r="1.2" fill="currentColor" stroke="none" />
          </svg>
          <h2 className="font-tall text-3xl">No Partners Yet</h2>
          <p className="w-full max-w-[42ch] font-sans text-ink-muted">
            The first logo here could become part of the journey.
          </p>
          <button className="group mt-2 inline-flex items-center gap-2 rounded-full border border-foreground/70 px-6 py-3 font-sans text-sm transition-colors duration-300 hover:bg-foreground hover:text-background">
            Become the First Partner
            <IconArrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
      </section>

      {/* ===================== 04 — WHY PARTNER ===================== */}
      <section className="why-partner mx-auto max-w-6xl px-6 py-40">
        <h2 className="mb-16 font-tall text-3xl sm:text-4xl">
          Why Partner With Zenix
        </h2>
        <div className="why-grid grid grid-cols-1 gap-6 sm:grid-cols-3">
          {WHY_PARTNER.map((item, idx) => {
            const Icon = item.icon;
            const colSpan = idx === 0 ? "sm:col-span-2" : idx === 1 ? "sm:col-span-1" : "sm:col-span-3"
            return (
              <div
                key={item.title}
                className={`relative min-h-[12rem] h-auto rounded-2xl border border-zinc-100 dark:border-zinc-800/80 p-1 md:p-1.5 bg-zinc-50/50 dark:bg-zinc-900/50 flex flex-col ${colSpan}`}
              >
                <GlowingEffect
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                />
                <div className="why-card cursor-pointer relative flex flex-1 flex-col gap-6 rounded-xl bg-white dark:bg-zinc-950 p-10 border border-zinc-100/50 dark:border-zinc-800/60 w-full h-auto min-h-full transition-colors duration-300">
                  <Icon className="h-9 w-9 text-ink-muted transition-colors duration-300 group-hover:text-foreground" />
                  <div>
                    <h3 className="font-tall text-xl">{item.title}</h3>
                    <p className="mt-3 w-full max-w-[42ch] font-sans text-ink-muted">
                      {item.body}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ===================== 05 — BENEFITS ===================== */}
      <section className="benefits mx-auto max-w-3xl px-6 py-40">
        <h2 className="mb-16 font-tall text-3xl sm:text-4xl">
          Partnership Benefits
        </h2>
        <ul className="benefits-list flex flex-col gap-6">
          {BENEFITS.map((benefit, i) => (
            <li
              key={benefit}
              className="benefit-row flex items-center gap-4 border-b border-hairline pb-6 last:border-b-0"
            >
              <IconCheck
                className="h-6 w-6 shrink-0 text-ink-muted"
                pathRef={(el) => (checkPathRefs.current[i] = el)}
              />
              <span className="font-sans text-lg sm:text-xl">{benefit}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="thin-divider mx-6 h-px bg-hairline" />

      {/* ===================== 06 — PARTNERSHIP LEVELS ===================== */}
      <section className="levels mx-auto max-w-6xl px-6 py-40">
        <h2 className="mb-16 font-tall text-3xl sm:text-4xl">
          Partnership Levels
        </h2>
        <div className="levels-grid grid grid-cols-1 gap-6 sm:grid-cols-3">
          {LEVELS.map((level, i) => {
            const colSpan = i === 0 ? "sm:col-span-1" : i === 1 ? "sm:col-span-2" : "sm:col-span-3"
            return (
              <div
                key={level.title}
                className={`relative min-h-[12rem] h-auto rounded-2xl border border-zinc-100 dark:border-zinc-800/80 p-1 md:p-1.5 bg-zinc-50/50 dark:bg-zinc-900/50 flex flex-col ${colSpan}`}
              >
                <GlowingEffect
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                />
                <div className="level-card cursor-pointer relative flex flex-1 flex-col justify-between gap-10 rounded-xl bg-white dark:bg-zinc-950 p-10 border border-zinc-100/50 dark:border-zinc-800/60 w-full h-auto min-h-full transition-colors duration-300">
                  <span className="font-mono text-sm text-ink-muted">
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="font-tall text-2xl">{level.title}</h3>
                    <p className="mt-3 w-full max-w-[42ch] font-sans text-ink-muted">
                      {level.body}
                    </p>
                  </div>
                  <span className="font-sans text-sm italic text-ink-muted">
                    Available upon discussion.
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ===================== 07 — LOOKING AHEAD ===================== */}
      <section className="ahead flex min-h-screen w-full flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="overflow-hidden">
          <p className="ahead-line font-tall text-[7vw] sm:text-5xl">
            This page won&rsquo;t stay empty forever.
          </p>
        </div>
        <div className="overflow-hidden">
          <p className="ahead-line font-tall text-[7vw] sm:text-5xl text-ink-muted">
            Every great product starts somewhere.
          </p>
        </div>
        <div className="overflow-hidden">
          <p className="ahead-line font-tall text-[7vw] sm:text-5xl italic">
            The first partner becomes part of the story.
          </p>
        </div>
      </section>

      <section className="cta mx-auto max-w-4xl px-6 py-40 sm:py-56">
        <div className="cta-card flex flex-col items-center gap-8 rounded-2xl border border-hairline bg-surface-soft px-10 py-20 text-center">
          <h2 className="font-tall text-[7vw] sm:text-5xl leading-[1.05]">
            Interested in partnering with Zenix?
          </h2>
          <p className="w-full max-w-md font-sans text-lg text-ink-muted">
            Let&rsquo;s build the future together.
          </p>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row">
            <button
              ref={(el) => (ctaButtonRefs.current[0] = el)}
              onMouseMove={magnetMove(ctaButtonRefs, 0, 0.15, 0.25)}
              onMouseLeave={magnetLeave(ctaButtonRefs, 0)}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-8 py-3 font-sans text-sm text-background transition-transform duration-300"
            >
              Become a Partner
              <IconArrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <button
              ref={(el) => (ctaButtonRefs.current[1] = el)}
              onMouseMove={magnetMove(ctaButtonRefs, 1, 0.15, 0.25)}
              onMouseLeave={magnetLeave(ctaButtonRefs, 1)}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-foreground/60 px-8 py-3 font-sans text-sm transition-colors duration-300 hover:bg-surface-elevated"
            >
              Get in Touch
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
