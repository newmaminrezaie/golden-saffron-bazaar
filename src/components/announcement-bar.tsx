import { Truck } from "lucide-react";

export function AnnouncementBar() {
  return (
    <div
      dir="rtl"
      className="w-full h-9 flex items-center justify-center text-xs md:text-sm font-medium text-[hsl(var(--parchment))]"
      style={{
        background:
          "linear-gradient(90deg, var(--brown-deep), var(--saffron), var(--brown-deep))",
        color: "var(--parchment)",
      }}
      role="region"
      aria-label="اطلاعیه ارسال رایگان"
    >
      <div className="flex items-center gap-2 px-4">
        <Truck className="size-4 shrink-0" aria-hidden="true" />
        <span>ارسال رایگان برای سفارش‌های بالای ۱,۰۰۰,۰۰۰ تومان</span>
      </div>
    </div>
  );
}
