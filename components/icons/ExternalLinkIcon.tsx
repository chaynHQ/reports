interface ExternalLinkIconProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

export function ExternalLinkIcon({ width = 10, height = 10, className }: ExternalLinkIconProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={width}
      height={height}
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2.5 9.5l7-7M9.5 2.5H4M9.5 2.5V8" />
    </svg>
  );
}
