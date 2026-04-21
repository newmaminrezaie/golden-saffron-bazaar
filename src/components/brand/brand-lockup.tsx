type BrandLockupProps = {
  variant?: "header" | "footer";
  className?: string;
};

export function BrandLockup({ variant = "header", className }: BrandLockupProps) {
  const isFooter = variant === "footer";
  const textSize = isFooter ? "text-2xl md:text-3xl" : "text-lg";
  const colorClass = isFooter
    ? "text-[color:var(--parchment)]"
    : "text-[color:var(--brown-deep)]";

  return (
    <div className={`flex items-center ${colorClass} ${className ?? ""}`}>
      <span className={`font-brand ${textSize} leading-none flex items-baseline gap-1.5`}>
        <span className="font-medium">زعفران</span>
        <span
          className={
            isFooter
              ? "font-bold border-b-2 border-[color:var(--saffron)] pb-0.5"
              : "font-bold"
          }
        >
          خواجوی
        </span>
      </span>
    </div>
  );
}
