import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  // Enable static rendering for this page.
  setRequestLocale(locale as Locale);

  return <HomePageContent />;
}

/**
 * Separated into a child component so translations are called inside the
 * RSC render tree (useTranslations is valid in Server Components).
 */
function HomePageContent() {
  const t = useTranslations('home');

  return (
    <main id="main-content" className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-24">
      <h1 className="text-4xl tracking-tight text-foreground">
        {t('heading')}
      </h1>
      <p className="mt-4 max-w-prose text-center text-lg text-foreground/60">
        {t('intro')}
      </p>
    </main>
  );
}
