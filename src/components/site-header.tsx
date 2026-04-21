import { Link } from "@tanstack/react-router";
import { Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { to: "/", label: "خانه" },
  { to: "/shop", label: "فروشگاه" },
  { to: "/about", label: "درباره ما" },
  { to: "/contact", label: "تماس با ما" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-8">
        {/* Right (start in RTL): logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-lg font-bold text-foreground">
            زعفران خواجوی
          </span>
        </Link>

        {/* Center nav (desktop) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-foreground/80 transition-colors hover:text-accent"
              activeProps={{ className: "text-accent" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Left (end in RTL): icons */}
        <div className="flex items-center gap-1">
          <button aria-label="جستجو" className="p-2 rounded-full hover:bg-secondary transition">
            <Search className="size-5" />
          </button>
          <button aria-label="حساب کاربری" className="p-2 rounded-full hover:bg-secondary transition hidden sm:inline-flex">
            <User className="size-5" />
          </button>
          <button aria-label="سبد خرید" className="p-2 rounded-full hover:bg-secondary transition relative">
            <ShoppingBag className="size-5" />
            <span className="absolute -top-0.5 -left-0.5 size-4 rounded-full bg-accent text-[10px] font-bold text-accent-foreground grid place-items-center">
              ۰
            </span>
          </button>
          <button
            aria-label="منو"
            className="md:hidden p-2 rounded-full hover:bg-secondary transition"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="md:hidden border-t border-border/60 bg-background">
          <ul className="flex flex-col px-4 py-3">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-base font-medium text-foreground/85"
                  activeProps={{ className: "text-accent" }}
                  activeOptions={{ exact: item.to === "/" }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
