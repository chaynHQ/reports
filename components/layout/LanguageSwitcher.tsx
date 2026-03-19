"use client";

import { ChevronDownIcon, GlobeIcon } from "@/components/icons";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

const triggerStyles =
  "inline-flex h-9 items-center gap-1.5 rounded-full px-2 text-sm font-semibold text-foreground " +
  "transition-colors hover:bg-peach aria-expanded:bg-peach " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red " +
  "focus-visible:ring-offset-2 focus-visible:ring-offset-peach-tint";

const menuStyles =
  "absolute right-0 top-full mt-2 w-44 overflow-hidden rounded-2xl bg-cream p-1.5 " +
  "shadow-[0_8px_32px_rgba(0,0,0,0.12)] ring-1 ring-foreground/[0.06]";

const menuItemBaseStyles =
  "group flex w-full items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium " +
  "transition-all duration-150 hover:bg-peach/25 hover:text-foreground " +
  "focus-visible:bg-peach/25 focus-visible:text-foreground focus-visible:outline-none motion-reduce:transition-none";

const menuItemBadgeBaseStyles =
  "inline-flex h-5 w-7 shrink-0 items-center justify-center rounded text-xs font-bold uppercase";

/** Display name for each locale — intentionally not translated (language names are self-identifying). */
const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  hi: "Hindi",
};

const LOCALE_SHORT: Record<Locale, string> = {
  en: "EN",
  hi: "HI",
};

interface LanguageSwitcherProps {
  labels: { changeLanguage: string; languageMenu: string };
}

export function LanguageSwitcher({ labels }: LanguageSwitcherProps) {
  const params = useParams();
  const locale = ((params?.locale as Locale) ??
    routing.defaultLocale) as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuId = `language-menu-${useId().replace(/:/g, "")}`;

  const switchLocale = (next: Locale) => {
    if (next === locale) return;
    router.replace(pathname, { locale: next });
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) return;

    const firstItem = menuRef.current?.querySelector<HTMLButtonElement>(
      '[role="menuitemradio"]',
    );
    const timerId = setTimeout(() => firstItem?.focus(), 0);

    const handlePointerDown = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      clearTimeout(timerId);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLButtonElement>(
        '[role="menuitemradio"]',
      ) ?? [],
    );
    if (!items.length) return;
    const idx = items.indexOf(document.activeElement as HTMLButtonElement);

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        items[(idx + 1) % items.length].focus();
        break;
      case "ArrowUp":
        e.preventDefault();
        items[(idx - 1 + items.length) % items.length].focus();
        break;
      case "Home":
        e.preventDefault();
        items[0].focus();
        break;
      case "End":
        e.preventDefault();
        items[items.length - 1].focus();
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
        break;
      case "Tab":
        setIsOpen(false);
        break;
    }
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-label={`${labels.changeLanguage}: ${LOCALE_NAMES[locale]}`}
        className={triggerStyles}
      >
        <GlobeIcon width={14} height={14} className="text-red" />
        <span className="uppercase">{LOCALE_SHORT[locale]}</span>
        <ChevronDownIcon
          width={12}
          height={12}
          className={`shrink-0 transition-transform duration-200 motion-reduce:transition-none ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Kept in DOM so aria-controls always resolves. */}
      <ul
        id={menuId}
        role="menu"
        aria-label={labels.languageMenu}
        onKeyDown={handleKeyDown}
        hidden={!isOpen}
        className={menuStyles}
      >
        {routing.locales.map((loc) => (
          <li key={loc} role="none">
            <button
              type="button"
              role="menuitemradio"
              aria-checked={loc === locale}
              tabIndex={-1}
              onClick={() => switchLocale(loc)}
              className={`${menuItemBaseStyles} ${loc === locale ? "text-foreground" : "text-foreground/80"}`}
            >
              <span
                className={`${menuItemBadgeBaseStyles} ${loc === locale ? "bg-red/10 text-red" : "text-foreground/80 group-hover:text-foreground/80"}`}
              >
                {LOCALE_SHORT[loc]}
              </span>
              {LOCALE_NAMES[loc]}
              {loc === locale && (
                <span
                  className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-red"
                  aria-hidden="true"
                />
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
