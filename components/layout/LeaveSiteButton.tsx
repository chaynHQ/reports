"use client";

import { EVENTS } from "@/constants/events";
import { trackEvent } from "@/lib/analytics";
import { useTranslations } from "next-intl";

const wrapperStyles =
  "fixed top-[86px] inset-x-0 z-[49] pointer-events-none " +
  "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-end";

const buttonStyles =
  "pointer-events-auto inline-flex h-9 items-center justify-center " +
  "rounded-full bg-red px-5 text-sm font-semibold text-cream " +
  "transition-colors hover:bg-red/85 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red " +
  "focus-visible:ring-offset-2 focus-visible:ring-offset-peach-tint";

export interface LeaveSiteButtonProps {
  exitHref?: string;
  replaceHref?: string;
}

export function LeaveSiteButton({
  exitHref = "https://en.wikipedia.org",
  replaceHref = "https://www.google.com",
}: LeaveSiteButtonProps) {
  const t = useTranslations("leaveSite");

  const handleClick = () => {
    trackEvent(EVENTS.LEAVE_SITE_BUTTON_CLICKED, {});
    window.open(exitHref, "_blank", "noopener,noreferrer");
    location.replace(replaceHref);
  };

  return (
    <div className={wrapperStyles}>
      <button
        type="button"
        onClick={handleClick}
        className={buttonStyles}
        aria-label={t("ariaLabel")}
      >
        {t("button")}
      </button>
    </div>
  );
}
