const PREFS_COOKIE = "chaynA11yPrefs";
const CONSENT_COOKIE = "chaynCookieConsent";

export interface A11yPrefs {
  reduceMotion?: boolean;
  muteAudio?: boolean;
  highContrast?: boolean;
}

const parseCookieValue = (name: string): string | null => {
  const match = document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
};

export const hasCookieConsent = (): boolean => {
  if (typeof document === "undefined") return false;
  return parseCookieValue(CONSENT_COOKIE) === "accepted";
};

export const readA11yPrefs = (): A11yPrefs => {
  if (typeof document === "undefined") return {};
  const raw = parseCookieValue(PREFS_COOKIE);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as A11yPrefs;
  } catch {
    return {};
  }
};

export const writeA11yPrefs = (prefs: A11yPrefs): void => {
  if (!hasCookieConsent()) return;
  document.cookie = `${PREFS_COOKIE}=${encodeURIComponent(JSON.stringify(prefs))};path=/;max-age=31536000;SameSite=Lax`;
};
