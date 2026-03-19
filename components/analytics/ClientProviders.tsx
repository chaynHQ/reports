"use client";

/**
 * Client boundary that dynamic-imports browser-only components with ssr: false.
 * Next.js 16+ only permits ssr: false inside a client component, so this bridges
 * the RSC/client boundary. Mount once at root layout level. Zero UI of its own.
 */

import dynamic from "next/dynamic";

const CookieBanner = dynamic(
  () => import("./CookieBanner").then((m) => m.CookieBanner),
  { ssr: false },
);

const AnalyticsManager = dynamic(
  () => import("./AnalyticsManager").then((m) => m.AnalyticsManager),
  { ssr: false },
);

const CookieSettingsButton = dynamic(
  () => import("./CookieSettingsButton").then((m) => m.CookieSettingsButton),
  { ssr: false },
);

const LeaveSiteButton = dynamic(
  () => import("../layout/LeaveSiteButton").then((m) => m.LeaveSiteButton),
  { ssr: false },
);

export function ClientProviders() {
  return (
    <>
      {/* analytics scripts: activated only after explicit cookie consent */}
      <AnalyticsManager />
      {/* cookie consent banner: shown once per visitor */}
      <CookieBanner />
      {/* floating settings button: visible after initial choice (GDPR Art. 7(3)) */}
      <CookieSettingsButton />
      {/* leave site button: always visible for user safety */}
      <LeaveSiteButton />
    </>
  );
}
