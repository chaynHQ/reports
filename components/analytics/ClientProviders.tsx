"use client";

/**
 * Client boundary that dynamic-imports browser-only components with ssr: false.
 * Next.js 16+ only permits ssr: false inside a client component, so this bridges
 * the RSC/client boundary. Mount once at root layout level. Zero UI of its own.
 */

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import {
  CONSENT_COOKIE_NAME,
  CONSENT_EVENT,
  OPEN_SETTINGS_EVENT,
} from "./CookieBanner";

const AccessibilityPanel = dynamic(
  () =>
    import("../accessibility/AccessibilityPanel").then(
      (m) => m.AccessibilityPanel,
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
  // Raise floating buttons when the cookie banner is visible so they don't overlap.
  const [bannerOpen, setBannerOpen] = useState(false);

  useEffect(() => {
    // Banner is shown on first visit (no consent cookie) or when reopened via settings.
    const hasCookie = document.cookie
      .split(";")
      .some((c) => c.trim().startsWith(`${CONSENT_COOKIE_NAME}=`));
    setBannerOpen(!hasCookie);

    const onConsent = () => setBannerOpen(false);
    const onOpenSettings = () => setBannerOpen(true);
    window.addEventListener(CONSENT_EVENT, onConsent);
    window.addEventListener(OPEN_SETTINGS_EVENT, onOpenSettings);
    return () => {
      window.removeEventListener(CONSENT_EVENT, onConsent);
      window.removeEventListener(OPEN_SETTINGS_EVENT, onOpenSettings);
    };
  }, []);

  const bottomClass = bannerOpen ? "bottom-4 md:bottom-28" : "bottom-4";

  return (
    <>
      {/* analytics scripts: activated only after explicit cookie consent */}
      <AnalyticsManager />
      {/* cookie consent banner: shown once per visitor */}
      <CookieBanner />
      {/* leave site button: always visible for user safety */}
      <LeaveSiteButton />
      {/* Cookie settings — bottom-left, shown after consent choice (GDPR Art. 7(3)) */}
      <div
        className={`fixed  ${bottomClass} left-4 z-40 transition-all duration-300`}
      >
        <CookieSettingsButton />
      </div>
      {/* Accessibility + quick-mute cluster — bottom-right, always visible */}
      <div
        className={`fixed ${bottomClass} right-4 z-50 transition-all duration-300`}
      >
        <AccessibilityPanel />
      </div>
    </>
  );
}
