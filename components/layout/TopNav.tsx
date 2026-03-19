import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { NavBar, type NavItem } from "./NavBar";

const logoLinkStyles =
  "flex items-center gap-3 rounded focus-visible:outline-none focus-visible:ring-2 " +
  "focus-visible:ring-red focus-visible:ring-offset-2 focus-visible:ring-offset-peach-tint";

/** Server Component — logo renders into SSR HTML; nav behaviour is client-side. */
export async function TopNav() {
  const t = await getTranslations("nav");

  // Add NavLinkItem or NavDropdownItem entries here to extend the nav.
  // Example NavLinkItem:   { type: "link", href: "/about", label: "About" }
  // Example NavDropdownItem:
  //   { type: "dropdown", id: "sections-menu", label: "Sections", menuLabel: "Site sections",
  //     items: [{ href: "/sections/intro", label: "Introduction" }] }
  const navItems: NavItem[] = [];

  return (
    <NavBar
      navItems={navItems}
      cta={{
        href: "https://www.chayn.co",
        label: t("ctaLabel"),
        ariaLabel: t("ctaAriaLabel"),
      }}
      labels={{
        header: t("headerLabel"),
        nav: t("primaryNav"),
        openMenu: t("openMenu"),
        closeMenu: t("closeMenu"),
      }}
    >
      {/* Replace this text logo with your own <Image> once you have a logo asset. */}
      <Link href="/" aria-label={t("logoLabel")} className={logoLinkStyles}>
        <span className="text-lg font-bold tracking-tight text-foreground">
          {t("siteName")}
        </span>
      </Link>
    </NavBar>
  );
}
