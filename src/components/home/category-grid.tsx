import { Link } from "@tanstack/react-router";
import type { CSSProperties } from "react";
import saffronNegin from "@/assets/saffron-negin.jpg";
import saffronPushal from "@/assets/saffron-pushal.jpg";
import saffronPowder from "@/assets/saffron-powder.jpeg";
import giftBoxes from "@/assets/gift-boxes.jpg";
import wholesale from "@/assets/wholesale.png";

type Cat = {
  name: string;
  count: string;
  area: string;
  img: string;
  pos: string;
  scrim: string;
  labelStyle: CSSProperties;
};

const CATS: Cat[] = [
  {
    name: "زعفران نگین",
    count: "۸ محصول",
    area: "b",
    img: saffronNegin,
    pos: "center 55%",
    scrim: "linear-gradient(0deg, rgba(0,0,0,0) 35%, rgba(42,26,10,0.7) 100%)",
    labelStyle: { top: "1rem", right: "1.25rem", textAlign: "right" },
  },
  {
    name: "زعفران پوشال",
    count: "۶ محصول",
    area: "c",
    img: saffronPushal,
    pos: "center 45%",
    scrim: "linear-gradient(270deg, rgba(0,0,0,0) 40%, rgba(42,26,10,0.7) 100%)",
    labelStyle: { bottom: "1rem", left: "1.25rem", textAlign: "left" },
  },
  {
    name: "پودر زعفران",
    count: "۵ محصول",
    area: "d",
    img: saffronPowder,
    pos: "center 50%",
    scrim: "linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(42,26,10,0.75) 100%)",
    labelStyle: { bottom: "1rem", left: "50%", transform: "translateX(50%)", textAlign: "center" },
  },
  {
    name: "بسته‌های هدیه",
    count: "۹ محصول",
    area: "e",
    img: giftBoxes,
    pos: "center 50%",
    scrim: "linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(42,26,10,0.78) 100%)",
    labelStyle: { bottom: "1.25rem", right: "1.25rem", textAlign: "right" },
  },
  {
    name: "عمده‌فروشی",
    count: "تماس بگیرید",
    area: "f",
    img: wholesale,
    pos: "center 50%",
    scrim: "linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(42,26,10,0.78) 100%)",
    labelStyle: { bottom: "1.25rem", right: "1.25rem", textAlign: "right" },
  },
];

export function CategoryGrid() {
  return (
    <section style={{ padding: "3.5rem 1rem", background: "#f5ede0" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <p
            className="font-display"
            style={{ color: "#5a3e2e", fontSize: "clamp(1.5rem, 3vw, 2rem)", marginBottom: "0" }}
          >
            our collections
          </p>
          <h2
            style={{
              color: "#2a1a0a",
              fontSize: "clamp(1.15rem, 2.5vw, 1.75rem)",
              fontWeight: 800,
              margin: "0.25rem 0 0",
            }}
          >
            دسته‌بندی محصولات
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gap: "0.85rem",
            gridTemplateColumns: "repeat(2, 1fr)",
            gridTemplateAreas: `
              "e e"
              "b c"
              "d f"
            `,
          }}
          className="cat-grid"
        >
          {CATS.map((c) => (
            <Link
              to="/shop"
              key={c.area}
              style={{
                gridArea: c.area,
                position: "relative",
                display: "block",
                borderRadius: "1rem",
                overflow: "hidden",
                minHeight: c.area === "e" || c.area === "f" ? "240px" : "200px",
                boxShadow: "0 6px 20px -10px rgba(42,26,10,0.35)",
              }}
              className="group cat-card"
            >
              <img
                src={c.img}
                alt={c.name}
                loading="lazy"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: c.pos,
                  transition: "transform 0.7s ease",
                }}
                className="cat-img"
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: c.scrim,
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  color: "#fff",
                  ...c.labelStyle,
                }}
              >
                <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 800 }}>{c.name}</h3>
                <p style={{ margin: "0.25rem 0 0", fontSize: "0.85rem", opacity: 0.9 }}>
                  {c.count}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .cat-card:hover .cat-img { transform: scale(1.06); }
        @media (min-width: 768px) {
          .cat-grid {
            grid-template-columns: repeat(4, 1fr) !important;
            grid-template-areas:
              "e e b b"
              "c d f f" !important;
          }
        }
      `}</style>
    </section>
  );
}
