import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY!;
const from = process.env.FROM_EMAIL || "onboarding@resend.dev";

if (!apiKey) {
  console.warn("⚠️ RESEND_API_KEY missing — email sending disabled.");
}

export type ReceiptLine = {
  name: string;
  quantity: number;
  amount_cents: number;
};

export async function sendOrderReceipt(opts: {
  to: string;
  orderId: string;
  amount_cents: number;
  currency?: string;
  lines?: ReceiptLine[];
}) {
  if (!apiKey) {
    console.log("❌ No Resend API key, skipping email");
    return { sent: false, reason: "no_api_key" };
  }

  const resend = new Resend(apiKey);
  const { to, orderId, amount_cents, currency = "USD", lines = [] } = opts;
  
  const total = (amount_cents / 100).toLocaleString(undefined, {
    style: "currency",
    currency,
  });

  const itemsHtml =
    lines.length === 0
      ? "<p>Order details are being processed.</p>"
      : "<ul style='list-style:none;padding:0'>" +
        lines
          .map(
            (l) =>
              `<li style='padding:8px 0;border-bottom:1px solid #eee'>${l.name} ×${l.quantity} — ${(l.amount_cents / 100).toLocaleString(undefined, {
                style: "currency",
                currency,
              })}</li>`
          )
          .join("") +
        "</ul>";

  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;max-width:540px;margin:24px auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px;background:#fff">
      <h2 style="margin:0 0 16px 0;color:#111">Thanks for your order! 🎉</h2>
      <p style="color:#666;margin:0 0 24px 0">Order <strong>#${orderId.slice(0,8)}</strong> has been received and is being processed.</p>
      ${itemsHtml}
      <div style="margin-top:24px;padding-top:16px;border-top:2px solid #16a34a">
        <p style="font-size:18px;margin:0;color:#111"><strong>Total: ${total}</strong></p>
      </div>
      <p style="color:#999;font-size:13px;margin:24px 0 0 0">Questions? Reply to this email and we'll help you out.</p>
    </div>
  `;

  try {
    const { error } = await resend.emails.send({
      from,
      to,
      subject: `Order Receipt #${orderId.slice(0, 8)} - Fresh Farm Market`,
      html,
    });

    if (error) {
      console.error("❌ Resend error:", error);
      return { sent: false, error };
    }
    
    console.log("✅ Receipt email sent to:", to);
    return { sent: true };
  } catch (e) {
    console.error("❌ Email send failed:", e);
    return { sent: false, error: e };
  }
}
