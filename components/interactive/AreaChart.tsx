"use client";

import { useGSAP } from "@gsap/react";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { curveMonotoneX } from "@visx/curve";
import { LinearGradient } from "@visx/gradient";
import { Group } from "@visx/group";
import { ParentSize } from "@visx/responsive";
import { scaleLinear } from "@visx/scale";
import { Area, LinePath } from "@visx/shape";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useId, useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const MARGIN = { top: 16, right: 20, bottom: 40, left: 48 };
const CHART_HEIGHT = 260;

const cardStyles = "card-bordered flex flex-col gap-4 bg-background p-6";
const sourceStyles = "font-sans text-xs text-foreground/80";

export interface AreaChartDataPoint {
  label: string | number;
  value: number;
}

export interface AreaChartProps {
  data: AreaChartDataPoint[];
  ariaLabel: string;
  source?: string;
}

interface AreaInnerProps {
  data: AreaChartDataPoint[];
  width: number;
  gradientId: string;
  clipId: string;
  ariaLabel: string;
}

function AreaInner({ data, width, gradientId, clipId, ariaLabel }: AreaInnerProps) {
  const containerRef = useRef<SVGSVGElement>(null);
  const clipRectRef = useRef<SVGRectElement>(null);

  const innerWidth = width - MARGIN.left - MARGIN.right;
  const innerHeight = CHART_HEIGHT - MARGIN.top - MARGIN.bottom;

  const xScale = scaleLinear<number>({
    domain: [0, data.length - 1],
    range: [0, innerWidth],
  });

  const maxValue = Math.max(...data.map((d) => d.value));
  const yScale = scaleLinear<number>({
    domain: [0, maxValue],
    range: [innerHeight, 0],
    nice: true,
  });

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        if (clipRectRef.current) {
          clipRectRef.current.setAttribute("width", String(innerWidth + 8));
        }
        return;
      }
      gsap.fromTo(
        clipRectRef.current,
        { attr: { width: 0 } },
        {
          attr: { width: innerWidth + 8 },
          duration: 1.4,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 82%",
            once: true,
          },
        },
      );
    },
    { scope: containerRef },
  );

  const axisColor = "var(--color-foreground)";
  const axisTickProps = {
    fill: axisColor,
    fillOpacity: 0.5,
    fontSize: 11,
    fontFamily: "var(--font-sans, sans-serif)",
  };

  return (
    <svg
      ref={containerRef}
      width={width}
      height={CHART_HEIGHT}
      className="block font-sans overflow-visible"
      role="img"
      aria-label={ariaLabel}
    >
      <defs>
        <LinearGradient
          id={gradientId}
          from="var(--color-red)"
          to="var(--color-red)"
          fromOpacity={0.25}
          toOpacity={0.02}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        />
        <clipPath id={clipId}>
          <rect
            ref={clipRectRef}
            x={0}
            y={-MARGIN.top}
            width={0}
            height={CHART_HEIGHT}
          />
        </clipPath>
      </defs>

      <Group left={MARGIN.left} top={MARGIN.top}>
        {yScale.ticks(4).map((tick) => (
          <line
            key={tick}
            x1={0}
            x2={innerWidth}
            y1={yScale(tick)}
            y2={yScale(tick)}
            stroke="var(--color-foreground)"
            strokeOpacity={0.08}
            strokeWidth={1}
          />
        ))}

        <g clipPath={`url(#${clipId})`}>
          <Area<AreaChartDataPoint>
            data={data}
            x={(_, i) => xScale(i)}
            y={(d) => yScale(d.value)}
            y0={() => innerHeight}
            curve={curveMonotoneX}
            fill={`url(#${gradientId})`}
          />
          <LinePath<AreaChartDataPoint>
            data={data}
            x={(_, i) => xScale(i)}
            y={(d) => yScale(d.value)}
            curve={curveMonotoneX}
            stroke="var(--color-red)"
            strokeWidth={2.5}
            strokeOpacity={0.9}
          />
          {data.map((d, i) => (
            <circle
              key={i}
              cx={xScale(i)}
              cy={yScale(d.value)}
              r={4}
              fill="var(--color-red)"
              stroke="var(--color-background)"
              strokeWidth={2}
            />
          ))}
        </g>

        <AxisBottom
          top={innerHeight}
          scale={xScale}
          numTicks={data.length}
          tickFormat={(i) => String(data[i as number]?.label ?? "")}
          stroke="transparent"
          tickStroke="transparent"
          tickLabelProps={axisTickProps}
        />

        <AxisLeft
          scale={yScale}
          numTicks={4}
          stroke="transparent"
          tickStroke="transparent"
          tickLabelProps={{ ...axisTickProps, textAnchor: "end", dx: "-0.3em" }}
        />
      </Group>
    </svg>
  );
}

export function AreaChart({ data, ariaLabel, source }: AreaChartProps) {
  const rawId = useId();
  const id = rawId.replace(/:/g, "");
  const gradientId = `${id}-gradient`;
  const clipId = `${id}-clip`;

  return (
    <div className={cardStyles}>
      <ParentSize>
        {({ width }) => {
          if (width === 0) return null;
          return (
            <AreaInner
              data={data}
              width={width}
              gradientId={gradientId}
              clipId={clipId}
              ariaLabel={ariaLabel}
            />
          );
        }}
      </ParentSize>
      {source && <p className={sourceStyles}>{source}</p>}
    </div>
  );
}
