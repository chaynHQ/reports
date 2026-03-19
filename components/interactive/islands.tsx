"use client";

/**
 * Client boundary that dynamic-imports browser-only interactive components
 * with ssr: false. Next.js 16+ only permits ssr: false inside a client
 * component, so this bridges the RSC/client boundary.
 *
 * Import from this file (not from the component files directly) whenever
 * you need ssr: false behaviour in a Server Component page or layout.
 */

import dynamic from "next/dynamic";

export const AudioTrigger = dynamic(
  () => import("./AudioTrigger").then((m) => m.AudioTrigger),
  { ssr: false }
);

export const AnimatedChart = dynamic(
  () => import("./AnimatedChart").then((m) => m.AnimatedChart),
  { ssr: false }
);

export const InteractiveMap = dynamic(
  () => import("./InteractiveMap").then((m) => m.InteractiveMap),
  { ssr: false }
);

export const AreaChart = dynamic(
  () => import("./AreaChart").then((m) => m.AreaChart),
  { ssr: false }
);

export const StatCounter = dynamic(
  () => import("./StatCounter").then((m) => m.StatCounter),
  { ssr: false }
);

export const HorizontalCards = dynamic(
  () => import("./HorizontalCards").then((m) => m.HorizontalCards),
  { ssr: false }
);

export const ScrollReveal = dynamic(
  () => import("./ScrollReveal").then((m) => m.ScrollReveal),
  { ssr: false }
);

export const StickyScroll = dynamic(
  () => import("./StickyScroll").then((m) => m.StickyScroll),
  { ssr: false }
);

export const HorizontalScroll = dynamic(
  () => import("./HorizontalScroll").then((m) => m.HorizontalScroll),
  { ssr: false }
);
