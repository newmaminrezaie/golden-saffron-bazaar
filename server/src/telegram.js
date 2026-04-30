"use strict";

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
    `<b>${STATUS_LABEL[eventType] || eventType}</b>`,
    `<b>سفارش:</b> <code>${order.id}</code>`,
    `<b>روش:</b> ${METHOD_LABEL[order.method] || order.method}`,
    "",
    `<b>مشتری:</b> ${order.customer_name || "-"}`,
    `<b>تلفن:</b> ${order.phone || "-"}`,
    `<b>آدرس:</b> ${order.address || "-"}`,
    order.postal_code ? `<b>کد پستی:</b> ${order.postal_code}` : null,
    order.note ? `<b>یادداشت:</b> ${order.note}` : null,
    "",
    "<b>اقلام:</b>",
    itemLines || "—",
    "",
    `<b>جمع کالاها:</b> ${formatToman(order.subtotal)}`,
    `<b>هزینه پست/بسته‌بندی:</b> ${formatToman(order.shipping)}`,
    `<b>مبلغ کل:</b> ${formatToman(order.total)}`,
    order.gateway_ref ? `<b>کد رهگیری:</b> <code>${order.gateway_ref}</code>` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

async function notifyOrder(order, eventType) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return; // silently disabled

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: buildMessage(order, eventType),
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.warn("[telegram] non-OK:", res.status, body.slice(0, 200));
    }
  } catch (err) {
    console.warn("[telegram] send failed:", err.message);
  }
}

module.exports = { notifyOrder };
