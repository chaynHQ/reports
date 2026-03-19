"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useAppStore } from "@/lib/store/useAppStore";
import {
  hasCookieConsent,
  readA11yPrefs,
  writeA11yPrefs,
} from "@/lib/accessibility-prefs";

// ── Icons ─────────────────────────────────────────────────────────────────────

function IconAccessibility() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="5" r="1.5" />
      <path d="M6 9h12M12 9v11M9 21l3-5 3 5" />
      <path d="M7 14c0 0 1 1 5 1s5-1 5-1" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function IconMotion() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function IconAudioOn() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

function IconAudioOff() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}

function IconContrast() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v18M12 3a9 9 0 0 1 0 18" fill="currentColor" stroke="none" />
    </svg>
  );
}

// ── Toggle switch ─────────────────────────────────────────────────────────────

const trackOffStyles =
  "relative inline-flex h-6 w-10 flex-shrink-0 items-center rounded-full transition-colors duration-200 bg-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2";
const trackOnStyles =
  "relative inline-flex h-6 w-10 flex-shrink-0 items-center rounded-full transition-colors duration-200 bg-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2";
const thumbOffStyles =
  "inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 translate-x-1";
const thumbOnStyles =
  "inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 translate-x-5";

interface ToggleProps {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}

function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={checked ? trackOnStyles : trackOffStyles}
    >
      <span className="sr-only">{label}</span>
      <span className={checked ? thumbOnStyles : thumbOffStyles} />
    </button>
  );
}

// ── Setting row ───────────────────────────────────────────────────────────────

const rowStyles = "flex items-center justify-between gap-4 py-2";
const rowLabelStyles = "flex items-center gap-2.5 text-sm text-foreground";
const rowDescStyles = "text-xs text-foreground/60 mt-0.5";

interface SettingRowProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

