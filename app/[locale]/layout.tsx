import { ClientProviders } from "@/components/ClientProviders";
import RollbarProvider from "@/components/RollbarProvider";
import { routing, type Locale } from "@/i18n/routing";
import { getLocaleDirection } from "@/lib/locale-dir";
import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Merriweather, Open_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";

// TODO (A11y): Run axe-core / Lighthouse against every locale variant to confirm
// lang and dir attributes are correctly announced by screen readers (VoiceOver,
// NVDA, TalkBack). Verify Merriweather and Open Sans subsets load correctly for
// the 'hi' Latin transliteration locale.

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  display: "swap",
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

/**
 * Tells Next.js which locale segments to pre-render at build time.
 * Required to enable static rendering when using setRequestLocale().
 */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site" });

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://reports.chayn.co";
  const title = t("title");
  const description = t("description");

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description,
    authors: [{ name: "Chayn", url: "https://www.chayn.co" }],
    icons: {
      icon: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
    openGraph: {
      title,
      description,
      url: "/",
      siteName: title,
      locale,
      type: "website",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png"],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  // Validate the locale segment; return 404 for unknown values.
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Opt into static rendering for this layout and all nested segments.
  // Must be called before any next-intl APIs are used.
  setRequestLocale(locale as Locale);

  const dir = getLocaleDirection(locale as Locale);

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${merriweather.variable} ${openSans.variable}`}
    >
      <body className="bg-background text-foreground antialiased">
        {/*
          RollbarProvider wraps the tree so error boundaries and Client
          Components can access the Rollbar instance via useRollbar().
          GDPR: Rollbar is configured to anonymise IPs and disable fingerprinting
          — see lib/rollbar-config.ts.
        */}
        <RollbarProvider>
          {/*
            NextIntlClientProvider in next-intl v4 automatically reads the
            message catalogue from server context set up by the plugin —
            no explicit `messages` prop required.
          */}
          <NextIntlClientProvider>
            {children}
            <ClientProviders />
          </NextIntlClientProvider>
        </RollbarProvider>
      </body>
    </html>
  );
}
