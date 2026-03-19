"use client";

/**
 * Client boundary that dynamic-imports browser-only components with ssr: false.
 * Next.js 16+ only permits ssr: false inside a client component, so this bridges
 * the RSC/client boundary. Mount once at root layout level. Zero UI of its own.
 */

import dynamic from "next/dynamic";

const AccessibilityPanel = dynamic(
  () =>
    import("../accessibility/AccessibilityPanel").then(
      (m) => m.AccessibilityPanel
    ),
  { ssr: false },
);

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
      {/* leave site button: always visible for user safety */}
      <LeaveSiteButton />
      {/* Cookie settings — bottom-left, shown after consent choice (GDPR Art. 7(3)) */}
      <div className="fixed bottom-4 left-4 z-40">
        <CookieSettingsButton />
      </div>
      {/* Accessibility + quick-mute cluster — bottom-right, always visible */}
      <div className="fixed bottom-4 right-4 z-50">
        <AccessibilityPanel />
      </div>
    </>
  );
}
