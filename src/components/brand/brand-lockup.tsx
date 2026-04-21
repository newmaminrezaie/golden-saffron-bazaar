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
          className="h-20 w-auto"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <img
      src={brandLogo}
      alt="زعفران خواجوی"
      className={`h-10 md:h-12 w-auto ${className ?? ""}`}
    />
  );
}
