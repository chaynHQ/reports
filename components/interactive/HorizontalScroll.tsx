"use client";

import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import { useRef } from "react";
import { useAppStore } from "@/lib/store/useAppStore";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// ── Panel theme tokens ────────────────────────────────────────────────────────
const PANEL_THEMES = [
  {
    bg:      "var(--color-foreground)",
    text:    "var(--color-cream)",
    eyebrow: "color-mix(in srgb, var(--color-cream) 45%, transparent)",
    sub:     "color-mix(in srgb, var(--color-cream) 65%, transparent)",
  },
  {
    bg:      "var(--color-red)",
    text:    "var(--color-cream)",
    eyebrow: "color-mix(in srgb, var(--color-cream) 50%, transparent)",
    sub:     "color-mix(in srgb, var(--color-cream) 70%, transparent)",
  },
  {
    bg:      "var(--color-peach)",
    text:    "var(--color-foreground)",
    eyebrow: "color-mix(in srgb, var(--color-foreground) 45%, transparent)",
    sub:     "color-mix(in srgb, var(--color-foreground) 65%, transparent)",
  },
  {
    bg:      "var(--color-background)",
    text:    "var(--color-foreground)",
    eyebrow: "color-mix(in srgb, var(--color-foreground) 40%, transparent)",
    sub:     "color-mix(in srgb, var(--color-foreground) 60%, transparent)",
  },
] as const;

// ── Types ─────────────────────────────────────────────────────────────────────

export interface HorizontalScrollLink {
  label: string;
  href: string;
  primary?: boolean;
}

export type HorizontalScrollPanel =
  | { type: "intro"; eyebrow: string; heading: string; body: string; scrollCue?: string }
  | { type: "stat";  eyebrow: string; stat: string;    body: string }
  | { type: "quote"; eyebrow: string; quote: string;   attribution?: string }
  | { type: "cta";   eyebrow: string; heading: string; body: string; links: HorizontalScrollLink[] };

export interface HorizontalScrollProps {
  panels: HorizontalScrollPanel[];
}

// ── Styles ────────────────────────────────────────────────────────────────────

const stickyViewportStyles = "sticky top-0 h-screen overflow-hidden";
const trackStyles          = "flex h-full will-change-transform";
const eyebrowStyles        = "font-mono text-xs uppercase tracking-widest";
const panelHeadingStyles   = "font-serif text-4xl md:text-6xl leading-tight max-w-[18ch]";
const panelBodyStyles      = "text-base md:text-lg leading-relaxed";
const scrollCueStyles      = "font-mono text-xs flex items-center gap-3 mt-6";
const bigStatStyles        = "font-serif text-[clamp(5rem,18vw,14rem)] leading-none font-bold tabular-nums";
const statBodyStyles       = "text-lg md:text-xl max-w-[28ch] leading-snug";
const quoteStyles          = "font-serif text-3xl md:text-5xl leading-tight max-w-[24ch]";
const attributionStyles    = "not-italic text-sm";
const ctaRowStyles         = "flex flex-wrap gap-3 mt-2";
const ctaPrimaryStyles     = "btn-pill bg-foreground text-background text-sm";
const ctaSecondaryStyles   = "btn-pill border border-foreground/30 text-foreground text-sm";

// ── Panel wrapper ─────────────────────────────────────────────────────────────

const panelStyles = "flex-shrink-0 flex flex-col justify-center gap-6 px-12 md:px-20 h-full";

type PanelTheme = (typeof PANEL_THEMES)[number];

interface PanelProps {
  children: React.ReactNode;
  theme: PanelTheme;
  centered?: boolean;
}

