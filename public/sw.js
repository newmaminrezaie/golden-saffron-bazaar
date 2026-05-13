/* Khajavi Saffron — admin push service worker */
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { title: "سفارش جدید", body: event.data ? event.data.text() : "" };
  }
  const title = data.title || "سفارش جدید";
  const options = {
    body: data.body || "",
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    tag: data.tag || "khajavi-order",
    renotify: true,
    requireInteraction: true,
    vibrate: [200, 100, 200],
    data: { url: data.url || "/admin/orders", orderId: data.orderId || null },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "/admin/orders";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((winList) => {
      for (const client of winList) {
        try {
          const u = new URL(client.url);
          if (u.pathname.startsWith("/admin/orders") && "focus" in client) {
            return client.focus();
          }
        } catch (e) {}
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
