import { getTranslations, setRequestLocale } from "next-intl/server";

import { PullQuote } from "@/components/interactive/PullQuote";
import {
  AnimatedChart,
  AreaChart,
  AudioTrigger,
  HorizontalCards,
  HorizontalScroll,
  InteractiveMap,
  ScrollReveal,
  StatCounter,
  StickyScroll,
} from "@/components/interactive/islands";
import type { HorizontalScrollPanel } from "@/components/interactive/HorizontalScroll";
import type { Locale } from "@/i18n/routing";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

// ── Styles ────────────────────────────────────────────────────────────────────
const mainStyles = "flex min-h-screen flex-col bg-background px-6 pb-0 pt-40";
const sectionStyles = "mx-auto w-full max-w-4xl py-20";
const heroHeadingStyles = "text-4xl tracking-tight text-foreground";
const heroIntroStyles = "mt-4 max-w-prose text-lg text-foreground/80";
const sectionHeadingStyles = "mb-2 text-2xl tracking-tight text-foreground";
const demoNoteStyles =
  "mb-7 max-w-prose text-sm leading-relaxed text-foreground/80";
const dividerStyles = "border-t border-foreground/10";
const tagsRowStyles = "mb-3 flex flex-wrap gap-2";
const tagStyles =
  "rounded-full bg-foreground/8 px-3 py-0.5 font-mono text-xs text-foreground/80";
const statsGridStyles = "mt-10 grid grid-cols-1 gap-10 sm:grid-cols-3";

// Used for full-bleed sections (negates main's px-6)
const fullBleedStyles = "-mx-6";
// Section header within a full-bleed section (restores padding + max-width)
const fullBleedHeaderStyles = "mx-auto w-full max-w-4xl px-6 py-20";

// Visual separator between demo groups
const groupDividerStyles =
  "mx-auto w-full max-w-4xl py-16 flex items-center gap-6";
const groupLabelStyles =
  "font-mono text-xs uppercase tracking-widest text-foreground/35 whitespace-nowrap";
