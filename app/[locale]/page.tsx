import { getTranslations, setRequestLocale } from "next-intl/server";

import type { Locale } from "@/i18n/routing";

// ssr: false dynamic imports must live in a "use client" file (Next.js 16 rule).
// islands.tsx bridges the RSC → client boundary for all interactive components.
import {
  AnimatedChart,
  AudioTrigger,
  InteractiveMap,
} from "@/components/interactive/islands";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

const mainStyles = "flex min-h-screen flex-col bg-background px-6 pb-24 pt-40";
const sectionStyles = "mx-auto w-full max-w-4xl py-24";
const headingStyles = "text-4xl tracking-tight text-foreground";
const introStyles = "mt-4 max-w-prose text-lg text-foreground/80";
const subHeadingStyles = "mb-6 text-2xl tracking-tight text-foreground";
const dividerStyles = "border-t border-foreground/10";

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("home");

  return (
    <main id="main-content" className={mainStyles}>
      {/* Hero */}
      <section className={sectionStyles}>
        <h1 className={headingStyles}>{t("heading")}</h1>
        <p className={introStyles}>{t("intro")}</p>
      </section>

      <hr className={dividerStyles} />

      {/* Audio narration */}
      <section className={sectionStyles} aria-labelledby="audio-heading">
        <h2 id="audio-heading" className={subHeadingStyles}>
          {t("audioSectionHeading")}
        </h2>
        <AudioTrigger
          src={[
            "https://archive.org/download/SSE_Library_AMBIENCE/SEASIDE/AMBSea_Water%20background%3B%20urban%20noise%20in%20background_CS_USC.mp3",
          ]}
          title={t("audioTrackTitle")}
          label={t("audioNarrationLabel")}
        />
      </section>

      <hr className={dividerStyles} />

      {/* Animated chart */}
      <section className={sectionStyles} aria-labelledby="chart-heading">
        <h2 id="chart-heading" className={subHeadingStyles}>
          {t("dataSectionHeading")}
        </h2>
        <AnimatedChart />
      </section>

      <hr className={dividerStyles} />

      {/* Interactive map */}
      <section className={sectionStyles} aria-labelledby="map-heading">
        <h2 id="map-heading" className={subHeadingStyles}>
          {t("mapSectionHeading")}
        </h2>
        <InteractiveMap />
      </section>
    </main>
  );
}
