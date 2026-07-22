import React, { useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { Navbar } from "../components/ui/Navbar"
import { GlowingEffect } from "@/components/ui/glowing-effect"
import Footer from "../Landing/Footer"

gsap.registerPlugin(ScrollTrigger, useGSAP)



const SHIFT_STEPS = [
  { id: "prompt", label: "Prompt Engineering" },
  { id: "coding", label: "AI Coding" },
  { id: "context", label: "Context Engineering" },
  { id: "systems", label: "AI Systems" },
];

const PRINCIPLES = [
  {
    n: "01",
    title: "Context First",
    body: "Everything begins with context, not prompts.",
  },
  {
    n: "02",
    title: "Developer Native",
    body: "Built for developers shipping real software.",
  },
  {
    n: "03",
    title: "Open Ecosystem",
    body: "Community templates. Shared knowledge. Reusable systems.",
  },
  {
    n: "04",
    title: "AI Ready",
    body: "Designed for today's models and tomorrow's.",
  },
];

export default function AboutPage() {
  const root = useRef(null);

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
            .from(".about-hero__letter", {
              yPercent: reduce ? 0 : 110,
              autoAlpha: reduce ? 1 : 0,
              stagger: reduce ? 0 : 0.08,
              duration: reduce ? 0 : 1.2,
              ease: "power4.out",
            })
            .from(
              ".about-hero__sub",
              { yPercent: reduce ? 0 : 40, autoAlpha: 0, duration: reduce ? 0 : 1 },
              "-=0.9"
            )
            .from(
              ".about-hero__ghost",
              { autoAlpha: 0, duration: reduce ? 0 : 1.8 },
              "-=1.2"
            );

          if (!reduce) {
            gsap.to(".about-hero__ghost", {
              yPercent: -30,
              ease: "none",
              scrollTrigger: {
                trigger: ".about-hero",
                start: "top top",
                end: "bottom top",
                scrub: true,
              },
            });

            gsap.to(".about-hero__title", {
              scale: 0.85,
              autoAlpha: 0,
              ease: "none",
              scrollTrigger: {
                trigger: ".about-hero",
                start: "top top",
                end: "bottom top",
                scrub: true,
              },
            });
          }

          /* ---------- SECTION 02 — WHY ---------- */
          gsap.utils.toArray(".why-line").forEach((line) => {
            gsap.from(line, {
              yPercent: reduce ? 0 : 110,
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

          /* ---------- SECTION 03 — THE SHIFT (pinned) ---------- */
          const shiftSection = document.querySelector(".shift");
          const steps = gsap.utils.toArray(".shift-step");

          if (shiftSection && steps.length) {
            const shiftTl = gsap.timeline({
              scrollTrigger: {
                trigger: shiftSection,
                start: "top top",
                end: `+=${steps.length * 60}%`,
                scrub: 1,
                pin: true,
                anticipatePin: 1,
              },
            });

            steps.forEach((step, i) => {
              if (i > 0) {
                shiftTl.to(steps[i - 1], { autoAlpha: 0.28, duration: 0.4 }, i);
              }
              shiftTl.to(step, { autoAlpha: 1, duration: 0.4 }, i);
              shiftTl.to(".shift-ghost", { autoAlpha: 0.04, duration: 0.4 }, i);
            });
          }

          /* ---------- SECTION 04 — PHILOSOPHY ---------- */
          gsap.utils.toArray(".manifesto-line").forEach((el) => {
            gsap.from(el, {
              autoAlpha: 0,
              yPercent: reduce ? 0 : 20,
              scale: reduce ? 1 : 0.96,
              duration: reduce ? 0 : 1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: el,
                start: "top 75%",
                end: "top 35%",
                scrub: true,
              },
            });
          });

          /* ---------- SECTION 05 — PRINCIPLES ---------- */
          gsap.from(".principle-card", {
            autoAlpha: 0,
            y: reduce ? 0 : 40,
            duration: reduce ? 0 : 0.8,
            stagger: reduce ? 0 : 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".principles-grid",
              start: "top 80%",
            },
          });

          /* ---------- SECTION 06 — ISTM ---------- */
          gsap.from(".istm-block", {
            autoAlpha: 0,
            y: reduce ? 0 : 24,
            duration: reduce ? 0 : 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".istm",
              start: "top 70%",
            },
          });

          /* ---------- SECTION 07 — VISION ---------- */
          gsap.utils.toArray(".vision-line").forEach((line) => {
            gsap.from(line, {
              autoAlpha: 0,
              yPercent: reduce ? 0 : 30,
              duration: reduce ? 0 : 1.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: line,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            });
          });

          /* ---------- SECTION 08 — CLOSING ---------- */
          gsap.from(".closing-signature", {
            autoAlpha: 0,
            y: reduce ? 0 : 16,
            duration: reduce ? 0 : 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ".closing",
              start: "top 80%",
            },
          });

          gsap.from(".closing-word", {
            yPercent: reduce ? 0 : 30,
            autoAlpha: 0,
            stagger: reduce ? 0 : 0.05,
            duration: reduce ? 0 : 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".closing",
              start: "top 80%",
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



  return (
    <div
      ref={root}
      className="bg-background text-foreground font-sans overflow-x-hidden"
    >
      <Navbar />

      {/* ===================== HERO ===================== */}
      <section className="about-hero relative flex h-screen w-full items-center justify-center overflow-hidden">
        <div className="about-hero__ghost font-tall pointer-events-none absolute inset-0 flex flex-col items-center justify-center select-none text-foreground opacity-[0.035] leading-[0.95] will-change-transform">
          <span className="text-[10vw] sm:text-[7rem]">CONTEXT</span>
          <span className="text-[10vw] sm:text-[7rem]">SYSTEMS</span>
          <span className="text-[10vw] sm:text-[7rem]">FUTURE</span>
        </div>

        <div className="relative z-10 flex flex-col items-center px-6 text-center w-full">
          <h1 className="about-hero__title font-tall leading-[0.75] tracking-tighter text-[clamp(8rem,28vw,32rem)] flex justify-center items-center gap-1 sm:gap-2 select-none">
            <span className="inline-flex overflow-hidden"><span className="about-hero__letter inline-block transform-gpu">A</span></span>
            <span className="inline-flex overflow-hidden"><span className="about-hero__letter inline-block transform-gpu">B</span></span>
            <span className="inline-flex overflow-hidden"><span className="about-hero__letter inline-block transform-gpu">O</span></span>
            <span className="inline-flex overflow-hidden"><span className="about-hero__letter inline-block transform-gpu">U</span></span>
            <span className="inline-flex overflow-hidden"><span className="about-hero__letter inline-block transform-gpu">T</span></span>
          </h1>
          <p className="about-hero__sub mt-8 w-full max-w-2xl font-sans text-base sm:text-lg text-ink-muted">
            Building the future of AI-native software development.
          </p>
        </div>
      </section>

      {/* ===================== 02 — WHY ===================== */}
      <section className="why relative mx-auto max-w-5xl px-6 py-40 sm:py-56">
        <div className="overflow-hidden">
          <p className="why-line font-tall text-[7vw] sm:text-[3.4rem] leading-[1.1]">
            Every AI session starts from zero.
          </p>
        </div>
        <div className="mt-10 overflow-hidden">
          <p className="why-line font-tall text-[7vw] sm:text-[3.4rem] leading-[1.1] text-ink-muted">
            Projects become larger. Architectures become more complex.
            Context gets longer.
          </p>
        </div>
        <div className="mt-10 overflow-hidden">
          <p className="why-line font-tall text-[7vw] sm:text-[3.4rem] leading-[1.1] text-ink-muted">
            Yet we still copy the same prompts, rewrite the same
            explanations, and hope the AI remembers.
          </p>
        </div>
        <div className="mt-16 overflow-hidden">
          <p className="why-line font-tall text-[7vw] sm:text-[3.4rem] leading-[1.1]">
            I built Zenix because AI doesn&rsquo;t need better prompts.
          </p>
        </div>
        <div className="mt-4 overflow-hidden">
          <p className="why-line font-tall text-[7vw] sm:text-[3.4rem] leading-[1.1] italic">
            It needs better context.
          </p>
        </div>
      </section>

      <div className="thin-divider mx-6 h-px bg-hairline" />

      {/* ===================== 03 — THE SHIFT ===================== */}
      <section className="shift relative flex h-screen w-full items-center justify-center overflow-hidden">
        <div className="shift-ghost font-tall pointer-events-none absolute inset-0 flex items-center justify-center text-[22vw] opacity-[0.03] select-none">
          SHIFT
        </div>

        <div className="relative z-10 flex flex-col items-center gap-8">
          {SHIFT_STEPS.map((step, i) => (
            <React.Fragment key={step.id}>
              <p
                className="shift-step font-tall text-[6vw] sm:text-4xl"
                style={{ opacity: i === 0 ? 1 : 0.28 }}
              >
                {step.label}
              </p>
              {i < SHIFT_STEPS.length - 1 && (
                <span className="font-sans text-ink-muted">↓</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ===================== 04 — PHILOSOPHY ===================== */}
      <section className="philosophy">
        {[
          ["PROMPTS", "ARE", "NOT", "ARCHITECTURE."],
          ["CONTEXT", "IS", "THE", "SOURCE", "OF", "TRUTH."],
          ["SYSTEMS", "SCALE.", "PROMPTS", "DON'T."],
          ["DOCUMENTATION", "IS", "PART", "OF", "THE", "PRODUCT."],
        ].map((lines, idx) => (
          <div
            key={idx}
            className="manifesto flex min-h-screen w-full flex-col items-center justify-center px-6"
          >
            <p className="manifesto-line w-full max-w-5xl font-tall text-center leading-[0.92] text-[9vw] sm:text-[5rem]">
              {lines.join(" ")}
            </p>
          </div>
        ))}
      </section>

      {/* ===================== 05 — PRINCIPLES ===================== */}
      <section className="principles mx-auto max-w-6xl px-6 py-40">
        <h2 className="mb-16 text-3xl font-[var(--font-weight-540)] tracking-tight sm:text-4xl">Principles</h2>
        <div className="principles-grid grid grid-cols-1 gap-6 sm:grid-cols-3">
          {PRINCIPLES.map((p, idx) => {
            const colSpan = (idx === 0 || idx === 3) ? "sm:col-span-2" : "sm:col-span-1"
            return (
              <div
                key={p.n}
                className={`relative min-h-[12rem] h-auto rounded-2xl border border-zinc-100 dark:border-zinc-800/80 p-1 md:p-1.5 bg-zinc-50/50 dark:bg-zinc-900/50 flex flex-col ${colSpan}`}
              >
                <GlowingEffect
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                />
                <div className="principle-card cursor-pointer relative flex flex-1 flex-col justify-between gap-10 rounded-xl bg-white dark:bg-zinc-950 p-10 border border-zinc-100/50 dark:border-zinc-800/60 w-full h-auto min-h-full transition-colors duration-300">
                  <span className="font-mono text-sm text-ink-muted">{p.n}</span>
                  <div>
                    <h3 className="text-2xl font-[var(--font-weight-540)] tracking-tight">{p.title}</h3>
                    <p className="mt-3 w-full max-w-[42ch] font-sans text-ink-muted">
                      {p.body}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ===================== 06 — WHO IS ISTM ===================== */}
      <section className="istm relative mx-auto max-w-4xl px-6 py-40 sm:py-56 text-center">
        <div className="istm-block w-full min-w-0">
          <p className="font-mono text-sm uppercase tracking-[0.2em] text-ink-muted">
            Who is ISTM?
          </p>
          <p className="mt-10 w-full max-w-[42ch] mx-auto font-tall text-[6vw] sm:text-3xl leading-[1.35]">
            ISTM is an independent builder exploring how humans and AI can
            build software together.
          </p>
          <p className="mt-8 w-full max-w-prose mx-auto font-sans text-lg text-ink-muted leading-relaxed">
            Rather than chasing prompts, the focus is on designing systems
            that help AI understand projects, architectures, and developer
            workflows.
          </p>
          <p className="mt-4 w-full max-w-prose mx-auto font-sans text-lg text-ink-muted">
            Zenix is the first step toward that vision.
          </p>
        </div>
      </section>

      <div className="thin-divider mx-6 h-px bg-hairline" />

      {/* ===================== 07 — VISION ===================== */}
      <section className="vision flex min-h-screen w-full flex-col items-center justify-center gap-2 px-6 text-center">
        <p className="vision-line font-tall text-[9vw] sm:text-6xl">
          LESS PROMPTING.
        </p>
        <p className="vision-line font-tall text-[9vw] sm:text-6xl text-ink-muted">
          MORE BUILDING.
        </p>
      </section>

      <section className="closing flex h-[70vh] w-full flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="closing-signature w-full font-sans text-sm uppercase tracking-[0.3em] text-ink-muted">
          Built by
        </p>
        <p className="closing-signature w-full font-tall text-4xl">ISTM</p>
        <p className="closing-word mt-6 w-full max-w-prose font-sans text-sm text-ink-muted select-none">
          Building tools for the next generation of AI-native developers.
        </p>
      </section>

      <Footer />
    </div>
  );
}
