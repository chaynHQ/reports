"use client";

import Cookies from "js-cookie";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import {
  CONSENT_COOKIE_NAME,
  CONSENT_EVENT,
  OPEN_SETTINGS_EVENT,
} from "./CookieBanner";

export function CookieSettingsButton() {
  const t = useTranslations("cookieBanner");
  const [visible, setVisible] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  // Track whether the initial mount has completed so we only steal focus on
  // a genuine consent decision, not when the button appears on page load.
  const isMounted = useRef(false);

  useEffect(() => {
    const update = () => setVisible(!!Cookies.get(CONSENT_COOKIE_NAME));
    // Hide immediately when the banner opens in update mode; re-evaluate after a choice is made.
    const hide = () => setVisible(false);
    update();
    window.addEventListener(CONSENT_EVENT, update);
    window.addEventListener(OPEN_SETTINGS_EVENT, hide);
    return () => {
      window.removeEventListener(CONSENT_EVENT, update);
      window.removeEventListener(OPEN_SETTINGS_EVENT, hide);
    };
  }, []);

  // Move focus to this button when it appears after a consent decision so
  // keyboard users are not stranded when the cookie banner dismisses.
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    if (visible) {
      buttonRef.current?.focus();
    }
  }, [visible]);

  const handleClick = () => {
    const currentConsent = Cookies.get(CONSENT_COOKIE_NAME);
    window.dispatchEvent(
      new CustomEvent(OPEN_SETTINGS_EVENT, {
        detail: { currentConsent },
      }),
    );
  };

  if (!visible) return null;

  const label = t("settingsButtonLabel");

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      aria-label={label}
      className="fixed bottom-4 right-4 z-40 flex items-center gap-1.5 rounded-full bg-peach-tint px-3 py-2 text-xs text-foreground/60 shadow-md ring-1 ring-peach transition-colors hover:bg-peach hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2"
    >
      <CookieIcon />
      <span>{label}</span>
    </button>
  );
}

function CookieIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
      <path d="M8.5 8.5v.01" />
      <path d="M16 15.5v.01" />
      <path d="M12 12v.01" />
    </svg>
  );
}
