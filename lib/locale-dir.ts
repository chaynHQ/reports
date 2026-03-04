import type { Locale } from '@/i18n/routing';

/**
 * Maps each supported locale to its writing direction.
 *
 * Both current locales are LTR; the architecture explicitly supports RTL
 * so future locales (e.g. Arabic, Farsi, Hebrew) can be added here without
 * touching the layout.
 */
const LOCALE_DIRECTIONS: Record<Locale, 'ltr' | 'rtl'> = {
  en: 'ltr',
  hi: 'ltr',
  // Example future RTL entry:
  // ar: 'rtl',
};

export function getLocaleDirection(locale: Locale): 'ltr' | 'rtl' {
  return LOCALE_DIRECTIONS[locale] ?? 'ltr';
}
