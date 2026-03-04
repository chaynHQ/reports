"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import CookieConsent, { resetCookieConsentValue } from "react-cookie-consent";
import { trackEvent } from "@/lib/analytics";
import { EVENTS } from "@/constants/events";

export const CONSENT_COOKIE_NAME = "chaynCookieConsent";
export const CONSENT_COOKIE_ACCEPTED = "accepted";
export const CONSENT_COOKIE_DECLINED = "declined";
/** Dispatched on window whenever consent is accepted, declined, or revoked. */
export const CONSENT_EVENT = "chayn:consent-change";

/**
 * Clears consent and notifies AnalyticsManager to stop rendering tracking scripts.
 * Call from a "Change cookie settings" link (GDPR Art. 7(3)).
 * NOTE: Hotjar has no JS unload method — prompt the user to reload after calling this.
 */
export function clearConsent() {
  trackEvent(EVENTS.COOKIE_CONSENT_REVOKED, {}); // fire while analytics are still active
  resetCookieConsentValue(CONSENT_COOKIE_NAME);
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

// TODO (A11y): Verify banner focus management with a screen reader — confirm focus
// moves to the banner on first render and returns sensibly after a choice is made.
export function CookieBanner() {
  const t = useTranslations("cookieBanner");

  const handleAccept = () => {
    // GA4 loads after this fires, so accept is captured by Vercel Analytics only.
    trackEvent(EVENTS.COOKIE_CONSENT_ACCEPTED, {});
    window.dispatchEvent(new Event(CONSENT_EVENT));
  };

  const handleDecline = () => {
    // No provider loads for declined users — correct GDPR behaviour.
    trackEvent(EVENTS.COOKIE_CONSENT_DECLINED, {});
    window.dispatchEvent(new Event(CONSENT_EVENT));
  };

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
      onAccept={handleAccept}
      onDecline={handleDecline}
      buttonText={t("acceptButton")}
      declineButtonText={t("declineButton")}
      ariaAcceptLabel={t("acceptAriaLabel")}
      ariaDeclineLabel={t("declineAriaLabel")}
      customContainerAttributes={{ role: "region", "aria-label": t("regionLabel") }}
      disableStyles
      containerClasses="fixed bottom-0 left-0 right-0 z-50 flex flex-col gap-4 border-t border-neutral-700 bg-neutral-900 px-6 py-5 text-white shadow-2xl sm:flex-row sm:items-center"
      contentClasses="flex-1 text-sm leading-relaxed text-neutral-200"
      buttonWrapperClasses="flex shrink-0 gap-3"
      buttonClasses="rounded-md bg-rose-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      declineButtonClasses="rounded-md border border-neutral-500 px-5 py-2 text-sm font-semibold text-neutral-300 transition-colors hover:border-neutral-300 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      <p>
        <strong className="font-semibold text-white">{t("heading")}</strong>{" "}
        {t("body")}{" "}
        <Link
          target="_blank"
          href="https://www.chayn.co/policies/privacy-policy"
          className="underline underline-offset-2 hover:text-rose-300 focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {t("privacyLink")}
        </Link>
      </p>
    </CookieConsent>
  );
}
