"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import CookieConsent, { resetCookieConsentValue } from "react-cookie-consent";

// ─── Shared constants ─────────────────────────────────────────────────────────
export const CONSENT_COOKIE_NAME = "chaynCookieConsent";
export const CONSENT_COOKIE_ACCEPTED = "accepted";
export const CONSENT_COOKIE_DECLINED = "declined";
/** Custom DOM event dispatched whenever the user accepts or declines. */
export const CONSENT_EVENT = "chayn:consent-change";

// ─── Utility exposed for a future "Cookie preferences" UI ────────────────────
/**
 * Clears the consent cookie and immediately notifies AnalyticsManager via
 * CONSENT_EVENT so GA4 and Vercel Analytics stop rendering in the current
 * session without requiring a page reload.
 *
 * Call this from a "Change cookie settings" link to satisfy GDPR Art. 7(3)
 * (withdrawal must be as easy as giving consent).
 *
 * NOTE: Hotjar has no JS unload method — a page reload is still required to
 * fully purge it after revocation. Callers should prompt the user to reload.
 */
export function clearConsent() {
  resetCookieConsentValue(CONSENT_COOKIE_NAME);
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * CookieBanner
 *
 * EU/UK GDPR-compliant cookie consent banner.
 *
 * Cookie behaviour:
 *   - Stored in `chaynCookieConsent`; value is "accepted" or "declined".
 *   - `path: "/"` ensures the cookie is read on every locale route (e.g. /hi).
 *   - `sameSite: "strict"` prevents cross-site cookie leakage.
 *   - Expires after 365 days; user can revoke at any time via clearConsent().
 *
 * Accessibility (WCAG 2.1 AA):
 *   - Banner container carries `role="region"` + `aria-label` via
 *     `customContainerAttributes` so screen readers identify it as a landmark.
 *   - Each button carries an explicit `aria-label` via ariaAcceptLabel /
 *     ariaDeclineLabel (rendered as aria-label on the <button> elements).
 *   - Styled with raw Tailwind 4 classes; no clsx / tailwind-merge.
 *
 * Cross-component communication:
 *   - Fires `chayn:consent-change` on `window` so AnalyticsManager reacts
 *     immediately in the same browsing session without a page reload.
 */
export function CookieBanner() {
  const t = useTranslations("cookieBanner");
  const dispatchConsentChange = () =>
    window.dispatchEvent(new Event(CONSENT_EVENT));

  return (
    <CookieConsent
      // ── Cookie ────────────────────────────────────────────────────────
      cookieName={CONSENT_COOKIE_NAME}
      cookieValue={CONSENT_COOKIE_ACCEPTED}
      declineCookieValue={CONSENT_COOKIE_DECLINED}
      expires={365}
      sameSite="strict"
      // path: "/" ensures the consent cookie is accessible on every route,
      // including /hi/* and future locale prefixes.
      extraCookieOptions={{ path: "/" }}
      // ── Behaviour ─────────────────────────────────────────────────────
      enableDeclineButton
      flipButtons
      onAccept={dispatchConsentChange}
      onDecline={dispatchConsentChange}
      // ── Labels (WCAG 2.1 SC 1.3.1 / 4.1.2) ──────────────────────────
      buttonText={t("acceptButton")}
      declineButtonText={t("declineButton")}
      ariaAcceptLabel={t("acceptAriaLabel")}
      ariaDeclineLabel={t("declineAriaLabel")}
      // ── Landmark role on the banner container ─────────────────────────
      // customContainerAttributes is forwarded directly to the root <div>,
      // giving assistive technologies a proper region landmark.
      customContainerAttributes={{
        role: "region",
        "aria-label": t("regionLabel"),
      }}
      // ── Styling ───────────────────────────────────────────────────────
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
