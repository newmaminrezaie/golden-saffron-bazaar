import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { CATEGORIES, type Product } from "@/data/products";

export const Route = createFileRoute("/admin/products")({
  head: () => ({
    meta: [
      { title: "مدیریت محصولات — زعفران خواجوی" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminProductsPage,
});

const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined)?.replace(/\/$/, "") ?? "";
const TOKEN_KEY = "khajavi_admin_token";

type AdminProduct = Product & { sortOrder?: number };

function emptyProduct(): AdminProduct {
  return {
    id: "",
    slug: "",
    name: "",
    category: "زعفران نگین",
    weight: "",
    price: 0,
    oldPrice: undefined,
    images: [],
    badge: "",
    shortDescription: "",
    description: "",
    highlights: [],
    inStock: true,
    priceTiers: [],
  };
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 100);
}

function fa(n: number) {
  return new Intl.NumberFormat("fa-IR").format(n);
}

function AdminProductsPage() {
  const [token, setToken] = useState<string>("");
  const [tokenInput, setTokenInput] = useState<string>("");
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("همه");
  const [editing, setEditing] = useState<AdminProduct | null>(null);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    const t = typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
    if (t) setToken(t);
  }, []);

  const authHeader = useMemo(() => ({ "x-admin-token": token }), [token]);

  const fetchProducts = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(`${API_BASE}/api/admin/products`, { headers: authHeader });
      const data = await r.json();
      if (!r.ok || !data.ok) {
        if (r.status === 401) {
          setError("توکن نامعتبر است.");
          localStorage.removeItem(TOKEN_KEY);
          setToken("");
          return;
        }
        throw new Error(data.error || `HTTP ${r.status}`);
      }
      setProducts(data.products);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "خطا");
    } finally {
      setLoading(false);
    }
  }, [token, authHeader]);

  useEffect(() => {
    if (token) fetchProducts();
  }, [token, fetchProducts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (categoryFilter !== "همه" && p.category !== categoryFilter) return false;
      if (q && !p.name.toLowerCase().includes(q) && !p.slug.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [products, query, categoryFilter]);

  async function saveProduct(p: AdminProduct) {
    const body = JSON.stringify(p);
    const url = isNew
      ? `${API_BASE}/api/admin/products`
      : `${API_BASE}/api/admin/products/${p.id}`;
    const method = isNew ? "POST" : "PUT";
    const r = await fetch(url, {
      method,
      headers: { ...authHeader, "Content-Type": "application/json" },
      body,
    });
    const data = await r.json();
    if (!r.ok || !data.ok) {
      throw new Error(data.error || `HTTP ${r.status}`);
    }
    return data.product as AdminProduct;
  }

  async function deleteProduct(p: AdminProduct) {
    if (!confirm(`حذف «${p.name}»؟`)) return;
    const r = await fetch(`${API_BASE}/api/admin/products/${p.id}`, {
      method: "DELETE",
      headers: authHeader,
    });
    if (!r.ok) {
      toast.error("حذف ناموفق");
      return;
    }
    toast.success("حذف شد");
    fetchProducts();
  }

  async function toggleStock(p: AdminProduct) {
    try {
      await saveProductRaw({ ...p, inStock: !p.inStock });
      fetchProducts();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "خطا");
    }
  }

  async function saveProductRaw(p: AdminProduct) {
    const r = await fetch(`${API_BASE}/api/admin/products/${p.id}`, {
      method: "PUT",
      headers: { ...authHeader, "Content-Type": "application/json" },
      body: JSON.stringify(p),
    });
    const data = await r.json();
    if (!r.ok || !data.ok) throw new Error(data.error || `HTTP ${r.status}`);
    return data.product as AdminProduct;
  }

  async function duplicateProduct(p: AdminProduct) {
    const copy: AdminProduct = {
      ...p,
      id: "",
      slug: `${p.slug}-copy-${Math.random().toString(36).slice(2, 5)}`,
      name: `${p.name} (کپی)`,
    };
    setEditing(copy);
    setIsNew(true);
  }

  if (!token) {
    return (
      <div dir="rtl" className="min-h-screen flex items-center justify-center bg-background p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const v = tokenInput.trim();
            if (!v) return;
            localStorage.setItem(TOKEN_KEY, v);
            setToken(v);
          }}
          className="w-full max-w-sm space-y-4 rounded-xl border bg-card p-6 shadow-sm"
        >
          <h1 className="text-xl font-bold">ورود مدیر محصولات</h1>
          <p className="text-sm text-muted-foreground">توکن مدیر را وارد کنید.</p>
          <input
            type="password"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="ADMIN_TOKEN"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            autoFocus
          />
          <button className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
            ورود
          </button>
        </form>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">مدیریت محصولات</h1>
            <p className="text-sm text-muted-foreground">
              {fa(products.length)} محصول
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/admin/orders"
              className="rounded-md border bg-card px-3 py-1.5 text-sm hover:bg-accent"
            >
              سفارش‌ها →
            </Link>
            <button
              onClick={() => {
                setEditing(emptyProduct());
                setIsNew(true);
              }}
              className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              + محصول جدید
            </button>
            <button
              onClick={fetchProducts}
              disabled={loading}
              className="rounded-md border bg-card px-3 py-1.5 text-sm hover:bg-accent disabled:opacity-50"
            >
              {loading ? "…" : "بروزرسانی"}
            </button>
            <button
              onClick={() => {
                localStorage.removeItem(TOKEN_KEY);
                setToken("");
              }}
              className="rounded-md border bg-card px-3 py-1.5 text-sm hover:bg-accent"
            >
              خروج
            </button>
          </div>
        </header>

        <div className="flex flex-wrap gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجو در نام یا اسلاگ…"
            className="flex-1 min-w-[200px] rounded-md border bg-card px-3 py-2 text-sm"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-md border bg-card px-3 py-2 text-sm"
          >
            <option value="همه">همه دسته‌ها</option>
            {CATEGORIES.filter((c) => c !== "همه").map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800">
            {error}
          </div>
        )}

        <div className="overflow-x-auto rounded-xl border bg-card">
          <table className="w-full text-right text-sm">
            <thead className="bg-muted/50 text-xs uppercase">
              <tr>
                <th className="px-3 py-2 w-16">عکس</th>
                <th className="px-3 py-2">نام</th>
                <th className="px-3 py-2">دسته</th>
                <th className="px-3 py-2">قیمت</th>
                <th className="px-3 py-2">موجود</th>
                <th className="px-3 py-2">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center text-muted-foreground">
                    محصولی یافت نشد.
                  </td>
                </tr>
              )}
              {filtered.map((p) => (
                <tr key={p.id} className="border-t hover:bg-accent/40">
                  <td className="px-3 py-2">
                    {p.images[0] ? (
                      <img
                        src={p.images[0]}
                        alt=""
                        className="h-12 w-12 rounded-md object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-md bg-muted" />
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <div className="font-medium">{p.name}</div>
                    <div className="font-mono text-xs text-muted-foreground">{p.slug}</div>
                  </td>
                  <td className="px-3 py-2 text-xs">{p.category}</td>
                  <td className="px-3 py-2 whitespace-nowrap font-mono text-xs">
                    {fa(p.price)}
                  </td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => toggleStock(p)}
                      className={`rounded-full border px-2 py-0.5 text-xs ${
                        p.inStock !== false
                          ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                          : "border-red-300 bg-red-50 text-red-800"
                      }`}
                    >
                      {p.inStock !== false ? "موجود" : "ناموجود"}
                    </button>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-1">
                      <button
                        onClick={() => {
                          setEditing(p);
                          setIsNew(false);
                        }}
                        className="rounded border px-2 py-0.5 text-xs hover:bg-accent"
                      >
                        ویرایش
                      </button>
                      <a
                        href={`/shop/${p.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded border px-2 py-0.5 text-xs hover:bg-accent"
                      >
                        نمایش
                      </a>
                      <button
                        onClick={() => duplicateProduct(p)}
                        className="rounded border px-2 py-0.5 text-xs hover:bg-accent"
                      >
                        کپی
                      </button>
                      <button
                        onClick={() => deleteProduct(p)}
                        className="rounded border border-red-300 px-2 py-0.5 text-xs text-red-700 hover:bg-red-50"
                      >
                        حذف
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editing && (
        <ProductEditor
          initial={editing}
          isNew={isNew}
          token={token}
          onClose={() => setEditing(null)}
          onSaved={async (p) => {
            try {
              await saveProduct(p);
              toast.success(isNew ? "محصول ایجاد شد" : "ذخیره شد");
              setEditing(null);
              fetchProducts();
            } catch (e) {
              toast.error(e instanceof Error ? e.message : "خطا در ذخیره");
            }
          }}
        />
      )}
    </div>
  );
}

// ----------------- Editor Modal -----------------

function ProductEditor({
  initial,
  isNew,
  token,
  onClose,
  onSaved,
}: {
  initial: AdminProduct;
  isNew: boolean;
  token: string;
  onClose: () => void;
  onSaved: (p: AdminProduct) => void | Promise<void>;
}) {
  const [p, setP] = useState<AdminProduct>(initial);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function patch<K extends keyof AdminProduct>(k: K, v: AdminProduct[K]) {
    setP((prev) => ({ ...prev, [k]: v }));
  }

  async function uploadFiles(files: FileList) {
    const fd = new FormData();
    for (let i = 0; i < files.length && i < 8; i++) fd.append("files", files[i]);
    setUploading(true);
    try {
      const r = await fetch(`${API_BASE}/api/admin/uploads`, {
        method: "POST",
        headers: { "x-admin-token": token },
        body: fd,
      });
      const data = await r.json();
      if (!r.ok || !data.ok) throw new Error(data.error || `HTTP ${r.status}`);
      const newUrls = (data.files as { url: string }[]).map((f) => f.url);
      patch("images", [...(p.images || []), ...newUrls]);
      toast.success(`${newUrls.length} عکس آپلود شد`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "خطا در آپلود");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function moveImage(from: number, to: number) {
    const arr = [...(p.images || [])];
    if (to < 0 || to >= arr.length) return;
    const [m] = arr.splice(from, 1);
    arr.splice(to, 0, m);
    patch("images", arr);
  }

  function removeImage(i: number) {
    patch("images", (p.images || []).filter((_, idx) => idx !== i));
  }

  function updateHighlight(i: number, v: string) {
    const arr = [...(p.highlights || [])];
    arr[i] = v;
    patch("highlights", arr);
  }

  function updateTier(i: number, key: "quantity" | "price" | "label", v: string) {
    const arr = [...(p.priceTiers || [])];
    const t = { ...arr[i] };
    if (key === "label") t.label = v;
    else t[key] = Number(v) || 0;
    arr[i] = t;
    patch("priceTiers", arr);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-stretch justify-end bg-black/40"
      onClick={onClose}
    >
      <div
        dir="rtl"
        className="h-full w-full max-w-2xl overflow-y-auto bg-background p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">{isNew ? "محصول جدید" : "ویرایش محصول"}</h2>
          <button onClick={onClose} className="rounded-md border px-3 py-1 text-sm hover:bg-accent">
            بستن
          </button>
        </div>

        <div className="space-y-4">
          <Field label="نام">
            <input
              value={p.name}
              onChange={(e) => {
                const name = e.target.value;
                setP((prev) => ({
                  ...prev,
                  name,
                  slug: isNew && !prev.slug ? slugify(name) : prev.slug,
                }));
              }}
              className="input"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="اسلاگ (URL)">
              <input
                value={p.slug}
                onChange={(e) => patch("slug", slugify(e.target.value))}
                className="input font-mono text-xs"
                dir="ltr"
              />
            </Field>
            <Field label="دسته">
              <select
                value={p.category}
                onChange={(e) => patch("category", e.target.value)}
                className="input"
              >
                {CATEGORIES.filter((c) => c !== "همه").map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Field label="وزن">
              <input
                value={p.weight}
                onChange={(e) => patch("weight", e.target.value)}
                className="input"
              />
            </Field>
            <Field label="قیمت (تومان)">
              <input
                type="number"
                value={p.price}
                onChange={(e) => patch("price", Number(e.target.value) || 0)}
                className="input"
              />
            </Field>
            <Field label="قیمت قبلی">
              <input
                type="number"
                value={p.oldPrice ?? ""}
                onChange={(e) =>
                  patch("oldPrice", e.target.value ? Number(e.target.value) : undefined)
                }
                className="input"
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="نشان (badge)">
              <input
                value={p.badge ?? ""}
                onChange={(e) => patch("badge", e.target.value)}
                className="input"
                placeholder="مثلاً: پرفروش"
              />
            </Field>
            <Field label="موجودی">
              <select
                value={p.inStock === false ? "no" : "yes"}
                onChange={(e) => patch("inStock", e.target.value === "yes")}
                className="input"
              >
                <option value="yes">موجود</option>
                <option value="no">ناموجود</option>
              </select>
            </Field>
          </div>

          <Field label="توضیح کوتاه">
            <textarea
              value={p.shortDescription ?? ""}
              onChange={(e) => patch("shortDescription", e.target.value)}
              className="input min-h-[60px]"
            />
          </Field>

          <Field label="توضیح کامل">
            <textarea
              value={p.description ?? ""}
              onChange={(e) => patch("description", e.target.value)}
              className="input min-h-[140px]"
            />
          </Field>

          {/* Highlights */}
          <Field label="ویژگی‌ها">
            <div className="space-y-2">
              {(p.highlights || []).map((h, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={h}
                    onChange={(e) => updateHighlight(i, e.target.value)}
                    className="input flex-1"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      patch("highlights", (p.highlights || []).filter((_, idx) => idx !== i))
                    }
                    className="rounded border px-2 text-xs hover:bg-accent"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => patch("highlights", [...(p.highlights || []), ""])}
                className="rounded border px-3 py-1 text-xs hover:bg-accent"
              >
                + افزودن ویژگی
              </button>
            </div>
          </Field>

          {/* Price tiers */}
          <Field label="قیمت‌گذاری حجمی (priceTiers)">
            <div className="space-y-2">
              {(p.priceTiers || []).map((t, i) => (
                <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2">
                  <input
                    type="number"
                    placeholder="تعداد"
                    value={t.quantity}
                    onChange={(e) => updateTier(i, "quantity", e.target.value)}
                    className="input"
                  />
                  <input
                    type="number"
                    placeholder="قیمت کل"
                    value={t.price}
                    onChange={(e) => updateTier(i, "price", e.target.value)}
                    className="input"
                  />
                  <input
                    placeholder="برچسب (اختیاری)"
                    value={t.label ?? ""}
                    onChange={(e) => updateTier(i, "label", e.target.value)}
                    className="input"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      patch("priceTiers", (p.priceTiers || []).filter((_, idx) => idx !== i))
                    }
                    className="rounded border px-2 text-xs hover:bg-accent"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  patch("priceTiers", [
                    ...(p.priceTiers || []),
                    { quantity: 1, price: p.price },
                  ])
                }
                className="rounded border px-3 py-1 text-xs hover:bg-accent"
              >
                + افزودن سطح قیمت
              </button>
              {p.priceTiers && p.priceTiers.length > 0 && p.priceTiers[0].price !== p.price && (
                <p className="text-xs text-amber-700">
                  ⚠ قیمت سطح اول باید برابر «قیمت» اصلی باشد.
                </p>
              )}
            </div>
          </Field>

          {/* Images */}
          <Field label="عکس‌ها (اولین عکس = جلد)">
            <div className="space-y-2">
              <div className="grid grid-cols-3 gap-2">
                {(p.images || []).map((src, i) => (
                  <div key={i} className="relative rounded-md border overflow-hidden bg-muted">
                    <img src={src} alt="" className="h-24 w-full object-cover" />
                    <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/60 p-1 text-[10px] text-white">
                      <button type="button" onClick={() => moveImage(i, i - 1)}>
                        →
                      </button>
                      <span>{i === 0 ? "جلد" : `#${i + 1}`}</span>
                      <button type="button" onClick={() => moveImage(i, i + 1)}>
                        ←
                      </button>
                      <button type="button" onClick={() => removeImage(i)}>
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <input
                ref={fileRef}
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => e.target.files && uploadFiles(e.target.files)}
                className="text-xs"
              />
              <div className="text-xs text-muted-foreground">
                {uploading ? "در حال آپلود…" : "یا یک URL مستقیم اضافه کنید:"}
              </div>
              <div className="flex gap-2">
                <input
                  placeholder="/images/example.webp"
                  className="input flex-1"
                  dir="ltr"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const v = (e.target as HTMLInputElement).value.trim();
                      if (v) {
                        patch("images", [...(p.images || []), v]);
                        (e.target as HTMLInputElement).value = "";
                      }
                    }
                  }}
                />
              </div>
            </div>
          </Field>

          <div className="sticky bottom-0 -mx-6 -mb-6 flex items-center justify-end gap-2 border-t bg-background p-4">
            <button
              onClick={onClose}
              className="rounded-md border px-4 py-2 text-sm hover:bg-accent"
            >
              انصراف
            </button>
            <button
              onClick={() => onSaved(p)}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              ذخیره
            </button>
          </div>
        </div>

        <style>{`.input{width:100%;border:1px solid hsl(var(--border));background:hsl(var(--background));border-radius:0.375rem;padding:0.5rem 0.75rem;font-size:0.875rem}.input:focus{outline:1px solid hsl(var(--ring))}`}</style>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold text-foreground/80">{label}</span>
      {children}
    </label>
  );
}
