"use strict";

// Rubika Bot API notifications.
// Docs: https://rubika.ir/  — Bot API base: https://botapi.rubika.ir/v3/{TOKEN}/{method}
// Required env vars:
//   RUBIKA_BOT_TOKEN  — bot token from @BotFather on Rubika
//   RUBIKA_CHAT_ID    — chat_id (or guid) to send messages to (your own user, or a group)
// To find your chat_id: send any message to your bot in Rubika, then call:
//   curl -s -X POST https://botapi.rubika.ir/v3/<TOKEN>/getUpdates -H 'Content-Type: application/json' -d '{}'

const { formatToman } = require("./utils");

const METHOD_LABEL = {
  zibal: "💳 به پرداخت ملت (زیبال)",
  sep: "🏦 درگاه سامان",
  card: "💸 کارت‌به‌کارت",
};

const STATUS_LABEL = {
  paid: "✅ پرداخت موفق",
  failed: "❌ پرداخت ناموفق",
  pending: "⏳ در انتظار پرداخت",
  awaiting_card_confirm: "⏳ در انتظار تأیید کارت‌به‌کارت",
};

function buildMessage(order, eventType) {
  const items = JSON.parse(order.items_json || "[]");
  const itemLines = items
    .map((it) => `• ${it.name} × ${it.qty} — ${formatToman(it.price * it.qty)}`)
    .join("\n");

  return [
    `🔔 ${STATUS_LABEL[eventType] || eventType}`,
    `سفارش: ${order.id}`,
    `روش: ${METHOD_LABEL[order.method] || order.method}`,
    "",
    `مشتری: ${order.customer_name || "-"}`,
    `تلفن: ${order.phone || "-"}`,
    `آدرس: ${order.address || "-"}`,
    order.postal_code ? `کد پستی: ${order.postal_code}` : null,
    order.note ? `یادداشت: ${order.note}` : null,
    "",
    "اقلام:",
    itemLines || "—",
    "",
    `جمع کالاها: ${formatToman(order.subtotal)}`,
    `هزینه پست/بسته‌بندی: ${formatToman(order.shipping)}`,
    `مبلغ کل: ${formatToman(order.total)}`,
    order.gateway_ref ? `کد رهگیری: ${order.gateway_ref}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

async function notifyOrderRubika(order, eventType) {
  const token = process.env.RUBIKA_BOT_TOKEN;
  const chatId = process.env.RUBIKA_CHAT_ID;
  if (!token || !chatId) return; // silently disabled

  try {
    const res = await fetch(`https://botapi.rubika.ir/v3/${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: buildMessage(order, eventType),
      }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.warn("[rubika] non-OK:", res.status, body.slice(0, 200));
    } else {
      const body = await res.json().catch(() => ({}));
      if (body && body.status && body.status !== "OK") {
        console.warn("[rubika] api error:", JSON.stringify(body).slice(0, 200));
      }
    }
  } catch (err) {
    console.warn("[rubika] send failed:", err.message);
  }
}

module.exports = { notifyOrderRubika };
