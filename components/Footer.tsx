import { getTranslations } from "next-intl/server";
import Image from "next/image";

import {
  ExternalLinkIcon,
  FacebookIcon,
  GitHubIcon,
  InstagramIcon,
  LinkedInIcon,
  XIcon,
  YouTubeIcon,
} from "@/components/icons";

const SOCIAL_LINKS = [
  { label: "Twitter / X", href: "https://twitter.com/ChaynHQ", icon: <XIcon /> },
  { label: "Instagram", href: "https://www.instagram.com/chaynhq/", icon: <InstagramIcon /> },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/chayn/", icon: <LinkedInIcon /> },
  { label: "Facebook", href: "https://www.facebook.com/chayn", icon: <FacebookIcon /> },
  {
    label: "YouTube",
    href: "https://www.youtube.com/channel/UC5_1Ci2SWVjmbeH8_USm-Bg",
    icon: <YouTubeIcon />,
  },
  { label: "GitHub", href: "https://github.com/chaynhq", icon: <GitHubIcon /> },
] as const;

const logoLinkStyles =
  "inline-block rounded focus-visible:outline-none focus-visible:ring-2 " +
  "focus-visible:ring-red focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const bottomLinkStyles =
  "text-xs text-foreground/50 transition-colors hover:text-foreground focus-visible:rounded " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-1 focus-visible:ring-offset-background";

const linkStyles =
  "text-sm text-foreground/75 transition-colors hover:text-foreground focus-visible:rounded focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-1 focus-visible:ring-offset-background";

const headingStyles =
  "mb-4 text-sm font-semibold tracking-widest text-foreground/50";

const headingLinkStyles =
  "inline-flex items-center gap-1.5 transition-colors hover:text-foreground/75 " +
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
  children: React.ReactNode;
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

export async function Footer() {
  const t = await getTranslations("footer");
  const year = new Date().getFullYear();

  const chaynCoLinks = [
    { label: t("chaynCoAbout"), href: "https://www.chayn.co/about" },
    { label: t("chaynCoDonate"), href: "https://www.paypal.com/paypalme/chaynhq" },
    { label: t("chaynCoCareers"), href: "https://chayn-cio.breezy.hr/" },
  ];

  const orgChaynCoLinks = [
    { label: t("orgChaynCoProjects"), href: "https://org.chayn.co/projects" },
    { label: t("orgChaynCoPartnerships"), href: "https://org.chayn.co/partnerships" },
    { label: t("orgChaynCoImpact"), href: "https://org.chayn.co/impact" },
  ];

  const legalLinks = [
    { label: t("legalPolicies"), href: "https://www.chayn.co/policies/privacy-policy" },
    { label: t("legalTrustCentre"), href: "https://app.eu.vanta.com/chayn.co/trust/yrbp5r3nj96a1dlq15h0y" },
    { label: t("legalContact"), href: "mailto:team@chayn.co" },
  ];

  return (
    <footer
      aria-label={t("ariaLabel")}
      className="border-t border-peach bg-white text-foreground"
    >
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4">
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

            <p className="max-w-[240px] text-sm leading-relaxed text-foreground/75">
              {t("tagline")}
            </p>

            <p className="text-xs text-foreground/60">
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
                      aria-label={`${label} (${t("opensInNewTab")})`}
                      className={socialIconStyles}
                    >
                      {icon}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* chayn.co */}
          <div>
            <ColHeading
              href="https://www.chayn.co"
              newTabLabel={t("opensInNewTab")}
            >
              chayn.co
            </ColHeading>
            <ul className="flex flex-col gap-3">
              {chaynCoLinks.map(({ label, href }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${label} (${t("opensInNewTab")})`}
                    className={linkStyles}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* org.chayn.co */}
          <div>
            <ColHeading
              href="https://org.chayn.co"
              newTabLabel={t("opensInNewTab")}
            >
              org.chayn.co
            </ColHeading>
            <ul className="flex flex-col gap-3">
              {orgChaynCoLinks.map(({ label, href }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${label} (${t("opensInNewTab")})`}
                    className={linkStyles}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <ColHeading>{t("legalColumn")}</ColHeading>
            <ul className="flex flex-col gap-3">
              {legalLinks.map(({ label, href }) => {
                const isMailto = href.startsWith("mailto:");
                return (
                  <li key={href}>
                    <a
                      href={href}
                      target={isMailto ? undefined : "_blank"}
                      rel={isMailto ? undefined : "noopener noreferrer"}
                      aria-label={
                        isMailto
                          ? undefined
                          : `${label} (${t("opensInNewTab")})`
                      }
                      className={linkStyles}
                    >
                      {label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