function SettingRow({ icon, label, description, checked, onChange }: SettingRowProps) {
  return (
    <div className={rowStyles}>
      <div>
        <p className={rowLabelStyles}>
          {icon}
          {label}
        </p>
        <p className={rowDescStyles}>{description}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} label={label} />
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

// Panel card opens upward, anchored to the right edge of the trigger row.
const panelStyles =
  "absolute bottom-full mb-2 right-0 w-72 rounded-2xl border border-peach bg-background shadow-lg overflow-hidden";
const panelHeaderStyles =
  "flex items-center justify-between px-4 py-3 border-b border-foreground/8";
const panelTitleStyles = "font-serif text-sm font-semibold text-foreground";
const panelBodyStyles = "px-4 py-1 divide-y divide-foreground/6";
const panelFooterStyles =
  "px-4 py-2.5 bg-foreground/4 text-xs text-foreground/60 flex items-center gap-1.5";

// Shared utility pill — uses brand peach-tint/peach tokens, intentionally
// lighter than a CTA so these controls read as chrome, not actions.
const utilityPillStyles =
  "inline-flex items-center gap-1.5 rounded-full bg-peach-tint px-3 py-2 " +
  "text-xs text-foreground/80 shadow-sm ring-1 ring-peach transition-colors " +
  "hover:bg-peach hover:text-foreground " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2";

// Mute button when audio is live — icon/text shift to red so users can see
// at a glance that audio is active. Same shape and weight as the base pill.
const muteLivePillStyles =
  "inline-flex items-center gap-1.5 rounded-full bg-peach-tint px-3 py-2 " +
  "text-xs text-red shadow-sm ring-1 ring-peach transition-colors " +
  "hover:bg-peach hover:text-foreground " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2";

// ── Main component ────────────────────────────────────────────────────────────

export function AccessibilityPanel() {
  const t = useTranslations("accessibility");

  const reduceMotion = useAppStore((s) => s.reduceMotion);
  const highContrast = useAppStore((s) => s.highContrast);
  const isAudioMuted = useAppStore((s) => s.isAudioMuted);
  const setReduceMotion = useAppStore((s) => s.setReduceMotion);
  const setHighContrast = useAppStore((s) => s.setHighContrast);
  const setIsAudioMuted = useAppStore((s) => s.setIsAudioMuted);

  const [isOpen, setIsOpen] = useState(false);
  const [canSave, setCanSave] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // On mount: restore prefs from cookie (if consent given), else use OS pref
  useEffect(() => {
    const consent = hasCookieConsent();
    setCanSave(consent);

    if (consent) {
      const saved = readA11yPrefs();
      if (saved.reduceMotion !== undefined) setReduceMotion(saved.reduceMotion);
      if (saved.muteAudio !== undefined) setIsAudioMuted(saved.muteAudio);
      if (saved.highContrast !== undefined) setHighContrast(saved.highContrast);
    }

    // Re-evaluate save capability when the user makes a consent decision
    const handler = () => setCanSave(hasCookieConsent());
    window.addEventListener("chayn:consent-change", handler);
    return () => window.removeEventListener("chayn:consent-change", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply high contrast attribute to root element
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-high-contrast",
      highContrast ? "true" : "false"
    );
  }, [highContrast]);

  // Persist preferences whenever they change (no-op if consent not given)
  useEffect(() => {
    writeA11yPrefs({ reduceMotion, muteAudio: isAudioMuted, highContrast });
  }, [reduceMotion, isAudioMuted, highContrast]);

  // Move focus into panel on open; return it to trigger on close
  useEffect(() => {
    if (isOpen) {
      const first = panelRef.current?.querySelector<HTMLElement>(
        "button, [href], input, [tabindex]:not([tabindex='-1'])"
      );
      first?.focus();
    } else {
      triggerRef.current?.focus();
    }
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        !triggerRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") setIsOpen(false);
  };

  const muteLabel = isAudioMuted ? t("unmuteAudioLabel") : t("muteAudioLabel");

  return (
    // No fixed positioning here — the parent container in ClientProviders owns that.
    <div className="relative" onKeyDown={handleKeyDown}>
      {/* Settings panel — opens upward, anchored to the right of the trigger row */}
      {isOpen && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label={t("panelTitle")}
          aria-modal="false"
          className={panelStyles}
        >
          <div className={panelHeaderStyles}>
            <h2 className={panelTitleStyles}>{t("panelTitle")}</h2>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label={t("closePanel")}
              className="text-foreground/60 hover:text-foreground transition-colors rounded p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red"
            >
              <IconClose />
            </button>
          </div>

          <div className={panelBodyStyles}>
            <SettingRow
              icon={<IconMotion />}
              label={t("reduceMotion")}
              description={t("reduceMotionDesc")}
              checked={reduceMotion}
              onChange={setReduceMotion}
            />
            <SettingRow
              icon={<IconAudioOn />}
              label={t("muteAudio")}
              description={t("muteAudioDesc")}
              checked={isAudioMuted}
              onChange={setIsAudioMuted}
            />
            <SettingRow
              icon={<IconContrast />}
              label={t("highContrast")}
              description={t("highContrastDesc")}
              checked={highContrast}
              onChange={setHighContrast}
            />
          </div>

          <p className={panelFooterStyles}>
            <span aria-hidden="true">{canSave ? "✓" : "ⓘ"}</span>
            {canSave ? t("prefsSaved") : t("prefsNotSaved")}
          </p>
        </div>
      )}

      {/* Trigger row: quick-mute button + accessibility panel button */}
      <div className="flex items-center gap-2">
        {/*
         * Quick mute — always one tap away without opening the panel.
         * Uses a distinct peach-tint style when audio is active so the
         * current state is visible at a glance.
         */}
        <button
          type="button"
          onClick={() => setIsAudioMuted(!isAudioMuted)}
          aria-label={muteLabel}
          aria-pressed={isAudioMuted}
          className={isAudioMuted ? utilityPillStyles : muteLivePillStyles}
        >
          {isAudioMuted ? <IconAudioOff /> : <IconAudioOn />}
        </button>

        {/* Accessibility settings panel trigger */}
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          aria-label={t("openPanel")}
          className={utilityPillStyles}
        >
          <IconAccessibility />
          <span className="hidden sm:inline" aria-hidden="true">
            {t("openPanel")}
          </span>
        </button>
      </div>
    </div>
  );
}
