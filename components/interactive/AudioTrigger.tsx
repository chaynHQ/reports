"use client";

import { useGSAP } from "@gsap/react";
import { Howl } from "howler";
import gsap from "gsap";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

// TODO (A11y): Before shipping this component:
// 1. Add an aria-live="polite" region so screen readers announce state changes
//    ("Playing", "Paused") without moving focus away from the button.
// 2. Expose a transcript or caption file via aria-describedby when available.
// 3. If a seek bar is added: role="slider" with aria-valuemin / aria-valuenow /
//    aria-valuemax / aria-valuetext.
// 4. Verify disabled-state colour contrast meets AA (≥ 3:1 for UI components).

gsap.registerPlugin(useGSAP);

interface AudioTriggerProps {
  /** Ordered source URLs — Howler tries each in order for codec fallback. */
  src: string[];
  /** ARIA label for the region element (describes the audio content to screen readers). */
  label: string;
  /** Display title shown in the card. */
  title: string;
}

const formatTime = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;

const cardStyles =
  "card-bordered flex flex-col gap-5 bg-peach-tint p-6";
const titleStyles =
  "font-serif text-lg leading-snug text-foreground";
const waveContainerStyles =
  "flex items-end gap-1";
const barBaseStyles =
  "w-1 rounded-full bg-red origin-bottom";
const footerStyles =
  "flex items-center justify-between";
const durationStyles =
  "font-sans text-xs text-foreground/60";

export function AudioTrigger({ src, label, title }: AudioTriggerProps) {
  const t = useTranslations("interactive.audio");
  const soundRef = useRef<Howl | null>(null);
  const waveRef = useRef<HTMLDivElement>(null);
  const waveTl = useRef<gsap.core.Timeline | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);

  const srcKey = src.join(",");

  useEffect(() => {
    const sound = new Howl({
      src,
      preload: true,
      html5: true,
      onload: () => {
        setIsReady(true);
        setDuration(sound.duration());
      },
      onloaderror: (_id, err) => console.error("[AudioTrigger] Load error:", err),
      onplay: () => setIsPlaying(true),
      onpause: () => setIsPlaying(false),
      onstop: () => setIsPlaying(false),
      onend: () => setIsPlaying(false),
    });
    soundRef.current = sound;
    return () => {
      sound.stop();
      sound.unload();
      soundRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [srcKey]);

  // Build the waveform animation once. Play/pause it via isPlaying.
  useGSAP(
    () => {
      waveTl.current = gsap
        .timeline({ repeat: -1, yoyo: true, paused: true })
        .to("[data-wave-bar]", {
          scaleY: 2,
          transformOrigin: "50% 100%",
          stagger: { each: 0.1, from: "center" },
          duration: 0.4,
          ease: "power1.inOut",
        });
    },
    { scope: waveRef }
  );

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (isPlaying) {
      waveTl.current?.play();
    } else {
      // Seek to 0 so bars reset to rest height when paused.
      waveTl.current?.pause(0);
    }
  }, [isPlaying]);

  const toggle = () => {
    const s = soundRef.current;
    if (!s) return;
    isPlaying ? s.pause() : s.play();
  };

  const buttonLabel = isPlaying ? t("pauseLabel", { title }) : t("playLabel", { title });
  const buttonText = isPlaying ? t("pause") : isReady ? t("play") : t("loading");

  return (
    <div role="region" aria-label={label} className={cardStyles}>
      {/* TODO (A11y): add aria-live="polite" region here */}
      <p className={titleStyles}>{title}</p>

      {/* Waveform indicator — hidden from assistive tech (decorative) */}
      <div ref={waveRef} aria-hidden="true" className={waveContainerStyles}>
        <div data-wave-bar className={barBaseStyles} style={{ height: "10px" }} />
        <div data-wave-bar className={barBaseStyles} style={{ height: "18px" }} />
        <div data-wave-bar className={barBaseStyles} style={{ height: "24px" }} />
        <div data-wave-bar className={barBaseStyles} style={{ height: "16px" }} />
        <div data-wave-bar className={barBaseStyles} style={{ height: "12px" }} />
      </div>

      <div className={footerStyles}>
        <button
          type="button"
          className="btn-pill bg-red text-cream text-sm"
          onClick={toggle}
          disabled={!isReady}
          aria-pressed={isPlaying}
          aria-label={buttonLabel}
        >
          {buttonText}
        </button>

        {duration !== null && (
          <span
            className={durationStyles}
            aria-label={t("duration", { duration: formatTime(duration) })}
          >
            {formatTime(duration)}
          </span>
        )}
      </div>
    </div>
  );
}
