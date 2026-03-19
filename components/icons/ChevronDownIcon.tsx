interface ChevronDownIconProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

export function ChevronDownIcon({
  width = 16,
  height = 16,
  className,
}: ChevronDownIconProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      className={className}
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
