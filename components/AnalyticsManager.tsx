"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import Cookies from "js-cookie";
import { hotjar } from "react-hotjar";

import {
  CONSENT_COOKIE_NAME,
  CONSENT_COOKIE_ACCEPTED,
  CONSENT_EVENT,
} from "./CookieBanner";

// ─── Environment variables ────────────────────────────────────────────────────
const GA_ID_RAW = process.env.NEXT_PUBLIC_GA_ID ?? "";
const HJ_ID_RAW = process.env.NEXT_PUBLIC_HOTJAR_ID ?? "";

/**
 * Validate GA4 measurement ID format (G-XXXXXXXXXX) before interpolating into
 * a <Script> innerHTML block. Prevents accidental or malicious injection if the
 * env var is misconfigured. Returns null for invalid/empty values so the
 * analytics block is simply not rendered.
 */
const GA_ID: string | null = /^G-[A-Z0-9]+$/i.test(GA_ID_RAW)
  ? GA_ID_RAW
  : null;

const HJ_ID: number | null = /^\d+$/.test(HJ_ID_RAW)
  ? Number(HJ_ID_RAW)
  : null;

/**
 * Hotjar snippet version — increment when Hotjar releases a new snippet version.
 * As of 2026, the current version is 6.
 */
const HJ_SV = process.env.NEXT_PUBLIC_HOTJAR_SV
  ? Number(process.env.NEXT_PUBLIC_HOTJAR_SV)
  : 6;

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * AnalyticsManager
 *
 * Privacy-first analytics loader. Reads the `chaynCookieConsent` cookie set by
 * <CookieBanner /> and only activates tracking services when the visitor has
 * explicitly opted in.
 *
 * Flow:
 *   1. On mount, reads cookie. consent === null until this read completes —
 *      nothing is rendered during that window (hydration guard).
 *   2. If cookie is "accepted": consent = true → analytics scripts inject.
 *   3. If cookie is absent or "declined": consent = false → no scripts.
 *   4. Listens for `chayn:consent-change` so in-session accept/decline fires
 *      without a page reload.
 *
 * Mounted via { ssr: false } in ClientProviders — never runs server-side.
 *
 * ─── IP Anonymization ────────────────────────────────────────────────────────
 *
 * Google Analytics 4
 *   `anonymize_ip: true` is passed in the gtag('config') call. GA4 already
 *   anonymizes IPs server-side by default (it's non-optional); this parameter
 *   makes intent explicit per ICO/CNIL guidance.
 *
 * Hotjar
 *   No `anonymize_ip` flag exists in the JS SDK. IP anonymization is handled
 *   server-side by Hotjar (last octet stripped before storage). Compliance is
 *   guaranteed by:
 *     (a) Only calling hotjar.initialize() after explicit opt-in (this file).
 *     (b) "IP Anonymization" MUST be enabled in the Hotjar dashboard under
 *         Settings → Privacy → IP Anonymization. This is a required manual step.
 *   Reference: https://help.hotjar.com/hc/en-us/articles/115011640647
 *
 * ─── Consent revocation ──────────────────────────────────────────────────────
 *   If the user later revokes consent via clearConsent() (exported from
 *   CookieBanner), the CONSENT_EVENT fires and consent is set back to false.
 *   Because Hotjar has no unload method, a page reload is required after
 *   revocation to fully purge it. GA4 and Vercel Analytics are gated by React
 *   state — they will not send further events once consent = false.
 */
export function AnalyticsManager() {
  // null = cookie not yet read (hydration guard)
  // true = "accepted"; false = "declined" or absent
  const [consent, setConsent] = useState<boolean | null>(null);

  // ── Read consent cookie and subscribe to live changes ──────────────────────
  useEffect(() => {
    const readConsent = () => {
      const value = Cookies.get(CONSENT_COOKIE_NAME);
      setConsent(value === CONSENT_COOKIE_ACCEPTED);
    };

    readConsent();
    window.addEventListener(CONSENT_EVENT, readConsent);
    return () => window.removeEventListener(CONSENT_EVENT, readConsent);
  }, []);

  // ── Conditionally initialize Hotjar ────────────────────────────────────────
  useEffect(() => {
    if (consent !== true || HJ_ID === null) return;
    if (hotjar.initialized()) return;

    hotjar.initialize({ id: HJ_ID, sv: HJ_SV });
  }, [consent]);

  // Render nothing until the consent cookie has been read on the client.
  // This is the critical hydration guard — no scripts ever load server-side or
  // before consent state is known.
  if (consent === null) return null;

  return (
    <>
      {/*
       * ── Google Analytics 4 ──────────────────────────────────────────────
       *
       * Only injected when:
       *   - consent === true (user explicitly accepted)
       *   - GA_ID passes format validation (guards against script injection)
       *
       * WHY raw <Script> instead of <GoogleAnalytics> from @next/third-parties:
       *   The GoogleAnalytics component (v16) hardcodes its gtag('config') call
       *   with no `anonymize_ip` prop. Inspected source:
       *   `gtag('config', '${gaId}' ${debugMode ? ",{ 'debug_mode': true }" : ''});`
       *   Raw Script tags give full control over the config object.
       *
       * anonymize_ip: true — belt-and-suspenders; GA4 always anonymizes IPs
       *   server-side, but setting this parameter documents our GDPR intent.
       */}
      {consent && GA_ID && (
        <>
          <Script
            id="ga4-script"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-config" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){window.dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', {
                anonymize_ip: true
              });
            `}
          </Script>
        </>
      )}

      {/*
       * ── Vercel Web Analytics ────────────────────────────────────────────
       *
       * Cookie-free and privacy-friendly by design. Still gated behind
       * explicit consent as our strictest GDPR default.
       */}
      {consent && <Analytics />}
    </>
  );
}
