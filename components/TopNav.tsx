import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { NavScrollShell, type NavItem } from "./NavScrollShell";

const logoLinkStyles =
  "flex items-center gap-3 rounded focus-visible:outline-none focus-visible:ring-2 " +
  "focus-visible:ring-red focus-visible:ring-offset-2 focus-visible:ring-offset-peach-tint";

/** Server Component — logo renders into SSR HTML; nav behaviour is client-side. */
export async function TopNav() {
  const t = await getTranslations("nav");

  // Built inside the function so translated labels are available.
  // Report item labels are proper nouns (product names) and remain in English.
  // Add NavLinkItem or NavDropdownItem entries here to extend the nav.
  const navItems: NavItem[] = [
    {
      type: "dropdown",
      id: "reports-menu",
      label: t("reportsLabel"),
      menuLabel: t("reportsMenuLabel"),
      items: [
        { href: "/reports/impact-2024", label: "Impact Report 2024" },
        { href: "/reports/impact-2023", label: "Impact Report 2023" },
        { href: "/reports/bloom-insights", label: "Bloom Insights" },
        { href: "/reports/survivor-stories", label: "Survivor Stories" },
      ],
    },
  ];

  return (
    <NavScrollShell
      navItems={navItems}
      cta={{
        href: "https://www.chayn.co",
        label: t("goToChayn"),
        ariaLabel: t("goToChaynLabel"),
      }}
      labels={{
        header: t("headerLabel"),
        nav: t("primaryNav"),
        openMenu: t("openMenu"),
        closeMenu: t("closeMenu"),
      }}
    >
      <Link
        href="/"
        aria-label={t("logoLabel")}
        className={logoLinkStyles}
      >
        <Image
          src="/chayn_logo.png"
          alt="Chayn"
          width={140}
          height={48}
          className="h-10 w-auto"
          priority
        />
        {/* Divider + label give this sub-site its own identity within the Chayn brand */}
        <span
          aria-hidden="true"
          className="hidden h-6 w-px bg-foreground/20 sm:block"
        />
        <span className="hidden text-base font-semibold text-foreground/70 sm:inline">
          {t("reportsSiteLabel")}
        </span>
      </Link>
    </NavScrollShell>
  );
}
