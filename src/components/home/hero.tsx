import { useEffect, useState } from "react";
import heroSaffron1 from "@/assets/hero-saffron-1.jpg";
import heroSaffron2 from "@/assets/hero-saffron-2.jpg";

const SLIDES = [
  {
    src: heroSaffron1,
    pos: "center 50%",
    alt: "گل زعفران بنفش در مزرعه",
  },
  {
    src: heroSaffron2,
    pos: "center 55%",
    alt: "غروب آفتاب بر مزرعه گل‌های بنفش",
  },
];

export function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % SLIDES.length);
    }, 8000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        height: "72vh",
        maxHeight: "780px",
        minHeight: "520px",
        overflow: "hidden",
        backgroundColor: "hsl(37, 54%, 95%)",
      }}
      aria-label="معرفی زعفران خواجوی"
    >
      {/* Slideshow */}
      {SLIDES.map((s, i) => (
        <img
          key={s.src}
          src={s.src}
          alt={s.alt}
          loading={i === 0 ? "eager" : "lazy"}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: s.pos,
            opacity: i === active ? 1 : 0,
            transition: "opacity 1.5s ease-in-out",
          }}
        />
      ))}

      {/* Soft warm tint */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(42,26,10,0.25) 0%, rgba(42,26,10,0.05) 35%, rgba(245,237,224,0) 60%, hsl(37, 54%, 95%) 100%)",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          textAlign: "center",
          padding: "0 1.25rem calc(env(safe-area-inset-bottom, 0px) + 3rem)",
        }}
      >
        <p
          className="hero-rise font-display text-base"
          style={{
            color: "#5a3e2e",
            fontSize: "clamp(0.875rem, 2.5vw, 1.75rem)",
            lineHeight: 1,
            marginBottom: "0.125rem",
            textShadow: "0 1px 2px rgba(255,255,255,0.4)",
          }}
        >
          a delightful journey
        </p>
        <p
          className="hero-rise-delay"
          style={{
            marginTop: "1rem",
            color: "#2a1a0a",
            fontSize: "clamp(0.95rem, 2.2vw, 1.15rem)",
            maxWidth: "38rem",
            lineHeight: 1.9,
            opacity: 0.85,
          }}
        >
          سفری به دل مزارع قائنات؛ زعفران اصیل ایرانی با عطر، رنگ و طعمی بی‌مانند.
        </p>
      </div>
    </section>
  );
}
