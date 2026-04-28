import { useEffect, useState } from "react";
import { X } from "lucide-react";

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
      className="fixed bottom-6 right-6 z-50 bg-white rounded-xl border border-black/10 shadow-xl p-2 flex items-center justify-center"
      style={{ width: 140, height: 140 }}
      role="dialog"
      aria-label="نماد اعتماد الکترونیکی"
    >
      <button
        type="button"
        onClick={dismiss}
        aria-label="بستن"
        className="absolute -top-2 -left-2 bg-white border border-black/10 rounded-full w-7 h-7 flex items-center justify-center shadow hover:bg-gray-50 transition"
      >
        <X className="size-4 text-[color:var(--brown-deep)]" />
      </button>
      <a
        referrerPolicy="origin"
        target="_blank"
        rel="noopener noreferrer"
        href="https://trustseal.enamad.ir/?id=720710&Code=wRYn3reyeBtj2jZJ2oZYzZfyeKkh6don"
        className="block w-full h-full flex items-center justify-center"
      >
        <img
          referrerPolicy="origin"
          src="https://trustseal.enamad.ir/logo.aspx?id=720710&Code=wRYn3reyeBtj2jZJ2oZYzZfyeKkh6don"
          alt="نماد اعتماد الکترونیکی"
          data-code="wRYn3reyeBtj2jZJ2oZYzZfyeKkh6don"
          style={{ cursor: "pointer", maxWidth: "100%", maxHeight: "100%" }}
        />
      </a>
    </div>
  );
}
