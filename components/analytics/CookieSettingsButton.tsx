"use client";

import { CookieIcon } from "@/components/icons";
import Cookies from "js-cookie";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import {
  CONSENT_COOKIE_NAME,
  CONSENT_EVENT,
  OPEN_SETTINGS_EVENT,
} from "./CookieBanner";

const settingsButtonStyles =
  "fixed bottom-4 right-4 z-40 flex items-center gap-1.5 rounded-full bg-peach-tint px-3 py-2 " +
  "text-xs text-foreground/80 shadow-md ring-1 ring-peach transition-colors hover:bg-peach hover:text-foreground " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2";

export function CookieSettingsButton() {
  const t = useTranslations("cookieBanner");
  const [isVisible, setIsVisible] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  // Track whether the initial mount has completed so we only steal focus on
  // a genuine consent decision, not when the button appears on page load.
  const hasMounted = useRef(false);

  useEffect(() => {
    const syncVisibility = () =>
      setIsVisible(!!Cookies.get(CONSENT_COOKIE_NAME));
    // Hide immediately when the banner opens in update mode; re-evaluate after a choice is made.
    const hideOnSettingsOpen = () => setIsVisible(false);
    syncVisibility();
    window.addEventListener(CONSENT_EVENT, syncVisibility);
    window.addEventListener(OPEN_SETTINGS_EVENT, hideOnSettingsOpen);
    return () => {
      window.removeEventListener(CONSENT_EVENT, syncVisibility);
      window.removeEventListener(OPEN_SETTINGS_EVENT, hideOnSettingsOpen);
    };
  }, []);

  // Move focus to this button when it appears after a consent decision so
  // keyboard users are not stranded when the cookie banner dismisses.
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    if (isVisible) {
      buttonRef.current?.focus();
    }
  }, [isVisible]);

  const handleClick = () => {
    const currentConsent = Cookies.get(CONSENT_COOKIE_NAME);
    window.dispatchEvent(
      new CustomEvent(OPEN_SETTINGS_EVENT, {
        detail: { currentConsent },
      }),
    );
  };

  if (!isVisible) return null;

  const settingsButtonLabel = t("settingsButtonLabel");

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      aria-label={settingsButtonLabel}
      className={settingsButtonStyles}
    >
      <CookieIcon />
      <span>{settingsButtonLabel}</span>
    </button>
  );
}