const groupRuleStyles = "flex-1 border-t border-foreground/10";

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations();

  // ── Stat counters ──────────────────────────────────────────────────────────
  const statItems = [
    { value: 847, label: t("statCounter.casesLabel"), suffix: "" },
    { value: 28,  label: t("statCounter.countriesLabel"), suffix: "" },
    { value: 94,  label: t("statCounter.survivorsLabel"), suffix: "%" },
  ];

  // ── Animated bar chart ─────────────────────────────────────────────────────
  const barChartData = [
    { label: t("animatedChart.nonConsensualSharing"), value: 847 },
    { label: t("animatedChart.threatsToShare"),       value: 623 },
    { label: t("animatedChart.deepfakeImages"),       value: 412 },
    { label: t("animatedChart.sextortion"),           value: 298 },
    { label: t("animatedChart.otherUnknown"),         value: 201 },
  ];

  // ── Area chart ─────────────────────────────────────────────────────────────
  const areaChartData = [
    { label: 2019, value: 412 },
    { label: 2020, value: 534 },
    { label: 2021, value: 679 },
    { label: 2022, value: 756 },
    { label: 2023, value: 847 },
  ];

  // ── Interactive map ────────────────────────────────────────────────────────
  const mapHighlights = [
    {
      id: "826",
      fill: "var(--color-red)",
      label: t("interactiveMap.ukLabel"),
      detail: t("interactiveMap.ukDetail"),
    },
    {
      id: "586",
      fill: "var(--color-peach)",
      label: t("interactiveMap.pakistanLabel"),
      detail: t("interactiveMap.pakistanDetail"),
    },
  ];

  // ── Horizontal stat cards ──────────────────────────────────────────────────
  const statCards = [
    { stat: t("horizontalCards.card1Stat"), label: t("horizontalCards.card1Label") },
    { stat: t("horizontalCards.card2Stat"), label: t("horizontalCards.card2Label") },
    { stat: t("horizontalCards.card3Stat"), label: t("horizontalCards.card3Label") },
    { stat: t("horizontalCards.card4Stat"), label: t("horizontalCards.card4Label") },
    { stat: t("horizontalCards.card5Stat"), label: t("horizontalCards.card5Label") },
  ];

  // ── Sticky scroll narrative ────────────────────────────────────────────────
  const stickySteps = [
    {
      category: t("stickyScroll.step1Category"),
      heading:  t("stickyScroll.step1Heading"),
      body:     t("stickyScroll.step1Body"),
      stat:     t("stickyScroll.step1Stat"),
      statLabel: t("stickyScroll.step1StatLabel"),
    },
    {
      category: t("stickyScroll.step2Category"),
      heading:  t("stickyScroll.step2Heading"),
      body:     t("stickyScroll.step2Body"),
      stat:     t("stickyScroll.step2Stat"),
      statLabel: t("stickyScroll.step2StatLabel"),
    },
    {
      category: t("stickyScroll.step3Category"),
      heading:  t("stickyScroll.step3Heading"),
      body:     t("stickyScroll.step3Body"),
      stat:     t("stickyScroll.step3Stat"),
      statLabel: t("stickyScroll.step3StatLabel"),
    },
    {
      category: t("stickyScroll.step4Category"),
      heading:  t("stickyScroll.step4Heading"),
      body:     t("stickyScroll.step4Body"),
      stat:     t("stickyScroll.step4Stat"),
      statLabel: t("stickyScroll.step4StatLabel"),
    },
  ];

  // ── Horizontal scroll panels ───────────────────────────────────────────────
  const scrollPanels: HorizontalScrollPanel[] = [
    {
      type:      "intro",
      eyebrow:   t("horizontalScroll.panel1Eyebrow"),
      heading:   t("horizontalScroll.panel1Heading"),
      body:      t("horizontalScroll.panel1Body"),
      scrollCue: t("horizontalScroll.scrollCue"),
    },
    {
      type:    "stat",
      eyebrow: t("horizontalScroll.panel2Eyebrow"),
      stat:    t("horizontalScroll.panel2Stat"),
      body:    t("horizontalScroll.panel2Body"),
    },
    {
      type:          "quote",
      eyebrow:       t("horizontalScroll.panel3Eyebrow"),
      quote:         t("horizontalScroll.panel3Quote"),
      attribution:   t("horizontalScroll.panel3Attribution"),
    },
    {
      type:    "cta",
      eyebrow: t("horizontalScroll.panel4Eyebrow"),
      heading: t("horizontalScroll.panel4Heading"),
      body:    t("horizontalScroll.panel4Body"),
      links: [
        { label: t("horizontalScroll.panel4Cta"),  href: "https://www.chayn.co",        primary: true },
        { label: t("horizontalScroll.panel4Cta2"), href: "https://www.chayn.co/donate" },
      ],
    },
  ];

  return (
    <main id="main-content" className={mainStyles}>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className={sectionStyles}>
        <h1 className={heroHeadingStyles}>{t("home.heading")}</h1>
        <p className={heroIntroStyles}>{t("home.intro")}</p>
        <div className={tagsRowStyles} style={{ marginTop: "1.5rem" }}>
          {[
            "GSAP · ScrollTrigger",
            "Lenis Smooth Scroll",
            "Visx Charts",
            "Howler Audio",
          ].map((tag) => (
            <span key={tag} className={tagStyles}>
              {tag}
            </span>
          ))}
        </div>
      </section>

      <hr className={dividerStyles} />

      {/* ── 1. Pull Quote ─────────────────────────────────────────────────── */}
      <section className={sectionStyles} aria-labelledby="pq-heading">
        <div className={tagsRowStyles}>
          <span className={tagStyles}>RSC · zero JavaScript</span>
        </div>
        <h2 id="pq-heading" className={sectionHeadingStyles}>
          {t("home.sections.pullQuote")}
        </h2>
        <p className={demoNoteStyles}>{t("home.demoNotes.pullQuote")}</p>
        <PullQuote
          quote={t("pullQuote.quote")}
          attribution={t("pullQuote.attribution")}
          size="lg"
        />
      </section>

      <hr className={dividerStyles} />

      {/* ── 2. Animated Statistics ───────────────────────────────────────── */}
      <section className={sectionStyles} aria-labelledby="stats-heading">
        <div className={tagsRowStyles}>
          <span className={tagStyles}>GSAP · ScrollTrigger · count-up</span>
        </div>
        <h2 id="stats-heading" className={sectionHeadingStyles}>
          {t("home.sections.stats")}
        </h2>
        <p className={demoNoteStyles}>{t("home.demoNotes.stats")}</p>
        <div className={statsGridStyles}>
          {statItems.map((s) => (
            <StatCounter
              key={s.label}
              value={s.value}
              label={s.label}
              suffix={s.suffix}
            />
          ))}
        </div>
      </section>

      <hr className={dividerStyles} />

      {/* ── 3. Animated Bar Chart ────────────────────────────────────────── */}
      <section className={sectionStyles} aria-labelledby="chart-heading">
        <div className={tagsRowStyles}>
          <span className={tagStyles}>Visx · GSAP ScrollTrigger · stagger</span>
        </div>
        <h2 id="chart-heading" className={sectionHeadingStyles}>
          {t("home.sections.barChart")}
        </h2>
        <p className={demoNoteStyles}>{t("home.demoNotes.barChart")}</p>
        <AnimatedChart
          data={barChartData}
          ariaLabel={t("animatedChart.ariaLabel")}
          source={t("animatedChart.source")}
          tableCaption={t("animatedChart.tableCaption")}
          categoryHeader={t("animatedChart.categoryHeader")}
          valueHeader={t("animatedChart.casesHeader")}
        />
      </section>

      <hr className={dividerStyles} />

      {/* ── 4. Area Chart ────────────────────────────────────────────────── */}
      <section className={sectionStyles} aria-labelledby="area-heading">
        <div className={tagsRowStyles}>
          <span className={tagStyles}>
            Visx · Area · LinearGradient · GSAP clip-path
          </span>
        </div>
        <h2 id="area-heading" className={sectionHeadingStyles}>
          {t("home.sections.areaChart")}
        </h2>
        <p className={demoNoteStyles}>{t("home.demoNotes.areaChart")}</p>
        <AreaChart
          data={areaChartData}
          ariaLabel={t("areaChart.ariaLabel")}
          source={t("areaChart.source")}
        />
      </section>

      <hr className={dividerStyles} />

      {/* ── 5. Interactive Map ───────────────────────────────────────────── */}
      <section className={sectionStyles} aria-labelledby="map-heading">
        <div className={tagsRowStyles}>
          <span className={tagStyles}>Visx Geo · Mercator · hover state</span>
        </div>
        <h2 id="map-heading" className={sectionHeadingStyles}>
          {t("home.sections.map")}
        </h2>
        <p className={demoNoteStyles}>{t("home.demoNotes.map")}</p>
        <InteractiveMap
          highlights={mapHighlights}
          legendLabel={t("interactiveMap.legendLabel")}
          mapAriaLabel={t("interactiveMap.mapAriaLabel")}
          hoverPrompt={t("interactiveMap.hoverPrompt")}
        />
      </section>

      <hr className={dividerStyles} />

      {/* ── 6. Audio Narration ───────────────────────────────────────────── */}
      <section className={sectionStyles} aria-labelledby="audio-heading">
        <div className={tagsRowStyles}>
          <span className={tagStyles}>Howler · GSAP waveform</span>
        </div>
        <h2 id="audio-heading" className={sectionHeadingStyles}>
          {t("home.sections.audio")}
        </h2>
        <p className={demoNoteStyles}>{t("home.demoNotes.audio")}</p>
        <AudioTrigger
          src={[
            "https://archive.org/download/SSE_Library_AMBIENCE/SEASIDE/AMBSea_Water%20background%3B%20urban%20noise%20in%20background_CS_USC.mp3",
          ]}
          title={t("audioTrigger.title")}
          label={t("audioTrigger.narrationLabel")}
        />
      </section>

      <hr className={dividerStyles} />

      {/* ── 7. Horizontal Scroll Cards ───────────────────────────────────── */}
      <section className={sectionStyles} aria-labelledby="cards-heading">
        <div className={tagsRowStyles}>
          <span className={tagStyles}>
            CSS scroll-snap · brand palette · full-bleed
          </span>
        </div>
        <h2 id="cards-heading" className={sectionHeadingStyles}>
          {t("home.sections.cards")}
        </h2>
        <p className={demoNoteStyles}>{t("home.demoNotes.cards")}</p>
        <ScrollReveal>
          <HorizontalCards
            cards={statCards}
            listLabel={t("horizontalCards.listLabel")}
            source={t("horizontalCards.source")}
            scrollPrompt={t("horizontalCards.scrollPrompt")}
          />
        </ScrollReveal>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          SCROLL-DRIVEN ANIMATIONS
          ════════════════════════════════════════════════════════════════════ */}

      <div className={groupDividerStyles}>
        <span className={groupLabelStyles}>Scroll-driven animations</span>
        <span className={groupRuleStyles} aria-hidden="true" />
      </div>

      {/* ── A. Sticky Scroll Narrative ───────────────────────────────────── */}
      <section aria-labelledby="sticky-heading" className={fullBleedStyles}>
        <div className={fullBleedHeaderStyles}>
          <div className={tagsRowStyles}>
            <span className={tagStyles}>
              CSS sticky · GSAP ScrollTrigger · split-panel narrative
            </span>
          </div>
          <h2 id="sticky-heading" className={sectionHeadingStyles}>
            {t("home.sections.stickyScroll")}
          </h2>
          <p className={demoNoteStyles}>{t("home.demoNotes.stickyScroll")}</p>
        </div>
        <StickyScroll steps={stickySteps} />
      </section>

      <hr className={dividerStyles} />

      {/* ── B. Horizontal Scroll (vertical → horizontal) ─────────────────── */}
      <section aria-labelledby="hscroll-heading" className={fullBleedStyles}>
        <div className={fullBleedHeaderStyles}>
          <div className={tagsRowStyles}>
            <span className={tagStyles}>
              GSAP scrub · CSS sticky · vertical → horizontal
            </span>
          </div>
          <h2 id="hscroll-heading" className={sectionHeadingStyles}>
            {t("home.sections.horizontalScroll")}
          </h2>
          <p className={demoNoteStyles}>
            {t("home.demoNotes.horizontalScroll")}
          </p>
        </div>
        <HorizontalScroll panels={scrollPanels} />
      </section>
    </main>
  );
}
