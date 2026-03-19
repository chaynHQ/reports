import {
  ExternalLinkIcon,
  FacebookIcon,
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  XIcon,
  YouTubeIcon,
} from "@/components/icons";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import type { ReactNode } from "react";

const SOCIAL_LINKS = [
  {
    label: "Twitter / X",
    href: "https://twitter.com/ChaynHQ",
    icon: <XIcon />,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/chaynhq/",
    icon: <InstagramIcon />,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/chayn/",
    icon: <LinkedInIcon />,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/chayn",
    icon: <FacebookIcon />,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/channel/UC5_1Ci2SWVjmbeH8_USm-Bg",
    icon: <YouTubeIcon />,
  },
  { label: "GitHub", href: "https://github.com/chaynhq", icon: <GitHubIcon /> },
] as const;

type FooterLink = { label: string; href: string };

const logoLinkStyles =
  "inline-block rounded focus-visible:outline-none focus-visible:ring-2 " +
  "focus-visible:ring-red focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const linkStyles =
  "text-sm text-foreground/80 transition-colors hover:text-foreground focus-visible:rounded focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-1 focus-visible:ring-offset-background";

const headingStyles =
  "mb-4 text-sm font-semibold tracking-widest text-foreground/80";

const headingLinkStyles =
  "inline-flex items-center gap-1.5 transition-colors hover:text-foreground/80 " +
  "focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-1 focus-visible:ring-offset-background";

const socialIconStyles =
  "flex h-11 w-11 items-center justify-center rounded-full border border-foreground/25 text-foreground/60 " +
  "transition-colors hover:border-red hover:text-red focus-visible:outline-none focus-visible:ring-2 " +
  "focus-visible:ring-red focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:h-8 sm:w-8";

/** Column heading — optionally renders as a linked external heading. */
function ColHeading({
  children,
  href,
  newTabLabel,
}: {
  children: ReactNode;
  href?: string;
  newTabLabel?: string;
}) {
  if (href) {
    return (
      <h2 className={headingStyles}>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={
            newTabLabel ? `${String(children)} (${newTabLabel})` : undefined
          }
          className={headingLinkStyles}
        >
          {children}
          <ExternalLinkIcon />
        </a>
      </h2>
    );
  }
  return <h2 className={headingStyles}>{children}</h2>;
}

/** Reusable footer link column with an optional heading href. */
function LinkColumn({
  heading,
  headingHref,
  links,
  newTabLabel,
}: {
  heading: string;
  headingHref?: string;
  links: FooterLink[];
  newTabLabel: string;
}) {
  return (
    <div>
      <ColHeading href={headingHref} newTabLabel={headingHref ? newTabLabel : undefined}>
        {heading}
      </ColHeading>
      <ul className="flex flex-col gap-4">
        {links.map(({ label, href }) => {
          const isMailto = href.startsWith("mailto:");
          return (
            <li key={href}>
              <a
                href={href}
                target={isMailto ? undefined : "_blank"}
                rel={isMailto ? undefined : "noopener noreferrer"}
                aria-label={isMailto ? undefined : `${label} (${newTabLabel})`}
                className={linkStyles}
              >
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export async function Footer() {
  const t = await getTranslations("footer");

  const chaynCoLinks: FooterLink[] = [
    { label: t("chaynCoAbout"), href: "https://www.chayn.co/about" },
    { label: t("chaynCoDonate"), href: "https://www.paypal.com/paypalme/chaynhq" },
    { label: t("chaynCoCareers"), href: "https://chayn-cio.breezy.hr/" },
  ];

  const orgChaynCoLinks: FooterLink[] = [
    { label: t("orgChaynCoProjects"), href: "https://org.chayn.co/projects" },
    { label: t("orgChaynCoPartnerships"), href: "https://org.chayn.co/partnerships" },
    { label: t("orgChaynCoImpact"), href: "https://org.chayn.co/impact" },
  ];

  const legalLinks: FooterLink[] = [
    { label: t("legalPolicies"), href: "https://www.chayn.co/policies/privacy-policy" },
    { label: t("legalTrustCentre"), href: "https://app.eu.vanta.com/chayn.co/trust/yrbp5r3nj96a1dlq15h0y" },
    { label: t("legalContact"), href: "mailto:team@chayn.co" },
  ];

  const newTabLabel = t("opensInNewTab");

  return (
    <footer
      aria-label={t("ariaLabel")}
      className="border-t border-peach bg-white text-foreground"
    >
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10 lg:[grid-template-columns:1.5fr_1fr_1fr_1fr] lg:gap-x-6">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <a
              href="https://www.chayn.co"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("chaynHomepageLabel")}
              className={logoLinkStyles}
            >
              <Image
                src="/chayn_logo.png"
                alt="Chayn"
                width={140}
                height={48}
                className="h-10 w-auto"
              />
            </a>

            <p className="max-w-[240px] text-sm leading-relaxed text-foreground/80">
              {t("tagline")}
            </p>

            <p className="text-xs text-foreground/80">
              {t("charityRegistration")}
            </p>

            <div>
              <ColHeading>{t("followUs")}</ColHeading>
              <ul
                className="flex flex-wrap gap-2"
                aria-label={t("socialLinksLabel")}
              >
                {SOCIAL_LINKS.map(({ label, href, icon }) => (
                  <li key={href}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${label} (${newTabLabel})`}
                      className={socialIconStyles}
                    >
                      {icon}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <LinkColumn
            heading="chayn.co"
            headingHref="https://www.chayn.co"
            links={chaynCoLinks}
            newTabLabel={newTabLabel}
          />

          <LinkColumn
            heading="org.chayn.co"
            headingHref="https://org.chayn.co"
            links={orgChaynCoLinks}
            newTabLabel={newTabLabel}
          />

          <LinkColumn
            heading={t("legalColumn")}
            links={legalLinks}
            newTabLabel={newTabLabel}
          />
        </div>
      </div>
    </footer>
  );
}
