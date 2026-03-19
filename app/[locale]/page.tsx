import { getTranslations, setRequestLocale } from "next-intl/server";

import type { Locale } from "@/i18n/routing";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("home");

  return (
    <main
      id="main-content"
      className="flex min-h-screen flex-col items-center justify-center bg-background px-6 pb-24 pt-40"
    >
      <h1 className="text-4xl tracking-tight text-foreground">
        {t("heading")}
      </h1>
      <p className="mt-4 max-w-prose text-center text-lg text-foreground/80">
        {t("intro")}
      </p>
    </main>
  );
}
