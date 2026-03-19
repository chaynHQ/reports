/**
 * Analytics event name constants.
 * Add new events here, then add their parameter shape to lib/analytics.types.ts > EventParamsMap.
 */
export const EVENTS = {
  // ── Engagement ───────────────────────────────────────────────────────────
  SECTION_VIEW: "section_view",
  SCROLL_DEPTH: "scroll_depth",
  PAGE_COMPLETE: "page_complete",

  // ── Interactions ─────────────────────────────────────────────────────────
  CTA_CLICK: "cta_click",
  EXTERNAL_LINK_CLICK: "external_link_click",

  // ── Localisation ─────────────────────────────────────────────────────────
  LANGUAGE_SWITCH: "language_switch",

  // ── Consent ──────────────────────────────────────────────────────────────
  COOKIE_CONSENT_ACCEPTED: "cookie_consent_accepted",
  COOKIE_CONSENT_DECLINED: "cookie_consent_declined",
  COOKIE_CONSENT_REVOKED: "cookie_consent_revoked",
} as const;
