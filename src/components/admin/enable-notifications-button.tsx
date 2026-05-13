import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

type Props = { adminToken: string };

type State =
  | "checking"
  | "unsupported"
  | "preview"
  | "needs-permission"
  | "denied"
  | "enabled";

const SW_URL = "/sw.js";

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const buf = new ArrayBuffer(raw.length);
  const out = new Uint8Array(buf);
  for (let i = 0; i < raw.length; ++i) out[i] = raw.charCodeAt(i);
  return out;
}

function isInPreview(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const inIframe = window.self !== window.top;
    const host = window.location.hostname;
    const isLovable =
      host.includes("lovable.app") ||
      host.includes("lovableproject.com") ||
      host.includes("id-preview--");
    return inIframe || isLovable;
  } catch {
    return true;
  }
}

export function EnableNotificationsButton({ adminToken }: Props) {
  const [state, setState] = useState<State>("checking");
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    if (typeof window === "undefined") return;
    if (isInPreview()) {
      setState("preview");
      return;
    }
    if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
      setState("unsupported");
      return;
    }
    if (Notification.permission === "denied") {
      setState("denied");
      return;
    }
    try {
      const reg = await navigator.serviceWorker.getRegistration(SW_URL);
      const sub = reg ? await reg.pushManager.getSubscription() : null;
      if (sub && Notification.permission === "granted") setState("enabled");
      else setState("needs-permission");
    } catch {
      setState("needs-permission");
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const enable = useCallback(async () => {
    setBusy(true);
    try {
      // 1. fetch VAPID key
      const keyRes = await fetch("/api/admin/push/public-key");
      const keyJson = await keyRes.json();
      if (!keyRes.ok || !keyJson.ok || !keyJson.publicKey) {
        throw new Error("کلید VAPID روی سرور تنظیم نشده است");
      }
      // 2. register SW
      const reg = await navigator.serviceWorker.register(SW_URL);
      await navigator.serviceWorker.ready;
      // 3. permission
      const perm = await Notification.requestPermission();
      if (perm !== "granted") {
        toast.error("اجازه اعلان داده نشد");
        await refresh();
        return;
      }
      // 4. subscribe
      let sub = await reg.pushManager.getSubscription();
      if (!sub) {
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(keyJson.publicKey),
        });
      }
      // 5. send to server
      const r = await fetch("/api/admin/push/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": adminToken,
        },
        body: JSON.stringify(sub.toJSON()),
      });
      const j = await r.json();
      if (!r.ok || !j.ok) throw new Error(j.error || `HTTP ${r.status}`);
      toast.success("اعلان‌ها فعال شد");
      setState("enabled");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "خطای ناشناخته";
      toast.error(`فعال‌سازی اعلان‌ها ناموفق بود: ${msg}`);
    } finally {
      setBusy(false);
    }
  }, [adminToken, refresh]);

  const disable = useCallback(async () => {
    setBusy(true);
    try {
      const reg = await navigator.serviceWorker.getRegistration(SW_URL);
      const sub = reg ? await reg.pushManager.getSubscription() : null;
      if (sub) {
        await fetch("/api/admin/push/unsubscribe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-token": adminToken,
          },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        }).catch(() => {});
        await sub.unsubscribe();
      }
      toast.success("اعلان‌ها غیرفعال شد");
      setState("needs-permission");
    } catch (e) {
      toast.error("خطا در غیرفعال‌سازی");
    } finally {
      setBusy(false);
    }
  }, [adminToken]);

  const sendTest = useCallback(async () => {
    setBusy(true);
    try {
      const r = await fetch("/api/admin/push/test", {
        method: "POST",
        headers: { "x-admin-token": adminToken },
      });
      const j = await r.json();
      if (!r.ok || !j.ok) throw new Error(j.error || `HTTP ${r.status}`);
      toast.success(`اعلان آزمایشی به ${j.sent} دستگاه ارسال شد`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "خطا";
      toast.error(`ارسال اعلان تست ناموفق: ${msg}`);
    } finally {
      setBusy(false);
    }
  }, [adminToken]);

  const baseBtn =
    "rounded-md border bg-card px-3 py-1.5 text-sm hover:bg-accent disabled:opacity-50";

  if (state === "checking") {
    return <span className="text-xs text-muted-foreground">…</span>;
  }
  if (state === "preview") {
    return (
      <span className="text-xs text-muted-foreground">
        🔔 اعلان‌ها فقط روی دامنه اصلی کار می‌کنند
      </span>
    );
  }
  if (state === "unsupported") {
    return (
      <span className="text-xs text-muted-foreground">
        🔔 مرورگر شما اعلان پوش را پشتیبانی نمی‌کند
      </span>
    );
  }
  if (state === "denied") {
    return (
      <span className="text-xs text-red-700">
        🔔 اجازه اعلان مسدود شده — از تنظیمات مرورگر سایت را اجازه دهید
      </span>
    );
  }
  if (state === "enabled") {
    return (
      <div className="flex items-center gap-2">
        <span className="rounded-full border border-emerald-300 bg-emerald-50 px-2 py-0.5 text-xs text-emerald-800">
          🔔 اعلان‌ها فعال
        </span>
        <button onClick={sendTest} disabled={busy} className={baseBtn}>
          ارسال اعلان تست
        </button>
        <button onClick={disable} disabled={busy} className={baseBtn}>
          غیرفعال‌سازی
        </button>
      </div>
    );
  }
  return (
    <button onClick={enable} disabled={busy} className={baseBtn}>
      🔔 {busy ? "در حال فعال‌سازی…" : "فعال‌سازی اعلان‌های سفارش جدید"}
    </button>
  );
}