function Panel({ children, theme, centered = false }: PanelProps) {
  return (
    <div
      className={panelStyles}
      style={{
        width:      "100vw",
        background: theme.bg,
        alignItems: centered ? "center" : "flex-start",
        textAlign:  centered ? "center" : "start",
      }}
    >
      {children}
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export function HorizontalScroll({ panels }: HorizontalScrollProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useAppStore((s) => s.reduceMotion);

  useGSAP(
    () => {
      if (reduceMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        // Reset any previously applied height so panels flow naturally
        if (outerRef.current) outerRef.current.style.height = "";
        return;
      }
      if (!outerRef.current || !trackRef.current) return;

      const outer = outerRef.current;
      const track = trackRef.current;

      const getMove = () =>
        track.scrollWidth - document.documentElement.clientWidth;

      const setOuterHeight = () => {
        outer.style.height = `calc(100vh + ${getMove()}px)`;
      };

      setOuterHeight();

      gsap.to(track, {
        x: () => -getMove(),
        ease: "none",
        scrollTrigger: {
          trigger: outer,
          start: "top top",
          end: () => `+=${getMove()}`,
          scrub: 1,
          invalidateOnRefresh: true,
          onRefresh: setOuterHeight,
        },
      });
    },
    { scope: outerRef, dependencies: [reduceMotion] }
  );

  return (
    <div ref={outerRef}>
      <div className={stickyViewportStyles}>
        <div ref={trackRef} className={trackStyles}>
          {panels.map((panel, i) => {
            const theme = PANEL_THEMES[i % PANEL_THEMES.length];
            return (
              <Panel
                key={i}
                theme={theme}
                centered={panel.type === "stat"}
              >
                {panel.type === "intro" && (
                  <>
                    <p className={eyebrowStyles} style={{ color: theme.eyebrow }}>
                      {panel.eyebrow}
                    </p>
                    <h2 className={panelHeadingStyles} style={{ color: theme.text }}>
                      {panel.heading}
                    </h2>
                    <p className={`${panelBodyStyles} max-w-[40ch]`} style={{ color: theme.sub }}>
                      {panel.body}
                    </p>
                    {panel.scrollCue && (
                      <p className={scrollCueStyles} style={{ color: theme.eyebrow }}>
                        <span aria-hidden="true">→</span>
                        {panel.scrollCue}
                      </p>
                    )}
                  </>
                )}

                {panel.type === "stat" && (
                  <>
                    <p className={eyebrowStyles} style={{ color: theme.eyebrow }}>
                      {panel.eyebrow}
                    </p>
                    <p className={bigStatStyles} style={{ color: theme.text }}>
                      {panel.stat}
                    </p>
                    <p className={statBodyStyles} style={{ color: theme.sub }}>
                      {panel.body}
                    </p>
                  </>
                )}

                {panel.type === "quote" && (
                  <>
                    <p className={eyebrowStyles} style={{ color: theme.eyebrow }}>
                      {panel.eyebrow}
                    </p>
                    <blockquote className="flex flex-col gap-5">
                      <p className={quoteStyles} style={{ color: theme.text }}>
                        &ldquo;{panel.quote}&rdquo;
                      </p>
                      {panel.attribution && (
                        <footer>
                          <cite className={attributionStyles} style={{ color: theme.sub }}>
                            &mdash; {panel.attribution}
                          </cite>
                        </footer>
                      )}
                    </blockquote>
                  </>
                )}

                {panel.type === "cta" && (
                  <>
                    <p className={eyebrowStyles} style={{ color: theme.eyebrow }}>
                      {panel.eyebrow}
                    </p>
                    <h2 className={panelHeadingStyles} style={{ color: theme.text }}>
                      {panel.heading}
                    </h2>
                    <p className={`${panelBodyStyles} max-w-[36ch]`} style={{ color: theme.sub }}>
                      {panel.body}
                    </p>
                    <div className={ctaRowStyles}>
                      {panel.links.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={link.primary ? ctaPrimaryStyles : ctaSecondaryStyles}
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </>
                )}
              </Panel>
            );
          })}
        </div>
      </div>
    </div>
  );
}
