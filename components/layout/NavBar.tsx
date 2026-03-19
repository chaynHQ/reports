"use client";

import { ChevronDownIcon, MenuToggleIcon } from "@/components/icons";
import { Link } from "@/i18n/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { NavDropdown } from "./NavDropdown";

export type NavLinkItem = { type: "link"; href: string; label: string };
export type NavDropdownItem = {
  type: "dropdown";
  id: string; // used for aria-controls and the menu ul id
  label: string;
  menuLabel: string;
  items: { href: string; label: string }[];
};
export type NavItem = NavLinkItem | NavDropdownItem;

const navLinkStyles =
  "relative inline-flex min-h-[44px] items-center gap-1.5 px-1 text-sm font-medium text-foreground " +
  "after:absolute after:bottom-0.75 after:left-0 after:h-[5px] after:w-0 after:rounded-full after:bg-peach " +
  "after:transition-all after:duration-200 after:content-[''] motion-reduce:after:transition-none " +
  "hover:after:w-full " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2 focus-visible:ring-offset-peach-tint";

const ctaStyles =
  "inline-flex h-9 items-center justify-center rounded-full bg-red px-5 text-sm font-semibold text-cream " +
  "transition-colors hover:bg-red/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red " +
  "focus-visible:ring-offset-2 focus-visible:ring-offset-peach-tint";

const mobileItemStyles =
  "flex w-full min-h-[44px] items-center rounded-lg px-3 text-sm font-medium text-foreground " +
  "transition-colors hover:bg-peach/25 focus-visible:bg-peach/25 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red";

const mobileSubItemStyles =
  "flex w-full min-h-[44px] items-center gap-2.5 rounded-lg pl-5 pr-3 text-sm font-medium text-foreground/65 " +
  "transition-colors hover:bg-peach/25 hover:text-foreground focus-visible:bg-peach/25 focus-visible:text-foreground " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red";

const hamburgerStyles =
  "inline-flex h-11 w-11 items-center justify-center rounded-lg text-foreground " +
  "transition-colors hover:bg-peach focus-visible:outline-none focus-visible:ring-2 " +
  "focus-visible:ring-red focus-visible:ring-offset-2 focus-visible:ring-offset-peach-tint";

interface NavBarProps {
  children: ReactNode;
  /** Plain serialisable data — safe to pass across the RSC/client boundary. */
  navItems: NavItem[];
  cta: { href: string; label: string; ariaLabel: string };
  labels: { header: string; nav: string; openMenu: string; closeMenu: string };
}

/**
 * Client component — owns scroll-hide/reveal and mobile menu state.
 * Renders the full <header> and <nav> layout for desktop and mobile.
 * Receives the logo as children from the TopNav Server Component.
 */
export function NavBar({ children, navItems, cta, labels }: NavBarProps) {
  const [isNavHidden, setIsNavHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedMobileSections, setExpandedMobileSections] = useState<
    Set<string>
  >(() => {
    const dropdowns = navItems.filter((item) => item.type === "dropdown");
    return dropdowns.length === 1 ? new Set([dropdowns[0].id]) : new Set();
  });
  const lastScrollY = useRef(0);
  const prefersReducedMotion = useRef(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  const toggleMobileSection = (id: string) => {
    setExpandedMobileSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReducedMotion.current = motionQuery.matches;
    const handleMotionChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion.current = e.matches;
      if (e.matches) setIsNavHidden(false);
    };
    motionQuery.addEventListener("change", handleMotionChange);

    const handleScroll = () => {
      const currentY = window.scrollY;
      setIsScrolled(currentY > 8);

      if (!prefersReducedMotion.current) {
        if (currentY < 80) {
          setIsNavHidden(false);
        } else if (currentY > lastScrollY.current) {
          setIsNavHidden(true);
          setIsMobileMenuOpen(false);
        } else {
          setIsNavHidden(false);
        }
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      motionQuery.removeEventListener("change", handleMotionChange);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const handleMobileMenuKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
        hamburgerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleMobileMenuKeyDown);
    return () =>
      document.removeEventListener("keydown", handleMobileMenuKeyDown);
  }, [isMobileMenuOpen]);

  return (
    <header
      aria-label={labels.header}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-in-out motion-reduce:transition-none ${
        isNavHidden
          ? "pointer-events-none -translate-y-3 opacity-0 focus-within:pointer-events-auto focus-within:translate-y-0 focus-within:opacity-100"
          : "translate-y-0 opacity-100"
      } ${
        isScrolled || isMobileMenuOpen
          ? "bg-peach-tint shadow-[0_2px_16px_rgba(255,234,225,0.8)]"
          : "bg-peach-tint/90 backdrop-blur-sm"
      }`}
    >
      <nav
        aria-label={labels.nav}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="flex h-[72px] items-center justify-between">
          {children}

          {/* Desktop nav */}
          <div className="hidden items-center gap-2 sm:flex sm:gap-3">
            {navItems.map((item) =>
              item.type === "link" ? (
                <Link
                  key={item.href}
                  href={item.href}
                  className={navLinkStyles}
                >
                  {item.label}
                </Link>
              ) : (
                <NavDropdown key={item.id} {...item} />
              ),
            )}
            {navItems.length > 0 && (
              <span aria-hidden="true" className="h-4 w-px bg-foreground/15" />
            )}
            <a
              href={cta.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={cta.ariaLabel}
              className={ctaStyles}
            >
              {cta.label}
            </a>
          </div>

          {/* Mobile: CTA + hamburger */}
          <div className="flex items-center gap-2 sm:hidden">
            <a
              href={cta.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={cta.ariaLabel}
              className={ctaStyles}
            >
              {cta.label}
            </a>
            <button
              ref={hamburgerRef}
              type="button"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? labels.closeMenu : labels.openMenu}
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className={hamburgerStyles}
            >
              <MenuToggleIcon isOpen={isMobileMenuOpen} />
            </button>
          </div>
        </div>

        {/* Mobile menu — kept in DOM so aria-controls="mobile-menu" always resolves.
            `hidden` removes it from the accessibility tree and keyboard flow when closed. */}
        <div
          id="mobile-menu"
          hidden={!isMobileMenuOpen}
          className="border-t border-foreground/[0.06] pb-3 sm:hidden"
        >
          <ul role="list" className="flex flex-col pt-2">
            {navItems.map((item) => {
              if (item.type === "link") {
                return (
                  <li key={item.href}>
                    <Link href={item.href} className={mobileItemStyles}>
                      {item.label}
                    </Link>
                  </li>
                );
              }

              const isSectionExpanded = expandedMobileSections.has(item.id);
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    aria-expanded={isSectionExpanded}
                    aria-controls={`mobile-${item.id}`}
                    onClick={() => toggleMobileSection(item.id)}
                    className={`${mobileItemStyles} justify-between`}
                  >
                    {item.label}
                    <ChevronDownIcon
                      width={14}
                      height={14}
                      className={`shrink-0 transition-transform duration-200 motion-reduce:transition-none ${isSectionExpanded ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Sub-items — kept in DOM so aria-controls always resolves. */}
                  <ul
                    id={`mobile-${item.id}`}
                    role="list"
                    hidden={!isSectionExpanded}
                    className="mb-1 ml-2 flex flex-col"
                  >
                    {item.items.map(({ href, label }) => (
                      <li key={href}>
                        <Link href={href} className={mobileSubItemStyles}>
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </header>
  );
}
