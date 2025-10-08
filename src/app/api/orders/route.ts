// src/app/api/orders/route.ts
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

type ItemIn = {
  product_id: string;
  vendor_id?: string; // ok if present; we use top-level vendor_id
  qty: number;
  unit?: string | null;
  price_cents: number;
  name?: string; // snapshot
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      vendor_id,
      customer_name,
      customer_email,
      customer_phone,
      customer_address,
      notes,
      items,
    }: {
      vendor_id: string;
      customer_name?: string | null;
      customer_email?: string | null;
      customer_phone?: string | null;
      customer_address?: string | null;
      notes?: string | null;
      items: ItemIn[];
    } = body;

    if (!vendor_id) {
      return NextResponse.json({ ok: false, error: "vendor_id required" }, { status: 400 });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ ok: false, error: "items required" }, { status: 400 });
    }

    const total_cents = items.reduce((sum, i) => sum + (i.price_cents ?? 0) * (i.qty ?? 0), 0);

    // Create admin client lazily at runtime (prevents build-time crashes)
    const supa = getSupabaseAdmin();

    // Insert order
    const { data: orderRow, error: orderErr } = await supa
      .from("orders")
      .insert([
        {
          vendor_id,
          status: "received",
          customer_name: customer_name ?? null,
          customer_email: customer_email ?? null,
          customer_phone: customer_phone ?? null,
          customer_address: customer_address ?? null,
          notes: notes ?? null,
          total_cents,
        },
      ])
      .select("id")
      .single();

    if (orderErr || !orderRow) {
      return NextResponse.json(
        { ok: false, error: orderErr?.message || "Order insert failed" },
        { status: 500 }
      );
    }

    const order_id = orderRow.id as string;

    // Insert items (snapshot name to name_snapshot)
    const itemsPayload = items.map((i) => ({
      order_id,
      product_id: i.product_id,
      qty: i.qty ?? 1,
      unit: i.unit ?? null,
      price_cents: i.price_cents ?? 0,
      name_snapshot: i.name ?? null,
    }));

    const { error: itemsErr } = await supa.from("order_items").insert(itemsPayload);

    if (itemsErr) {
      return NextResponse.json(
        { ok: false, error: itemsErr.message || "Order items insert failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, data: { id: order_id } }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Server error" },
      { status: 500 }
    );
  }
}
