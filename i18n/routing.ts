import { defineRouting } from "next-intl/routing";

/**
 * Central routing definition consumed by middleware, navigation helpers,
 * and the request config. Add future locales here only — no other files
 * need updating.
 *
 * Text direction is maintained separately in lib/locale-dir.ts so that
 * layouts can set dir="rtl" without importing the full routing config on
 * every request.
 */
export const routing = defineRouting({
  /** All supported locales. First entry is the default. */
  locales: ["en", "hi"] as const,

  /** Default locale — UK English. */
  defaultLocale: "en",

  /**
   * Prefix strategy: 'as-needed' omits the locale prefix for the default
   * locale (`/` instead of `/en/`), giving cleaner canonical URLs.
   */
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
