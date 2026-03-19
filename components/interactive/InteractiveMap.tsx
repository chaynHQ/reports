"use client";

import { Graticule, Mercator } from "@visx/geo";
import { ParentSize } from "@visx/responsive";
import React, { useMemo, useState } from "react";
import { feature } from "topojson-client";
import worldAtlas from "world-atlas/countries-110m.json";

const countries = feature(worldAtlas, worldAtlas.objects.countries).features;

const cardStyles =
  "card-bordered flex flex-col gap-0 bg-background overflow-hidden p-0";
const mapStyles = "w-full overflow-hidden bg-peach-tint";
const legendStyles =
  "flex flex-wrap items-center gap-4 px-5 py-4 border-t border-foreground/8";
const legendItemStyles =
  "flex items-center gap-2 font-sans text-sm text-foreground/80";
const calloutStyles =
  "px-5 py-4 bg-peach-tint border-t border-foreground/8 font-sans text-sm text-foreground/80";
const promptStyles = "px-5 pb-3 font-sans text-xs text-foreground/80";
const srOnlyStyles = "sr-only";

export interface CountryHighlight {
  /** Numeric feature ID from world-atlas (e.g. "826" for UK, "586" for Pakistan). */
  id: string;
  fill: string;
  stroke?: string;
  /** Display name shown in legend and callout. */
  label: string;
  /** Detail text shown in callout on hover/focus. */
  detail?: string;
}

export interface InteractiveMapProps {
  highlights: CountryHighlight[];
  legendLabel: string;
  mapAriaLabel: string;
  hoverPrompt?: string;
}

export function InteractiveMap({
  highlights,
  legendLabel,
  mapAriaLabel,
  hoverPrompt,
}: InteractiveMapProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const highlightMap = useMemo(
    () => new Map(highlights.map((h) => [h.id, h])),
    [highlights],
  );

  const activeHighlight = hoveredId ? highlightMap.get(hoveredId) : null;

  return (
    <div className={cardStyles}>
      <div className={mapStyles}>
        <ParentSize>
          {({ width }) => {
            if (width === 0) return null;

            const height = Math.round(width * 0.5);
            const scale = (width / 2 / Math.PI) * 0.9;

            return (
              <svg
                width={width}
                height={height}
                className="block"
                role="img"
                aria-label={mapAriaLabel}
              >
                <rect
                  width={width}
                  height={height}
                  fill="var(--color-peach-tint)"
                />

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
                        const id = String(f.id);
                        const highlight = highlightMap.get(id);
                        const isHovered = hoveredId === id;
                        return (
                          <path
                            key={`country-${i}`}
                            d={d ?? ""}
                            fill={highlight?.fill ?? "var(--color-foreground)"}
                            fillOpacity={
                              highlight ? (isHovered ? 1 : 0.85) : 0.12
                            }
                            stroke={
                              highlight?.stroke ?? highlight?.fill ?? "var(--color-foreground)"
                            }
                            strokeOpacity={highlight ? 0.6 : 0.25}
                            strokeWidth={highlight ? (isHovered ? 2 : 1) : 0.4}
                            style={
                              highlight ? { cursor: "pointer" } : undefined
                            }
                            tabIndex={highlight ? 0 : undefined}
                            role={highlight ? "button" : undefined}
                            aria-label={
                              highlight
                                ? highlight.detail
                                  ? `${highlight.label}: ${highlight.detail}`
                                  : highlight.label
                                : undefined
                            }
                            onMouseEnter={
                              highlight ? () => setHoveredId(id) : undefined
                            }
                            onMouseLeave={
                              highlight ? () => setHoveredId(null) : undefined
                            }
                            onFocus={
                              highlight ? () => setHoveredId(id) : undefined
                            }
                            onBlur={
                              highlight ? () => setHoveredId(null) : undefined
                            }
                            onKeyDown={
                              highlight
                                ? (e: React.KeyboardEvent) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                      e.preventDefault();
                                    }
                                  }
                                : undefined
                            }
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

      {/* Visually-hidden text alternative (WCAG 1.1.1) */}
      <ul className={srOnlyStyles}>
        {highlights
          .filter((h) => h.detail)
          .map((h) => (
            <li key={h.id}>
              {h.label}: {h.detail}
            </li>
          ))}
      </ul>

      {/* Hover/focus callout */}
      {activeHighlight ? (
        <div className={calloutStyles} role="status" aria-live="polite">
          <span className="font-semibold text-foreground">
            {activeHighlight.label}:
          </span>{" "}
          {activeHighlight.detail}
        </div>
      ) : (
        hoverPrompt && <p className={promptStyles}>{hoverPrompt}</p>
      )}

      {/* Legend */}
      <div className={legendStyles} role="list" aria-label={legendLabel}>
        {highlights.map((h) => (
          <div key={h.id} role="listitem" className={legendItemStyles}>
            <span
              aria-hidden="true"
              className="inline-block h-3 w-3 rounded-full flex-shrink-0"
              style={{ background: h.fill }}
            />
            {h.label}
          </div>
        ))}
      </div>
    </div>
  );
}
