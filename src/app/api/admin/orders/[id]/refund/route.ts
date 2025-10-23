// src/app/api/admin/orders/[id]/refund/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

// Tell Next.js this is a dynamic route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data: order, error } = await supabase
      .from("orders")
      .select("id, stripe_session_id, payment_intent_id, status, line_items")
      .eq("id", id)
      .single();

    if (error || !order) {
      return NextResponse.json({ ok: false, error: "Order not found" }, { status: 404 });
    }

    let piId: string | null = order.payment_intent_id;
    if (!piId && order.stripe_session_id) {
      const session = await stripe.checkout.sessions.retrieve(order.stripe_session_id);
      if (typeof session.payment_intent === "string") {
        piId = session.payment_intent;
      } else if (session.payment_intent?.id) {
        piId = session.payment_intent.id;
      }
    }

    if (!piId) {
      return NextResponse.json(
        { ok: false, error: "No payment_intent found for this order" },
        { status: 400 }
      );
    }

    const refund = await stripe.refunds.create({ payment_intent: piId });

    const items: Array<{ product_id?: string | null; quantity?: number | null }> = order.line_items || [];
    for (const li of items) {
      const pid = li.product_id;
      const qty = li.quantity || 0;
      if (!pid || !qty) continue;
      const { error: upErr } = await supabase.rpc("increment_inventory", {
        p_product_id: pid,
        p_qty: qty,
      });
      if (upErr) {
        console.error("Restock RPC failed (increment_inventory)", upErr);
      }
    }

    await supabase
      .from("orders")
      .update({ status: "refunded", refund_id: refund.id, refunded_at: new Date().toISOString() })
      .eq("id", order.id);

    return NextResponse.json({ ok: true, refund_id: refund.id });
  } catch (e: any) {
    console.error("Refund error:", e);
    return NextResponse.json(
      { ok: false, error: e?.message || "Refund failed" },
      { status: e?.statusCode || 500 }
    );
  }
}
