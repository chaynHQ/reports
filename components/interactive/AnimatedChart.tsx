"use client";

import { useGSAP } from "@gsap/react";
import { Group } from "@visx/group";
import { ParentSize } from "@visx/responsive";
import { scaleBand, scaleLinear } from "@visx/scale";
import { Bar } from "@visx/shape";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const CHART_HEIGHT = 300;
const LABEL_WIDTH = 185;
const VALUE_GAP = 8;
const MARGIN = { top: 12, right: 56, bottom: 12 };

const cardStyles = "card-bordered flex flex-col gap-4 bg-background p-6";
const sourceStyles = "font-sans text-xs text-foreground/80";
const srOnlyStyles = "sr-only";

export interface AnimatedChartDatum {
  label: string;
  value: number;
}

export interface AnimatedChartProps {
  data: AnimatedChartDatum[];
  ariaLabel: string;
  source?: string;
  tableCaption?: string;
  categoryHeader?: string;
  valueHeader?: string;
}

interface ChartInnerProps {
  data: AnimatedChartDatum[];
  width: number;
  ariaLabel: string;
}

function ChartInner({ data, width, ariaLabel }: ChartInnerProps) {
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

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(barsRef.current!.querySelectorAll("rect"), {
        attr: { width: 0 },
        duration: 0.7,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: barsRef.current,
          start: "top 82%",
          once: true,
        },
      });
    },
    { scope: barsRef },
  );

  const bandwidth = yScale.bandwidth();
  const midY = bandwidth / 2;

  return (
    <svg
      width={width}
      height={CHART_HEIGHT}
      className="block font-sans"
      role="img"
      aria-label={ariaLabel}
    >
      <Group top={MARGIN.top}>
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
            />
          ))}
        </g>

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

export function AnimatedChart({
  data,
  ariaLabel,
  source,
  tableCaption,
  categoryHeader,
  valueHeader,
}: AnimatedChartProps) {
  return (
    <div className={cardStyles}>
      <ParentSize>
        {({ width }) => {
          if (width === 0) return null;
          return <ChartInner data={data} width={width} ariaLabel={ariaLabel} />;
        }}
      </ParentSize>
      <table className={srOnlyStyles}>
        {tableCaption && <caption>{tableCaption}</caption>}
        <thead>
          <tr>
            <th scope="col">{categoryHeader}</th>
            <th scope="col">{valueHeader}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.label}>
              <td>{d.label}</td>
              <td>{d.value.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {source && <p className={sourceStyles}>{source}</p>}
    </div>
  );
}
