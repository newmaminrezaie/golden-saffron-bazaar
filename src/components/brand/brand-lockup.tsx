import brandLogo from "@/assets/brand-logo.png";

type BrandLockupProps = {
  variant?: "header" | "footer";
  className?: string;
};

export function BrandLockup({ variant = "header", className }: BrandLockupProps) {
  const isFooter = variant === "footer";

  if (isFooter) {
    return (
      <div
        className={`inline-flex bg-[color:var(--parchment)]/95 rounded-md px-4 py-3 ${className ?? ""}`}
      >
        <img
          src={brandLogo}
          alt="زعفران خواجوی"
          width={1003}
          height={249}
          className="h-20 w-auto"
          loading="lazy"
          decoding="async"
        />
      </div>
    );
  }

  // Header logo — above the fold on every page, so it loads eagerly.
  return (
    <img
      src={brandLogo}
      alt="زعفران خواجوی"
      width={1003}
      height={249}
      loading="eager"
      decoding="sync"
      // @ts-expect-error: valid HTML attr, not yet in React types
      fetchpriority="high"
      className={`h-10 md:h-12 w-auto ${className ?? ""}`}
    />
  );
}
