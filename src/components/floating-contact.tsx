import { useEffect, useRef, useState } from "react";
import { Phone, MessageCircle, MessageCircleMore, X } from "lucide-react";

import { cn } from "@/lib/utils";

const PHONE_LATIN = "+989150494939";
const PHONE_FA = "۰۹۱۵ ۰۴۹ ۴۹۳۹";

export function FloatingContact() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const toggle = () => {
    setOpen((v) => !v);
    setHasOpened(true);
  };

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      dir="rtl"
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
    >
      {open && (
        <div
          role="dialog"
          aria-label="راه‌های ارتباطی"
          className="w-72 overflow-hidden rounded-2xl border border-border/60 bg-card shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <a
            href={`tel:${PHONE_LATIN}`}
            className="flex flex-row-reverse items-center gap-3 px-4 py-3 transition-colors hover:bg-secondary"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Phone className="h-5 w-5" />
            </span>
            <span className="flex flex-1 flex-col text-left">
              <span className="text-sm font-semibold text-foreground">تماس تلفنی</span>
              <span dir="ltr" className="text-xs text-muted-foreground">
                {PHONE_FA}
              </span>
            </span>
          </a>
          <div className="h-px bg-border/60" />
          <a
            href={`https://wa.me/989150494939`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-row-reverse items-center gap-3 px-4 py-3 transition-colors hover:bg-secondary"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white">
              <MessageCircle className="h-5 w-5" />
            </span>
            <span className="flex flex-1 flex-col text-left">
              <span className="text-sm font-semibold text-foreground">واتساپ</span>
              <span dir="ltr" className="text-xs text-muted-foreground">
                {PHONE_FA}
              </span>
            </span>
          </a>
        </div>
      )}

      <button
        type="button"
        onClick={toggle}
        aria-label="راه‌های ارتباطی"
        aria-expanded={open}
        className={cn(
          "relative flex items-center justify-center border border-border/60 bg-white text-foreground shadow-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background animate-in fade-in zoom-in-95",
          open ? "h-12 w-12 rounded-full p-0" : "h-14 gap-2 rounded-full px-5",
          !open && "animate-gentle-bounce",
        )}
      >
        {open ? (
          <X className="h-6 w-6" />
        ) : (
          <>
            <MessageCircleMore className="h-6 w-6 text-accent" />
            <span className="font-brand text-base font-semibold leading-none">بپرس</span>
          </>
        )}
      </button>
    </div>
  );
}
