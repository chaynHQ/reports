interface ArrowRightIconProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

export function ArrowRightIcon({ width = 14, height = 14, className }: ArrowRightIconProps) {
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
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
