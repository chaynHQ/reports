"use client";

import { useGSAP } from "@gsap/react";
import { Group } from "@visx/group";
import { ParentSize } from "@visx/responsive";
import { scaleBand, scaleLinear } from "@visx/scale";
import { Bar } from "@visx/shape";
import gsap from "gsap";
import { useTranslations } from "next-intl";
import { useRef } from "react";

// TODO (A11y): Before shipping this component:
// 1. Add role="img" and aria-label on the <svg> summarising the chart's key finding.
// 2. Provide a visually-hidden <table> below the chart listing every category and
//    value (WCAG 1.1.1) — this is the primary text alternative for screen readers.
// 3. Axis labels and value text must maintain ≥ 4.5:1 contrast ratio.
// 4. If bars become individually interactive: role="graphics-symbol img" +
//    aria-label="{category}: {value} cases" on each <rect>.

gsap.registerPlugin(useGSAP);

interface Datum {
  label: string;
  value: number;
}

// Fixed pixel dimensions
const CHART_HEIGHT = 300;
const LABEL_WIDTH = 185; // px reserved for category labels
const VALUE_GAP = 8;     // gap between bar end and its value label
const MARGIN = { top: 12, right: 56, bottom: 12 };

const cardStyles = "card-bordered flex flex-col gap-4 bg-background p-6";
const sourceStyles = "font-sans text-xs text-foreground/50";

// ── Inner chart (receives measured width from ParentSize) ─────────────────────

interface ChartInnerProps {
  data: Datum[];
  width: number;
}

function ChartInner({ data, width }: ChartInnerProps) {
  // barsRef targets the single <g> that owns all <rect> elements so
  // GSAP's querySelectorAll("rect") reliably finds every bar.
  const barsRef = useRef<SVGGElement>(null);

  const innerHeight = CHART_HEIGHT - MARGIN.top - MARGIN.bottom;
  const innerWidth = width - LABEL_WIDTH - MARGIN.right;

  const yScale = scaleBand<string>({
    domain: data.map((d) => d.label),
    range: [0, innerHeight],
    padding: 0.38,
  });

  const maxValue = Math.max(...data.map((d) => d.value));
  const xScale = scaleLinear<number>({
    domain: [0, maxValue],
    range: [0, innerWidth],
    nice: true,
  });

  // Animate all bars from width=0 on mount, respecting prefers-reduced-motion.
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(barsRef.current!.querySelectorAll("rect"), {
        attr: { width: 0 },
        duration: 0.7,
        stagger: 0.1,
        ease: "power2.out",
      });
    },
    { scope: barsRef }
  );

  const bandwidth = yScale.bandwidth();
  const midY = bandwidth / 2;

  return (
    <svg
      width={width}
      height={CHART_HEIGHT}
      className="block font-sans"
      // TODO (A11y): add role="img" aria-label="..." here
    >
      <Group top={MARGIN.top}>
        {/* Category labels — rendered in the left-hand margin */}
        {data.map((d) => (
          <text
            key={`label-${d.label}`}
            x={LABEL_WIDTH - 10}
            y={(yScale(d.label) ?? 0) + midY}
            textAnchor="end"
            dominantBaseline="middle"
            fontSize={13}
            fill="var(--color-foreground)"
            fillOpacity={0.75}
          >
            {d.label}
          </text>
        ))}

        {/* All bars in one <g> so barsRef and querySelectorAll("rect") are stable */}
        <g ref={barsRef} transform={`translate(${LABEL_WIDTH}, 0)`}>
          {data.map((d) => (
            <Bar
              key={`bar-${d.label}`}
              x={0}
              y={yScale(d.label) ?? 0}
              width={xScale(d.value)}
              height={bandwidth}
              fill="var(--color-red)"
              fillOpacity={0.85}
              rx={4}
              // TODO (A11y): add role aria-label per bar when data is finalised
            />
          ))}
        </g>

        {/* Value labels — positioned at bar end, outside the bars group */}
        {data.map((d) => (
          <text
            key={`val-${d.label}`}
            x={LABEL_WIDTH + xScale(d.value) + VALUE_GAP}
            y={(yScale(d.label) ?? 0) + midY}
            textAnchor="start"
            dominantBaseline="middle"
            fontSize={12}
            fontWeight={600}
            fill="var(--color-foreground)"
            fillOpacity={0.65}
          >
            {d.value.toLocaleString()}
          </text>
        ))}
      </Group>
    </svg>
  );
}

// ── Public component ──────────────────────────────────────────────────────────

export function AnimatedChart() {
  const t = useTranslations("home.chart");

  // Labels are translated; values are research data (not UI copy).
  const data: Datum[] = [
    { label: t("nonConsensualSharing"), value: 847 },
    { label: t("threatsToShare"),       value: 623 },
    { label: t("deepfakeImages"),       value: 412 },
    { label: t("sextortion"),           value: 298 },
    { label: t("otherUnknown"),         value: 201 },
  ];

  return (
    <div className={cardStyles}>
      <ParentSize>
        {({ width }) => {
          if (width === 0) return null;
          return <ChartInner data={data} width={width} />;
        }}
      </ParentSize>
      <p className={sourceStyles}>{t("source")}</p>
    </div>
  );
}
