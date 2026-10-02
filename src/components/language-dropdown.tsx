import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  LANG_LABELS,
  OTHER_LOCALES,
  pathInLocale,
} from "@/i18n/locales";

const ALL_LOCALES = ["fa", ...OTHER_LOCALES] as const;

/**
 * Tiny inline SVG flags (~18×13). Hand-drawn and self-contained so the site
 * stays fully offline — no emoji flags (Windows shows letters) and no images.
 */
export function Flag({ lang, className }: { lang: string; className?: string }) {
  return (
    <svg viewBox="0 0 18 13" aria-hidden="true" className={className}>
      {lang === "fa" && (
        <g>
          <rect width="18" height="13" fill="#f9f9f9" />
          <rect width="18" height="4.34" fill="#239f40" />
          <rect y="8.66" width="18" height="4.34" fill="#da0000" />
          <path
            d="M9 4.6c1 0 1.7.9 1.7 1.9S10 8.4 9 8.4 7.3 7.5 7.3 6.5 8 4.6 9 4.6Zm0 1.2c-.4 0-.7.3-.7.7s.3.7.7.7.7-.3.7-.7-.3-.7-.7-.7Z"
            fill="#da0000"
          />
        </g>
      )}
      {lang === "en" && (
        <g>
          <rect width="18" height="13" fill="#012169" />
          <path d="M0 0 18 13M18 0 0 13" stroke="#fff" strokeWidth="2.6" />
          <path d="M0 0 18 13M18 0 0 13" stroke="#c8102e" strokeWidth="1.1" />
          <path d="M9 0v13M0 6.5h18" stroke="#fff" strokeWidth="4" />
          <path d="M9 0v13M0 6.5h18" stroke="#c8102e" strokeWidth="2.2" />
        </g>
      )}
      {lang === "tr" && (
        <g>
          <rect width="18" height="13" fill="#e30a17" />
          <circle cx="7" cy="6.5" r="3.1" fill="#fff" />
          <circle cx="8.2" cy="6.5" r="2.5" fill="#e30a17" />
          <path
            d="M12.4 4.9l.5 1.2 1.3.1-1 .9.3 1.3-1.1-.7-1.1.7.3-1.3-1-.9 1.3-.1z"
            fill="#fff"
          />
        </g>
      )}
      {lang === "ar" && (
        <g>
          <rect width="18" height="13" fill="#006c35" />
          <path
            d="M4 5.1c.8-.9 1.4.6 2.2-.2.8-.9 1.4.6 2.2-.2.8-.9 1.4.6 2.2-.2.8-.9 1.4.6 2.2-.2"
            fill="none"
            stroke="#fff"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
          <path
            d="M4.5 9h8.5m0 0 .9-.7v1.4z"
            fill="none"
            stroke="#fff"
            strokeWidth="1"
            strokeLinejoin="round"
          />
        </g>
      )}
    </svg>
  );
}

/**
 * Compact language dropdown for the header row: closed = flag + label pill,
 * open = small panel with all four languages. Navigation is a plain link so
 * the page reloads with the right direction (same behavior as the pills).
 */
export function LanguageDropdown({
  pathname,
  current,
  className = "",
}: {
  pathname: string;
  current: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={`relative shrink-0 ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="انتخاب زبان / Select language"
        className="flex h-9 items-center gap-1.5 rounded-full border border-border/70 bg-card/70 px-2.5 text-xs font-bold text-foreground/85 transition hover:border-accent/50 hover:text-accent"
      >
        <Flag lang={current} className="h-3.5 w-auto rounded-[2px] shadow-sm" />
        <span className="max-w-20 truncate">{LANG_LABELS[current]}</span>
        <ChevronDown
          className={`size-3.5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="انتخاب زبان / Select language"
          className="absolute end-0 top-full z-60 mt-2 min-w-40 overflow-hidden rounded-xl border border-border/70 bg-card py-1 shadow-lg"
        >
          {ALL_LOCALES.map((l) => (
            <a
              key={l}
              href={pathInLocale(pathname, l)}
              hrefLang={l}
              lang={l}
              onClick={() => setOpen(false)}
              aria-selected={l === current}
              className={`flex items-center gap-2.5 px-3 py-2 text-xs font-bold transition ${
                l === current
                  ? "bg-secondary text-accent"
                  : "text-foreground/85 hover:bg-secondary/70 hover:text-accent"
              }`}
            >
              <Flag lang={l} className="h-3.5 w-auto shrink-0 rounded-[2px] shadow-sm" />
              <span className="truncate">{LANG_LABELS[l]}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
