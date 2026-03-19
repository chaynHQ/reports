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
    /** Set by Cypress test runner; used to guard test-unsafe side effects. */
    Cypress?: unknown;
    // window.va is declared by @vercel/analytics — no redeclaration needed.
  }
}

/**
 * Sends a GA4 Consent Mode v2 revocation signal synchronously.
 * Call immediately when consent is withdrawn — before any further gtag calls.
 * Safe to call if gtag is not loaded (no-op).
 */
export function revokeGa4Consent(): void {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  window.gtag("consent", "update", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
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
  if (typeof window.va === "function") {
    track(event, params as unknown as VercelEventProperties);
  }
}
