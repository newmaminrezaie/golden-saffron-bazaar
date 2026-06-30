import { useEffect, useState } from "react";
import heroSaffron1 from "@/assets/hero-saffron-1.jpg";
import mulberryBanner from "@/assets/mulberry-banner.webp";

const SLIDES = [
  {
    src: heroSaffron1,
    pos: "center 50%",
    alt: "گل زعفران بنفش در مزرعه",
  },
  {
    src: mulberryBanner,
    pos: "center 50%",
    alt: "توت خشک طبیعی و خوش طعم",
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
    <>
      <style>{`
        .hero-carousel {
          height: 56vh;
          max-height: 600px;
          min-height: 380px;
        }
        @media (max-width: 640px) {
          .hero-carousel {
            height: 32vh;
            min-height: 220px;
            max-height: 380px;
          }
        }
      `}</style>
      <section
        className="hero-carousel"
      style={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        backgroundColor: "hsl(37, 54%, 95%)",
      }}
      aria-label="معرفی زعفران خواجوی"
    >
      {/* Sliding track (RTL: positive translateX moves track to the right, revealing next slide from the left) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          width: `${SLIDES.length * 100}%`,
          height: "100%",
          transform: `translateX(${active * (100 / SLIDES.length)}%)`,
          transition: "transform 900ms ease-in-out",
        }}
      >
        {SLIDES.map((s, i) => (
          <img
            key={s.src}
            src={s.src}
            alt={s.alt}
            loading={i === 0 ? "eager" : "lazy"}
            decoding={i === 0 ? "sync" : "async"}
            // @ts-expect-error: valid HTML attr, not yet in React types
            fetchpriority={i === 0 ? "high" : "low"}
            style={{
              width: `${100 / SLIDES.length}%`,
              height: "100%",
              objectFit: "cover",
              objectPosition: s.pos,
              flexShrink: 0,
            }}
          />
        ))}
      </div>


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
        {active === 0 && (
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
        )}
      </div>
    </section>
    </>
  );
}
