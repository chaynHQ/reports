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

// GA_ID validated against G-XXXXXXXXXX format — guards against script injection
// if the env var is misconfigured. Null = block is not rendered.
const GA_ID: string | null = /^G-[A-Z0-9]+$/i.test(process.env.NEXT_PUBLIC_GA_ID ?? "")
  ? (process.env.NEXT_PUBLIC_GA_ID ?? null)
  : null;

const HJ_ID: number | null = /^\d+$/.test(process.env.NEXT_PUBLIC_HOTJAR_ID ?? "")
  ? Number(process.env.NEXT_PUBLIC_HOTJAR_ID)
  : null;

// Defaults to 6 (current as of 2026). Override via NEXT_PUBLIC_HOTJAR_SV.
const HJ_SV = process.env.NEXT_PUBLIC_HOTJAR_SV ? Number(process.env.NEXT_PUBLIC_HOTJAR_SV) : 6;

/**
 * Loads analytics providers only after explicit cookie consent.
 * consent === null until the cookie is read on the client (hydration guard).
 *
 * Hotjar: no JS anonymize_ip flag exists — compliance relies on init-after-consent
 * (here) plus IP Anonymization enabled in the Hotjar dashboard (Settings → Privacy).
 * Hotjar also has no unload method, so a page reload is needed after consent revocation.
 */
export function AnalyticsManager() {
  const [consent, setConsent] = useState<boolean | null>(null);

  useEffect(() => {
    const readConsent = () => {
      setConsent(Cookies.get(CONSENT_COOKIE_NAME) === CONSENT_COOKIE_ACCEPTED);
    };
    readConsent();
    window.addEventListener(CONSENT_EVENT, readConsent);
    return () => window.removeEventListener(CONSENT_EVENT, readConsent);
  }, []);

  useEffect(() => {
    if (consent !== true || HJ_ID === null || hotjar.initialized()) return;
    hotjar.initialize({ id: HJ_ID, sv: HJ_SV });
  }, [consent]);

  if (consent === null) return null;

  return (
    <>
      {/* GA4 — raw <Script> used instead of <GoogleAnalytics> from @next/third-parties
          because that component doesn't expose an anonymize_ip prop. */}
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
              gtag('config', '${GA_ID}', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}

      {/* Vercel Analytics — cookie-free by design, still gated behind consent. */}
      {consent && <Analytics />}
    </>
  );
}
