import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getAdminSupabase } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    const supabase = getAdminSupabase();

    if (!stripeKey || !supabase) {
      return NextResponse.json(
        { ok: false, error: "Server configuration error" },
        { status: 500 }
      );
    }

    const stripe = new Stripe(stripeKey);
    const { id } = await params;

    const { data: order, error } = await supabase
      .from("orders")
      .select("id, stripe_session_id, payment_intent_id, status, line_items")
      .eq("id", id)
      .single();

    if (error || !order) {
      return NextResponse.json({ ok: false, error: "Order not found" }, { status: 404 });
    }

    // Resolve the payment intent
    let piId: string | null = order.payment_intent_id;
    if (!piId && order.stripe_session_id) {
      const session = await stripe.checkout.sessions.retrieve(order.stripe_session_id);
      const pi = session.payment_intent;
      if (typeof pi === "string") piId = pi;
      else if (pi && typeof pi === "object" && "id" in pi) piId = (pi as any).id;
    }

    if (!piId) {
      return NextResponse.json(
        { ok: false, error: "No payment_intent found for this order" },
        { status: 400 }
      );
    }

    const refund = await stripe.refunds.create({ payment_intent: piId });

    // Restock inventory best-effort
    const items: Array<{ product_id?: string | null; quantity?: number | null }> = order.line_items || [];
    for (const li of items) {
      const pid = li.product_id;
      const qty = li.quantity || 0;
      if (!pid || !qty) continue;
      const { error: upErr } = await supabase.rpc("increment_inventory", {
        p_product_id: pid,
        p_qty: qty,
      });
      if (upErr) console.error("Restock RPC failed (increment_inventory)", upErr);
    }

    const { error: updErr } = await supabase
      .from("orders")
      .update({ status: "refunded", refund_id: refund.id, refunded_at: new Date().toISOString() })
      .eq("id", order.id);

    if (updErr) {
      return NextResponse.json({ ok: false, error: "Update failed" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, refund_id: refund.id });
  } catch (e: any) {
    console.error("Refund error:", e);
    return NextResponse.json(
      { ok: false, error: e?.message || "Refund failed" },
      { status: e?.statusCode || 500 }
    );
  }
}
