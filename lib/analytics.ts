/**
 * Client-side analytics. Only call from "use client" files or browser-only code.
 *
 *   import { trackEvent } from '@/lib/analytics';
 *   import { EVENTS } from '@/constants/events';
 *   trackEvent(EVENTS.SECTION_VIEW, { section_id: 'chapter-1', locale: 'en' });
 */

import { track } from "@vercel/analytics";
import type {
  EventName,
  EventParams,
  VercelEventProperties,
} from "./analytics.types";

// gtag is injected by AnalyticsManager after consent — may be undefined.
declare global {
  interface Window {
    gtag?: (
      command: string,
      action: string,
      params?: Record<string, unknown>,
    ) => void;
    dataLayer?: unknown[];
  }
}

/** Fans out to GA4 and Vercel Analytics. Both are no-ops until their scripts load post-consent. */
export function trackEvent<T extends EventName>(
  event: T,
  params: EventParams<T>,
): void {
  if (typeof window === "undefined") return;

  if (process.env.NODE_ENV === "development") {
    console.log("[analytics]", event, params);
  }

  if (typeof window.gtag === "function") {
    window.gtag("event", event, params as Record<string, unknown>);
  }

  // Only send to Vercel if the <Analytics /> script has loaded (i.e. consent given).
  // window.va is set by the Vercel Analytics script — absent before consent.
  if (typeof (window as Record<string, unknown>).va === "function") {
    track(event, params as unknown as VercelEventProperties);
  }
}
