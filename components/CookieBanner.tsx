"use client";

import { EVENTS } from "@/constants/events";
import { revokeGa4Consent, trackEvent } from "@/lib/analytics";
import Cookies from "js-cookie";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import CookieConsent, { resetCookieConsentValue } from "react-cookie-consent";

export const CONSENT_COOKIE_NAME = "chaynCookieConsent";
export const CONSENT_COOKIE_ACCEPTED = "accepted";
export const CONSENT_COOKIE_DECLINED = "declined";
/** Dispatched on window whenever consent is accepted, declined, or revoked. */
export const CONSENT_EVENT = "chayn:consent-change";
/** Dispatched by CookieSettingsButton to open the banner in update mode. */
export const OPEN_SETTINGS_EVENT = "chayn:open-settings";

/**
 * Clears consent and notifies AnalyticsManager to stop rendering tracking scripts.
 * Call from a "Change cookie settings" link (GDPR Art. 7(3)).
 * NOTE: Hotjar has no JS unload method — AnalyticsManager reloads the page automatically.
 */
export function clearConsent() {
  revokeGa4Consent(); // send Consent Mode v2 signal before analytics shut down
  trackEvent(EVENTS.COOKIE_CONSENT_REVOKED, {}); // fire while analytics are still active
  resetCookieConsentValue(CONSENT_COOKIE_NAME);
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

export function CookieBanner() {
  const t = useTranslations("cookieBanner");

  // updateMode: true when reopened via CookieSettingsButton
  // prevConsent: the accepted/declined value that was set before update mode opened
  const [updateMode, setUpdateMode] = useState(false);
  const [prevConsent, setPrevConsent] = useState<string | null>(null);
  const updateHeadingRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const handleOpenSettings = (e: Event) => {
      const detail = (e as CustomEvent<{ currentConsent: string }>).detail;
      setPrevConsent(detail.currentConsent ?? null);
      setUpdateMode(true);
    };
    window.addEventListener(OPEN_SETTINGS_EVENT, handleOpenSettings);
    return () =>
      window.removeEventListener(OPEN_SETTINGS_EVENT, handleOpenSettings);
  }, []);

  useEffect(() => {
    if (updateMode) {
      updateHeadingRef.current?.focus();
    }
  }, [updateMode]);

  const handleAccept = () => {
    setUpdateMode(false);
    // GA4 loads after this fires, so accept is captured by Vercel Analytics only.
    trackEvent(EVENTS.COOKIE_CONSENT_ACCEPTED, {});
    window.dispatchEvent(new Event(CONSENT_EVENT));
  };

  const handleDecline = () => {
    setUpdateMode(false);
    // Explicitly write the declined value before dispatching the event so that
    // AnalyticsManager.readConsent() sees the updated cookie synchronously.
    // react-cookie-consent also sets this cookie, but the timing is not guaranteed
    // relative to the onDecline callback, which would cause the revocation effect to miss.
    Cookies.set(CONSENT_COOKIE_NAME, CONSENT_COOKIE_DECLINED, { path: "/" });
    revokeGa4Consent(); // synchronous Consent Mode v2 signal — does not depend on React effect timing
    // No provider loads for declined users — correct GDPR behaviour.
    trackEvent(EVENTS.COOKIE_CONSENT_DECLINED, {});
    window.dispatchEvent(new Event(CONSENT_EVENT));
  };

  const statusText =
    prevConsent === CONSENT_COOKIE_ACCEPTED
      ? t("statusEnabled")
      : t("statusDisabled");

  return (
    <CookieConsent
      cookieName={CONSENT_COOKIE_NAME}
      cookieValue={CONSENT_COOKIE_ACCEPTED}
      declineCookieValue={CONSENT_COOKIE_DECLINED}
      expires={365}
      sameSite="strict"
      extraCookieOptions={{ path: "/" }} // accessible on all locale routes e.g. /hi
      enableDeclineButton
      flipButtons
      visible={updateMode ? "show" : "byCookieValue"}
      onAccept={handleAccept}
      onDecline={handleDecline}
      buttonText={t("acceptButton")}
      declineButtonText={t("declineButton")}
      ariaAcceptLabel={t("acceptAriaLabel")}
      ariaDeclineLabel={t("declineAriaLabel")}
      customContainerAttributes={{
        role: "region",
        "aria-label": t("regionLabel"),
      }}
      disableStyles
      containerClasses="fixed bottom-0 left-0 right-0 z-50 flex flex-col gap-4 border-t border-peach bg-cream px-6 py-5 shadow-lg sm:flex-row sm:items-center"
      contentClasses="flex-1 text-sm leading-relaxed text-foreground/80"
      buttonWrapperClasses="flex shrink-0 gap-3"
      buttonClasses="rounded-full bg-red px-5 py-2 text-sm font-semibold text-cream transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2"
      declineButtonClasses="rounded-full border border-red/30 px-5 py-2 text-sm font-semibold text-red transition-colors hover:border-red hover:bg-red/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2"
    >
      {updateMode ? (
        <>
          <p
            ref={updateHeadingRef}
            tabIndex={-1}
            className="font-semibold text-foreground focus-visible:outline-none"
          >
            {t("updateHeading")}
          </p>
          <p>
            {statusText} {t("updateBody")}{" "}
            <Link
              target="_blank"
              href="https://www.chayn.co/policies/privacy-policy"
              className="underline underline-offset-2 hover:text-red focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-1"
            >
              {t("privacyLink")}
            </Link>
          </p>
        </>
      ) : (
        <p>
          <strong className="font-semibold text-foreground">
            {t("heading")}
          </strong>{" "}
          {t("body")}{" "}
          <Link
            target="_blank"
            href="https://www.chayn.co/policies/privacy-policy"
            className="underline underline-offset-2 hover:text-red focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-1"
          >
            {t("privacyLink")}
          </Link>
        </p>
      )}
    </CookieConsent>
  );
}
