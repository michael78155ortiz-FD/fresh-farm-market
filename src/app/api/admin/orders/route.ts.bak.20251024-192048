// src/app/api/admin/orders/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const supabase = await supabaseServer();

    const { data, error } = await supabase
      .from("orders")
      .select(
        [
          "id",
          "stripe_session_id",
          "payment_intent_id",
          "amount_total_cents",
          "currency",
          "customer_email",
          "line_items",
          "status",
          "created_at",
        ].join(",")
      )
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) throw error;

    return NextResponse.json({ orders: data ?? [] });
  } catch (e: any) {
    console.error("admin/orders error:", e);
    return NextResponse.json(
      { error: e?.message || "Failed to load orders" },
      { status: 500 }
    );
  }
}