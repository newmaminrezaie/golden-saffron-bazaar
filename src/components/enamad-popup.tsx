import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { EnamadSeal } from "@/components/enamad-seal";

const STORAGE_KEY = "enamad-popup-dismissed";

export function EnamadPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") return;
    } catch {
      // ignore storage access errors
    }
    const t = window.setTimeout(() => setVisible(true), 10000);
    return () => window.clearTimeout(t);
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-4 left-4 md:bottom-6 md:left-6 z-50 bg-white rounded-xl border border-black/10 shadow-xl p-2 flex items-center justify-center w-[90px] h-[90px] md:w-[120px] md:h-[120px]"
      role="dialog"
      aria-label="نماد اعتماد الکترونیکی"
    >
      <button
        type="button"
        onClick={dismiss}
        aria-label="بستن"
        className="absolute -top-2 -right-2 bg-white border border-black/10 rounded-full w-6 h-6 md:w-7 md:h-7 flex items-center justify-center shadow hover:bg-gray-50 transition"
      >
        <X className="size-3.5 md:size-4 text-[color:var(--brown-deep)]" />
      </button>
      <EnamadSeal className="block w-full h-full flex items-center justify-center [&_img]:max-w-full [&_img]:max-h-full" />
    </div>
  );
}
