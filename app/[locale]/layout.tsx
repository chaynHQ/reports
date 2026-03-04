import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing, type Locale } from '@/i18n/routing';
import { getLocaleDirection } from '@/lib/locale-dir';
import RollbarProvider from '@/components/RollbarProvider';
import { ClientProviders } from '@/components/ClientProviders';
import '../globals.css';

// TODO (A11y): Run axe-core / Lighthouse against every locale variant to confirm
// lang and dir attributes are correctly announced by screen readers (VoiceOver,
// NVDA, TalkBack). Verify font subsets load correctly for the 'hi' Latin
// transliteration locale.

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
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
  const t = await getTranslations({ locale, namespace: 'site' });

  return {
    title: t('title'),
    description: t('description'),
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
    <html lang={locale} dir={dir}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
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
