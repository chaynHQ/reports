"use client";

import { ArrowRightIcon, ChevronDownIcon } from "@/components/icons";
import { Link } from "@/i18n/navigation";
import { useEffect, useRef, useState } from "react";

const triggerStyles =
  "inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-foreground " +
  "transition-colors hover:bg-peach aria-expanded:bg-peach " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2 focus-visible:ring-offset-peach-tint";

const menuStyles =
  "absolute right-0 top-full mt-2 w-64 overflow-y-auto rounded-2xl bg-cream p-1.5 " +
  "shadow-[0_8px_32px_rgba(0,0,0,0.12)] ring-1 ring-foreground/[0.06] [max-height:min(70vh,22rem)]";

const menuItemStyles =
  "group flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium text-foreground/80 " +
  "transition-all duration-150 hover:bg-peach/25 hover:text-foreground " +
  "focus-visible:bg-peach/25 focus-visible:text-foreground focus-visible:outline-none motion-reduce:transition-none";

const menuItemArrowStyles =
  "shrink-0 -translate-x-1 text-red opacity-0 transition-all duration-150 " +
  "group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 motion-reduce:transition-none";

interface NavDropdownProps {
  id: string;
  label: string;
  menuLabel: string;
  items: { href: string; label: string }[];
}

/**
 * Desktop nav dropdown. Keyboard pattern: APG §3.15 Menu Button.
 * Arrow keys navigate items; Escape closes and returns focus to the trigger.
 */
export function NavDropdown({ id, label, menuLabel, items }: NavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Defer focus until painted.
    const firstMenuItem =
      menuRef.current?.querySelector<HTMLAnchorElement>('[role="menuitem"]');
    const focusTimerId = setTimeout(() => firstMenuItem?.focus(), 0);

    const handleOutsidePointerDown = (e: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("pointerdown", handleOutsidePointerDown);

    return () => {
      clearTimeout(focusTimerId);
      document.removeEventListener("pointerdown", handleOutsidePointerDown);
    };
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
    const menuItems = Array.from(
      menuRef.current?.querySelectorAll<HTMLAnchorElement>(
        '[role="menuitem"]',
      ) ?? [],
    );
    if (!menuItems.length) return;
    const activeItemIndex = menuItems.indexOf(
      document.activeElement as HTMLAnchorElement,
    );

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        menuItems[(activeItemIndex + 1) % menuItems.length].focus();
        break;
      case "ArrowUp":
        e.preventDefault();
        menuItems[
          (activeItemIndex - 1 + menuItems.length) % menuItems.length
        ].focus();
        break;
      case "Home":
        e.preventDefault();
        menuItems[0].focus();
        break;
      case "End":
        e.preventDefault();
        menuItems[menuItems.length - 1].focus();
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
        break;
      case "Tab":
        setIsOpen(false); // allow focus to move out naturally
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
        aria-controls={id}
        className={triggerStyles}
      >
        {label}
        <ChevronDownIcon
          width={12}
          height={12}
          className={`shrink-0 transition-transform duration-200 motion-reduce:transition-none ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Kept in DOM so aria-controls always resolves.
          `hidden` removes it from the accessibility tree when closed. */}
      <ul
        id={id}
        role="menu"
        aria-label={menuLabel}
        onKeyDown={handleKeyDown}
        hidden={!isOpen}
        className={menuStyles}
      >
        {items.map(({ href, label: itemLabel }) => (
          <li key={href} role="none">
            <Link
              href={href}
              role="menuitem"
              tabIndex={-1}
              className={menuItemStyles}
            >
              <span className="relative">{itemLabel}</span>
              <ArrowRightIcon className={menuItemArrowStyles} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
