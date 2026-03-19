"use client";

import { Graticule, Mercator } from "@visx/geo";
import { ParentSize } from "@visx/responsive";
import { useTranslations } from "next-intl";
import { feature } from "topojson-client";
// world-atlas/countries-110m.json is typed via types/world-atlas.d.ts
import worldAtlas from "world-atlas/countries-110m.json";

// TODO (A11y): Before shipping this component:
// 1. Add role="img" and a descriptive aria-label to the <svg> naming the data
//    context (e.g. "World map highlighting the United Kingdom and Pakistan").
// 2. Each highlighted <path> needs tabIndex={0}, role="button", an aria-label
//    with the country name, and an onKeyDown handler (Enter + Space).
// 3. Provide a visually-hidden text alternative listing highlighted countries
//    and their significance (WCAG 1.1.1).
// 4. Visible focus indicator: change stroke/strokeWidth on :focus-visible (CSS
//    outline does not render on SVG elements in all browsers).

// ISO 3166-1 numeric codes as stored in world-atlas features.
// String comparison is used because world-atlas ids may be strings or numbers.
const HIGHLIGHTS: Record<string, { fill: string; stroke: string }> = {
  "826": { fill: "var(--color-red)",   stroke: "var(--color-red)" },   // United Kingdom
  "586": { fill: "var(--color-peach)", stroke: "var(--color-peach)" }, // Pakistan
};

const countries = feature(worldAtlas, worldAtlas.objects.countries).features;

const cardStyles =
  "card-bordered flex flex-col gap-4 bg-background overflow-hidden p-0";
const mapStyles =
  "w-full overflow-hidden bg-peach-tint";
const legendStyles =
  "flex flex-wrap items-center gap-4 px-5 py-4";
const legendItemStyles =
  "flex items-center gap-2 font-sans text-sm text-foreground/80";

export function InteractiveMap() {
  const t = useTranslations("home.map");

  const legendItems = [
    { id: "826", label: t("ukLabel"),       fill: "var(--color-red)" },
    { id: "586", label: t("pakistanLabel"), fill: "var(--color-peach)" },
  ];

  return (
    <div className={cardStyles}>
      <div className={mapStyles}>
        <ParentSize>
          {({ width }) => {
            if (width === 0) return null;

            const height = Math.round(width * 0.5);
            // Mercator scale: fills the full width with the standard world view.
            const scale = (width / 2 / Math.PI) * 0.9;

            return (
              <svg
                width={width}
                height={height}
                className="block"
                // TODO (A11y): add role="img" aria-label="..." here
              >
                {/* Ocean fill */}
                <rect width={width} height={height} fill="var(--color-peach-tint)" />

                <Mercator
                  data={countries}
                  scale={scale}
                  translate={[width / 2, height / 2]}
                >
                  {({ features, path }) => (
                    <g>
                      <Graticule
                        stroke="var(--color-foreground)"
                        strokeOpacity={0.06}
                        strokeWidth={0.5}
                      />
                      {features.map(({ feature: f, path: d }, i) => {
                        const highlight = HIGHLIGHTS[String(f.id)];
                        return (
                          <path
                            key={`country-${i}`}
                            d={d ?? ""}
                            fill={highlight?.fill ?? "var(--color-foreground)"}
                            fillOpacity={highlight ? 0.9 : 0.12}
                            stroke={highlight?.stroke ?? "var(--color-foreground)"}
                            strokeOpacity={highlight ? 0.6 : 0.25}
                            strokeWidth={highlight ? 1 : 0.4}
                            // TODO (A11y): add tabIndex role aria-label onKeyDown for highlighted countries
                          />
                        );
                      })}
                    </g>
                  )}
                </Mercator>
              </svg>
            );
          }}
        </ParentSize>
      </div>

      {/* Legend */}
      <div
        className={legendStyles}
        role="list"
        aria-label={t("legendLabel")}
      >
        {legendItems.map(({ id, label, fill }) => (
          <div key={id} role="listitem" className={legendItemStyles}>
            <span
              aria-hidden="true"
              className="inline-block h-3 w-3 rounded-full"
              style={{ background: fill }}
            />
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
