import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";

type Props = {
  value: string;
  label?: string;
  className?: string;
  /** if true, renders just the icon (compact). */
  compact?: boolean;
};

/**
 * Small "copy to clipboard" button with success feedback.
 * Strips spaces from the copied value (useful for card numbers/IDs).
 */
export function CopyButton({ value, label = "کپی", className = "", compact = false }: Props) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(t);
  }, [copied]);

  const onClick = async () => {
    const clean = value.replace(/\s+/g, "");
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(clean);
      } else {
        const ta = document.createElement("textarea");
        ta.value = clean;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
    } catch {
      /* ignore */
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${label}: ${value}`}
      title={copied ? "کپی شد" : label}
      className={
        "inline-flex items-center gap-1 rounded-md border border-border/70 bg-background px-2 py-0.5 text-xs font-medium text-foreground/80 transition hover:bg-accent hover:text-foreground " +
        className
      }
    >
      {copied ? (
        <Check className="size-3.5 text-emerald-600" />
      ) : (
        <Copy className="size-3.5" />
      )}
      {!compact && <span>{copied ? "کپی شد" : label}</span>}
    </button>
  );
}
