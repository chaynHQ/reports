"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// Per-step colour themes cycling through the brand palette.
// Visual panel background swaps instantly; GSAP fades the stat text in/out.
const STEP_THEMES = [
  {
    bg: "var(--color-peach-tint)",
    accent: "var(--color-red)",
    text: "var(--color-foreground)",
  },
  {
    bg: "var(--color-foreground)",
    accent: "var(--color-cream)",
    text: "var(--color-cream)",
  },
  {
    bg: "var(--color-peach)",
    accent: "var(--color-foreground)",
    text: "var(--color-foreground)",
  },
  {
    bg: "var(--color-red)",
    accent: "var(--color-cream)",
    text: "var(--color-cream)",
  },
] as const;

// ── Styles ────────────────────────────────────────────────────────────────────

const containerGridStyles = "grid grid-cols-1 md:grid-cols-2";
const stickyPanelStyles =
  "hidden md:flex sticky top-0 h-screen self-start items-center justify-center flex-col gap-8";
const statContentStyles = "flex flex-col items-center gap-4 text-center px-12";
const statValueStyles =
  "font-serif text-7xl xl:text-8xl leading-none font-bold tabular-nums";
const statLabelStyles = "text-sm leading-snug max-w-[22ch]";
const progressDotsStyles = "flex gap-2";
const progressDotStyles = "inline-block rounded-full";
const stepRowStyles =
  "flex min-h-screen items-center border-b border-foreground/8 last:border-b-0";
const stepContentStyles = "flex flex-col gap-5 px-8 md:px-14 py-20 max-w-prose";
const mobileStatStyles =
  "block md:hidden font-serif text-5xl leading-none font-bold";
const categoryStyles =
  "font-mono text-xs uppercase tracking-widest text-foreground/80";
const headingStyles =
  "font-serif text-3xl leading-tight transition-opacity duration-300";
const bodyStyles = "text-base leading-relaxed text-foreground/80";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface StickyScrollStep {
  category: string;
  heading: string;
  body: string;
  stat: string;
  statLabel: string;
}

export interface StickyScrollProps {
  steps: StickyScrollStep[];
}

// ── Component ─────────────────────────────────────────────────────────────────

export function StickyScroll({ steps }: StickyScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const statRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const prevStepRef = useRef(0);
  const hasMounted = useRef(false);

  useGSAP(
    () => {
      stepRefs.current.forEach((el, i) => {
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 55%",
          onEnter: () => setActiveStep(i),
          onEnterBack: () => setActiveStep(i),
        });
      });
    },
    { scope: containerRef },
  );

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    if (!statRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      prevStepRef.current = activeStep;
      return;
    }

    const direction = activeStep > prevStepRef.current ? 1 : -1;
    prevStepRef.current = activeStep;

    gsap.fromTo(
      statRef.current,
      { opacity: 0, y: direction * 36 },
      { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" },
    );
  }, [activeStep]);

  const theme = STEP_THEMES[activeStep % STEP_THEMES.length];
  const activeStepData = steps[activeStep];

  return (
    <div ref={containerRef} className={containerGridStyles}>
      {/* ── Left: sticky visual panel (desktop only) ─────────────────── */}
      <div
        className={stickyPanelStyles}
        style={{ background: theme.bg, transition: "background 0.3s ease" }}
      >
        <div ref={statRef} className={statContentStyles}>
          <p className={statValueStyles} style={{ color: theme.accent }}>
            {activeStepData.stat}
          </p>
          <p
            className={statLabelStyles}
            style={{ color: theme.text, opacity: 0.8 }}
          >
            {activeStepData.statLabel}
          </p>
        </div>

        <div className={progressDotsStyles} aria-hidden="true">
          {steps.map((_, i) => (
            <span
              key={i}
              className={progressDotStyles}
              style={{
                width: i === activeStep ? "28px" : "8px",
                height: "8px",
                background: theme.accent,
                opacity: i === activeStep ? 1 : 0.25,
                transition: "width 0.3s ease, opacity 0.3s ease",
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Right: scrolling text steps ──────────────────────────────── */}
      <div>
        {steps.map((step, i) => {
          const stepTheme = STEP_THEMES[i % STEP_THEMES.length];
          const isActive = i === activeStep;
          return (
            <div
              key={i}
              ref={(el) => void (stepRefs.current[i] = el)}
              className={stepRowStyles}
            >
              <div className={stepContentStyles}>
                <p
                  className={mobileStatStyles}
                  style={{ color: stepTheme.accent }}
                >
                  {step.stat}
                </p>

                <p className={categoryStyles}>{step.category}</p>

                <h3
                  className={headingStyles}
                  style={{ opacity: isActive ? 1 : 0.8 }}
                >
                  {step.heading}
                </h3>

                <p className={bodyStyles}>{step.body}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
