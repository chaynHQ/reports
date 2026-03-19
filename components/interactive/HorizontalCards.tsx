"use client";

// Card colour themes cycling through brand palette
const CARD_THEMES = [
  { bg: "bg-foreground", text: "text-background", stat: "text-background", sub: "text-background/80" },
  { bg: "bg-red",        text: "text-cream",       stat: "text-cream",       sub: "text-cream/80"       },
  { bg: "bg-peach",      text: "text-foreground",  stat: "text-foreground",  sub: "text-foreground/80"  },
  { bg: "bg-foreground", text: "text-background",  stat: "text-background",  sub: "text-background/80"  },
  { bg: "bg-red",        text: "text-cream",       stat: "text-cream",       sub: "text-cream/80"       },
] as const;

const scrollPromptStyles    = "mb-3 font-sans text-xs text-foreground/80 flex items-center gap-2";
const scrollContainerStyles = "flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-6 px-6 scroll-smooth";
const cardStyles            = "snap-start flex-shrink-0 flex flex-col justify-between rounded-2xl p-8 min-w-[min(85vw,360px)]";
const statStyles            = "font-serif text-6xl leading-none tracking-tight";
const labelStyles           = "text-base leading-snug mt-4";
const cardFooterStyles      = "mt-8 flex items-end justify-between";
const sourceStyles          = "text-xs opacity-70";
const dotRowStyles          = "flex gap-2 items-center";

export interface HorizontalCard {
  stat: string;
  label: string;
}

export interface HorizontalCardsProps {
  cards: HorizontalCard[];
  listLabel: string;
  source?: string;
  scrollPrompt?: string;
}

export function HorizontalCards({
  cards,
  listLabel,
  source,
  scrollPrompt,
}: HorizontalCardsProps) {
  return (
    <div>
      {scrollPrompt && (
        <p className={scrollPromptStyles} aria-hidden="true">
          <span>{scrollPrompt}</span>
          <span>→</span>
        </p>
      )}

      <div
        className={scrollContainerStyles}
        role="list"
        aria-label={listLabel}
      >
        {cards.map((card, i) => {
          const theme = CARD_THEMES[i % CARD_THEMES.length];
          return (
            <article
              key={i}
              role="listitem"
              className={`${cardStyles} ${theme.bg}`}
            >
              <div>
                <p className={`${statStyles} ${theme.stat}`}>{card.stat}</p>
                <p className={`${labelStyles} ${theme.text}`}>{card.label}</p>
              </div>
              <div className={cardFooterStyles}>
                {source && (
                  <span className={`${sourceStyles} ${theme.text}`}>
                    {source}
                  </span>
                )}
                {/* Pagination dots — decorative */}
                <div className={dotRowStyles} aria-hidden="true">
                  {cards.map((_, j) => (
                    <span
                      key={j}
                      className={`inline-block rounded-full transition-all ${
                        j === i ? "w-4 h-2" : "w-2 h-2"
                      } ${theme.sub}`}
                      style={{ background: "currentColor" }}
                    />
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
