// RSC — no client boundary needed. Pure typographic component.

interface PullQuoteProps {
  quote: string;
  attribution?: string;
  /** "lg" (default) fits inline sections; "xl" fills a full-viewport moment */
  size?: "lg" | "xl";
}

const sizeMap = {
  lg: "text-3xl md:text-4xl",
  xl: "text-4xl md:text-5xl lg:text-6xl",
};

const blockquoteStyles = "flex flex-col gap-6 border-l-4 border-red pl-8 py-4";
const quoteStyles      = "font-serif leading-tight text-foreground";
const citeStyles       = "text-sm not-italic text-foreground/80";

export function PullQuote({ quote, attribution, size = "lg" }: PullQuoteProps) {
  return (
    <blockquote className={blockquoteStyles}>
      <p className={`${quoteStyles} ${sizeMap[size]}`}>&ldquo;{quote}&rdquo;</p>
      {attribution && (
        <footer>
          <cite className={citeStyles}>&mdash; {attribution}</cite>
        </footer>
      )}
    </blockquote>
  );
}
