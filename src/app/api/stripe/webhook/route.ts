// src/app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { sendOrderReceipt } from "@/lib/email";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const sig = req.headers.get("stripe-signature")!;
    const rawBody = await req.text();
    const event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      let paymentIntentId: string | null = null;
      if (typeof session.payment_intent === "string") {
        paymentIntentId = session.payment_intent;
      } else if (session.payment_intent?.id) {
        paymentIntentId = session.payment_intent.id;
      } else {
        const s = await stripe.checkout.sessions.retrieve(session.id);
        if (typeof s.payment_intent === "string") {
          paymentIntentId = s.payment_intent;
        } else if (s.payment_intent?.id) {
          paymentIntentId = s.payment_intent.id;
        }
      }

      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
        limit: 100,
      });
      
      const items = lineItems.data.map((li) => ({
        description: li.description || "",
        quantity: li.quantity || 1,
        unit_amount: li.price?.unit_amount ?? 0,
        currency: (li.currency || session.currency || "USD").toUpperCase(),
      }));

      const currency = (session.currency || "usd").toUpperCase();

      const { data: savedOrder, error } = await supabase
        .from("orders")
        .insert({
          stripe_session_id: session.id,
          payment_intent_id: paymentIntentId,
          amount_total_cents: session.amount_total ?? 0,
          currency,
          customer_email: session.customer_details?.email ?? null,
          line_items: items,
          status: "paid",
        })
        .select()
        .single();

      if (error) {
        console.error("✗ Supabase insert error:", error);
        return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
      }

      console.log("💾 Order saved successfully!");

      try {
        const customerEmail = session.customer_details?.email || session.customer_email;
        
        if (customerEmail) {
          const receiptLines = items.map((item) => ({
            name: item.description || "Item",
            quantity: item.quantity,
            amount_cents: item.unit_amount * item.quantity,
          }));

          await sendOrderReceipt({
            to: customerEmail,
            orderId: savedOrder.id,
            amount_cents: session.amount_total ?? 0,
            currency: currency,
            lines: receiptLines,
          });
          
          console.log("📧 Receipt email sent to:", customerEmail);
        } else {
          console.log("⚠️ No customer email - skipped receipt");
        }
      } catch (emailError) {
        console.error("❌ Email send failed (non-critical):", emailError);
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: any) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 400 });
  }
}
