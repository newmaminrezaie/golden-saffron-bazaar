type SaffronMarkProps = {
  size?: number;
  className?: string;
};

/**
 * Saffron threads icon — three curved stigma strands fanning upward from a single base.
 * Uses the brand `--saffron` token with a deeper tip gradient.
 */
export function SaffronMark({ size = 28, className }: SaffronMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="saffron-thread" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.55 0.20 35)" />
          <stop offset="60%" stopColor="var(--saffron)" />
          <stop offset="100%" stopColor="oklch(0.78 0.14 70)" />
        </linearGradient>
      </defs>

      {/* Center thread */}
      <path
        d="M20 34 C 20 24, 20 16, 20 6"
        stroke="url(#saffron-thread)"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      {/* Left thread */}
      <path
        d="M20 34 C 16 26, 10 18, 6 12"
        stroke="url(#saffron-thread)"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      {/* Right thread */}
      <path
        d="M20 34 C 24 26, 30 18, 34 12"
        stroke="url(#saffron-thread)"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      {/* Base dot */}
      <circle cx="20" cy="34" r="2.2" fill="var(--saffron)" />
    </svg>
  );
}
