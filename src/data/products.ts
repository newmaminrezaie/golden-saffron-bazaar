import productP1 from "@/assets/product-p1.jpg";
import productP2 from "@/assets/product-p2.png";
import productP3 from "@/assets/product-p3.jpg";
import productP4 from "@/assets/product-p4.jpeg";

export type Product = {
  id: string;
  name: string;
  category: string;
  weight: string;
  price: number; // تومان
  oldPrice?: number;
  image: string;
  badge?: string;
};

export const CATEGORIES = [
  "همه",
  "زعفران سرگل",
  "زعفران نگین",
  "زعفران پوشال",
  "پودر زعفران",
  "بسته‌های هدیه",
  "عمده‌فروشی",
] as const;

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "زعفران سرگل ممتاز",
    category: "زعفران سرگل",
    weight: "۱ مثقال (۴.۶ گرم)",
    price: 1280000,
    oldPrice: 1450000,
    image: productP1,
    badge: "پرفروش",
  },
  {
    id: "p2",
    name: "زعفران نگین درجه یک",
    category: "زعفران نگین",
    weight: "۲ گرم",
    price: 720000,
    image: productP2,
  },
  {
    id: "p3",
    name: "زعفران پوشال ممتاز",
    category: "زعفران پوشال",
    weight: "۴.۶ گرم",
    price: 980000,
    image: productP3,
  },
  {
    id: "p4",
    name: "زعفران کادویی ظرف چوبی",
    category: "پودر زعفران",
    weight: "۱ گرم",
    price: 320000,
    image: productP4,
    badge: "جدید",
  },
  {
    id: "p5",
    name: "جعبه هدیه چوبی زعفران",
    category: "بسته‌های هدیه",
    weight: "۴.۶ گرم",
    price: 1850000,
    image:
      "https://images.unsplash.com/photo-1608797178974-15b35a64ede9?auto=format&fit=crop&w=800&q=80",
    badge: "پیشنهاد ویژه",
  },
  {
    id: "p6",
    name: "زعفران سرگل ۱ گرمی",
    category: "زعفران سرگل",
    weight: "۱ گرم",
    price: 290000,
    image:
      "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "p7",
    name: "زعفران نگین ۴.۶ گرمی",
    category: "زعفران نگین",
    weight: "۱ مثقال",
    price: 1380000,
    oldPrice: 1500000,
    image:
      "https://images.unsplash.com/photo-1600326145552-327c4df2c246?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "p8",
    name: "بسته خانوار زعفران",
    category: "بسته‌های هدیه",
    weight: "۹.۲ گرم",
    price: 2680000,
    image:
      "https://images.unsplash.com/photo-1593411739928-b71fea83f7ef?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "p9",
    name: "پودر زعفران ۲ گرمی",
    category: "پودر زعفران",
    weight: "۲ گرم",
    price: 610000,
    image:
      "https://images.unsplash.com/photo-1606756790138-261d2b21cd75?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "p10",
    name: "زعفران پوشال ۲ گرمی",
    category: "زعفران پوشال",
    weight: "۲ گرم",
    price: 480000,
    image:
      "https://images.unsplash.com/photo-1542990253-0b8be07d56c3?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "p11",
    name: "زعفران فله عمده",
    category: "عمده‌فروشی",
    weight: "۱۰۰ گرم",
    price: 28500000,
    image:
      "https://images.unsplash.com/photo-1615485925600-97237c4fc1ec?auto=format&fit=crop&w=800&q=80",
    badge: "عمده",
  },
  {
    id: "p12",
    name: "جعبه نفیس زعفران",
    category: "بسته‌های هدیه",
    weight: "۲ مثقال",
    price: 3200000,
    image:
      "https://images.unsplash.com/photo-1571197119282-7c4b1a44b3a3?auto=format&fit=crop&w=800&q=80",
  },
];

export const formatToman = (n: number) =>
  new Intl.NumberFormat("fa-IR").format(n) + " تومان";
