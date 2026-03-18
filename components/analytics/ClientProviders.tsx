"use client";

/**
 * ClientProviders
 *
 * Thin "use client" wrapper that dynamic-imports browser-only islands with
 * { ssr: false }. In Next.js 16+, `ssr: false` is only permitted inside a
 * Client Component, not a Server Component (RSC), so we bridge the gap here.
 *
 * Mount once at the root layout level. Zero UI of its own.
 */

import dynamic from "next/dynamic";

const CookieBanner = dynamic(
  () => import("./CookieBanner").then((m) => m.CookieBanner),
  { ssr: false }
);

const AnalyticsManager = dynamic(
  () => import("./AnalyticsManager").then((m) => m.AnalyticsManager),
  { ssr: false }
);

const CookieSettingsButton = dynamic(
  () => import("./CookieSettingsButton").then((m) => m.CookieSettingsButton),
  { ssr: false }
);

export function ClientProviders() {
  return (
    <>
      {/* Analytics scripts: activated only after explicit cookie consent */}
      <AnalyticsManager />
      {/* Cookie consent banner: shown once per visitor */}
      <CookieBanner />
      {/* Floating settings button: visible after initial choice (GDPR Art. 7(3)) */}
      <CookieSettingsButton />
    </>
  );
}
