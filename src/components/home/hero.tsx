import { useEffect, useState } from "react";

const SLIDES = [
  {
    src: "https://images.unsplash.com/photo-1599909533731-3d2a4f4c6d9b?auto=format&fit=crop&w=1920&q=80",
    pos: "center 40%",
    alt: "رشته‌های زعفران",
  },
  {
    src: "https://images.unsplash.com/photo-1605478371310-9b78ee5fdcce?auto=format&fit=crop&w=1920&q=80",
    pos: "center 55%",
    alt: "گل زعفران در مزرعه",
  },
  {
    src: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1920&q=80",
    pos: "center 50%",
    alt: "زعفران در ظرف سنتی",
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
          justifyContent: "center",
          textAlign: "center",
          padding: "0 1.25rem",
        }}
      >
        <p
          className="hero-rise font-display"
          style={{
            color: "#5a3e2e",
            fontSize: "clamp(1.75rem, 5vw, 3.5rem)",
            lineHeight: 1,
            marginBottom: "0.5rem",
            textShadow: "0 1px 2px rgba(255,255,255,0.4)",
          }}
        >
          a delightful journey
        </p>
        <h1
          className="hero-rise-delay"
          style={{
            color: "#2a1a0a",
            fontSize: "clamp(2.25rem, 7vw, 5rem)",
            fontWeight: 800,
            lineHeight: 1.15,
            margin: 0,
            letterSpacing: "-0.01em",
          }}
        >
          زعفران خواجوی
        </h1>
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

        {/* Slide dots */}
        <div
          style={{
            position: "absolute",
            bottom: "calc(env(safe-area-inset-bottom, 0px) + 2.5rem)",
            display: "flex",
            gap: "0.5rem",
          }}
        >
          {SLIDES.map((_, i) => (
            <button
              key={i}
              aria-label={`اسلاید ${i + 1}`}
              onClick={() => setActive(i)}
              style={{
                width: i === active ? "24px" : "8px",
                height: "8px",
                borderRadius: "999px",
                background: i === active ? "#2a1a0a" : "rgba(42,26,10,0.35)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.4s ease",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
