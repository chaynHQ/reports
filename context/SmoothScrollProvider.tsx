"use client";

import gsap from "gsap";
import Lenis from "lenis";
import { useEffect, type ReactNode } from "react";

interface SmoothScrollProviderProps {
  children: ReactNode;
}

/**
 * Initialises Lenis smooth scrolling for the entire page and synchronises it
 * with GSAP's ticker so scroll position and animations share a single rAF loop.
 *
 * Skips initialisation entirely when the user has enabled reduced-motion at the
 * OS level (A11y AA requirement) — native browser scroll is used in that case.
 *
 * Place this high in the layout tree (inside <body>) so all scrollytelling
 * sections inherit the same scroll context. Use @gsap/react's `useGSAP` hook
 * in individual animation components — do not create separate rAF loops.
 */
export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  useEffect(() => {
    // Respect the user's OS-level reduced-motion preference (A11y AA).
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // autoRaf: false — GSAP's ticker drives the loop; Lenis must not start its own.
    const lenis = new Lenis({ autoRaf: false });

    // Drive Lenis with GSAP's ticker so scroll and animations share one rAF loop.
    // lagSmoothing(0) prevents GSAP from throttling on hidden tabs, which would
    // cause Lenis to stutter on tab re-focus.
    const onTick = (time: number) => lenis.raf(time * 1000);

    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
