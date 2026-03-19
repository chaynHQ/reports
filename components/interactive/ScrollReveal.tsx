"use client";

import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import { useRef } from "react";
import { useAppStore } from "@/lib/store/useAppStore";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  /** Vertical offset (px) to animate from. Default 28. */
  y?: number;
  /** Stagger delay in seconds for child elements when used as a group wrapper. */
  delay?: number;
}

export function ScrollReveal({
  children,
  className = "",
  y = 28,
  delay = 0,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useAppStore((s) => s.reduceMotion);

  useGSAP(
    () => {
      if (reduceMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(ref.current, {
        opacity: 0,
        y,
        duration: 0.65,
        delay,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 88%",
          once: true,
        },
      });
    },
    { scope: ref, dependencies: [reduceMotion] }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
