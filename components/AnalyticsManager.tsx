"use client";

import { Analytics } from "@vercel/analytics/react";
import { GoogleAnalytics } from "@next/third-parties/google";
import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";
import { hotjar } from "react-hotjar";

import {
  CONSENT_COOKIE_ACCEPTED,
  CONSENT_COOKIE_NAME,
  CONSENT_EVENT,
} from "./CookieBanner";

// GA_ID validated against G-XXXXXXXXXX format — guards against script injection
// if the env var is misconfigured. Null = block is not rendered.
const GA_ID: string | null = /^G-[A-Z0-9]+$/i.test(
  process.env.NEXT_PUBLIC_GA_ID ?? "",
)
  ? (process.env.NEXT_PUBLIC_GA_ID ?? null)
  : null;

const HJ_ID: number | null = /^\d+$/.test(
  process.env.NEXT_PUBLIC_HOTJAR_ID ?? "",
)
  ? Number(process.env.NEXT_PUBLIC_HOTJAR_ID)
  : null;

// Defaults to 6 (current as of 2026). Override via NEXT_PUBLIC_HOTJAR_SV.
const HJ_SV = process.env.NEXT_PUBLIC_HOTJAR_SV
  ? Number(process.env.NEXT_PUBLIC_HOTJAR_SV)
  : 6;

/**
 * Loads analytics providers only after explicit cookie consent.
 * consent === null until the cookie is read on the client (hydration guard).
 *
 * Hotjar: no JS anonymize_ip flag exists — compliance relies on init-after-consent
 * (here) plus IP Anonymization enabled in the Hotjar dashboard (Settings → Privacy).
 * Hotjar has no unload API; consent revocation triggers a page reload to stop recording.
 */
export function AnalyticsManager() {
  const [consent, setConsent] = useState<boolean | null>(null);
  // Tracks whether GA4 was loaded in this page session — needed to revoke cleanly.
  const gaActiveRef = useRef(false);

  useEffect(() => {
    const readConsent = () => {
      setConsent(Cookies.get(CONSENT_COOKIE_NAME) === CONSENT_COOKIE_ACCEPTED);
    };
    readConsent();
    window.addEventListener(CONSENT_EVENT, readConsent);
    return () => window.removeEventListener(CONSENT_EVENT, readConsent);
  }, []);

  useEffect(() => {
    if (consent === true) {
      gaActiveRef.current = true;
    }

    // GA4 scripts persist in the DOM once injected by next/script — they cannot be
    // unloaded. When consent is withdrawn mid-session, use the GA4 Consent Mode API
    // to signal analytics_storage: denied (stops data collection) and null out
    // window.gtag so trackEvent no longer fires GA4 calls.
    if (consent === false && gaActiveRef.current) {
      // Consent Mode v2 signal is sent synchronously in CookieBanner.handleDecline /
      // clearConsent — null out gtag here so trackEvent no longer fires GA4 calls.
      window.gtag = undefined;
      gaActiveRef.current = false;
    }

    // Hotjar has no JS stop API — the only way to terminate an active session
    // recording after consent is withdrawn is a full page reload. The brief delay
    // lets the banner close before the reload fires.
    // Guard skips the reload during Cypress tests to avoid interrupting assertions.
    if (
      consent === false &&
      hotjar.initialized() &&
      typeof window.Cypress === "undefined"
    ) {
      setTimeout(() => window.location.reload(), 300);
    }
  }, [consent]);

  useEffect(() => {
    if (
      consent !== true ||
      HJ_ID === null ||
      process.env.NODE_ENV !== "production" || // Hotjar should only run in production
      hotjar.initialized()
    )
      return;
    hotjar.initialize({ id: HJ_ID, sv: HJ_SV });
  }, [consent]);

  if (consent === null) return null;

  return (
    <>
      {/* GA4 — anonymize_ip is deprecated; GA4 anonymises IP by default at the
          infrastructure level. <GoogleAnalytics> from @next/third-parties is used
          as the officially optimised integration. */}
      {consent && GA_ID && <GoogleAnalytics gaId={GA_ID} />}

      {/* Vercel Analytics — cookie-free by design, still gated behind consent. */}
      {consent && <Analytics />}
    </>
  );
}
