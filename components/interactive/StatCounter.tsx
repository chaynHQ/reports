"use client";

import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import { useRef } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface StatCounterProps {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  /** Animation duration in seconds. Default 1.5. */
  duration?: number;
}

const containerStyles = "flex flex-col items-center gap-3 text-center";
const numberStyles =
  "font-serif text-6xl leading-none tracking-tight text-foreground tabular-nums";
const labelStyles = "text-sm leading-snug text-foreground/80 max-w-[18ch]";

export function StatCounter({
  value,
  label,
  prefix = "",
  suffix = "",
  duration = 1.5,
}: StatCounterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (reducedMotion) {
        if (countRef.current) {
          countRef.current.textContent = value.toLocaleString();
        }
        return;
      }

      const obj = { val: 0 };
      gsap.to(obj, {
        val: value,
        duration,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          once: true,
        },
        onUpdate() {
          if (countRef.current) {
            countRef.current.textContent = Math.round(
              obj.val
            ).toLocaleString();
          }
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className={containerStyles}
      aria-label={`${prefix}${value.toLocaleString()}${suffix} — ${label}`}
    >
      {/* Number display is decorative; accessible label is on the container */}
      <p className={numberStyles} aria-hidden="true">
        {prefix}
        <span ref={countRef}>0</span>
        {suffix}
      </p>
      <p className={labelStyles} aria-hidden="true">
        {label}
      </p>
    </div>
  );
}
