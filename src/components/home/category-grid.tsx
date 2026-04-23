import { Link } from "@tanstack/react-router";
import type { CSSProperties } from "react";
import saffronNegin from "@/assets/saffron-negin.jpg";
import saffronPushal from "@/assets/saffron-pushal.jpg";
import saffronPowder from "@/assets/saffron-powder.jpeg";
import wholesale from "@/assets/wholesale.png";
import driedFruits from "@/assets/dried-fruits.png";
import { PRODUCTS } from "@/data/products";

type Cat = {
  name: string;
  category: string;
  area: string;
  img: string;
  pos: string;
  scrim: string;
  labelStyle: CSSProperties;
};

// Persian digit formatter
const toFa = (n: number) => n.toLocaleString("fa-IR");
const countFor = (cat: string) => {
  const n = PRODUCTS.filter((p) => p.category === cat).length;
  return cat === "عمده‌فروشی" && n === 0 ? "تماس بگیرید" : `${toFa(n)} محصول`;
};

const CATS: Cat[] = [
  {
    name: "زعفران نگین",
    category: "زعفران نگین",
    area: "b",
    img: saffronNegin,
    pos: "center 55%",
    scrim: "linear-gradient(0deg, rgba(0,0,0,0) 35%, rgba(42,26,10,0.7) 100%)",
    labelStyle: { top: "1rem", right: "1.25rem", textAlign: "right" },
  },
  {
    name: "زعفران دسته",
    category: "زعفران دسته",
    area: "c",
    img: saffronPushal,
    pos: "center 45%",
    scrim: "linear-gradient(270deg, rgba(0,0,0,0) 40%, rgba(42,26,10,0.7) 100%)",
    labelStyle: { bottom: "1rem", left: "1.25rem", textAlign: "left" },
  },
  {
    name: "زعفران نرمه",
    category: "زعفران نرمه",
    area: "d",
    img: saffronPowder,
    pos: "center 50%",
    scrim: "linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(42,26,10,0.75) 100%)",
    labelStyle: { bottom: "1rem", left: "50%", transform: "translateX(-50%)", textAlign: "center" },
  },
  {
    name: "عمده‌فروشی",
    category: "عمده‌فروشی",
    area: "f",
    img: wholesale,
    pos: "center 50%",
    scrim: "linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(42,26,10,0.78) 100%)",
    labelStyle: { bottom: "1.25rem", right: "1.25rem", textAlign: "right" },
  },
  {
    name: "خشکبار",
    category: "خشکبار",
    area: "g",
    img: driedFruits,
    pos: "center 50%",
    scrim: "linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(42,26,10,0.78) 100%)",
    labelStyle: { bottom: "1.25rem", left: "1.25rem", textAlign: "left" },
  },
];

export function CategoryGrid() {
  return (
    <section style={{ padding: "3.5rem 1rem", background: "#f5ede0" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        <div
          style={{
            display: "grid",
            gap: "0.85rem",
            gridTemplateColumns: "repeat(2, 1fr)",
            gridTemplateAreas: `
              "b c"
              "d f"
              "g g"
            `,
          }}
          className="cat-grid"
        >
          {CATS.map((c) => (
            <Link
              to="/shop"
              search={{ category: c.category }}
              key={c.area}
              style={{
                gridArea: c.area,
                position: "relative",
                display: "block",
                borderRadius: "1rem",
                overflow: "hidden",
                minHeight: c.area === "f" ? "240px" : "200px",
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
                  {countFor(c.category)}
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
              "b b c d"
              "f f g g" !important;
          }
        }
      `}</style>
    </section>
  );
}
