// src/app/api/market/products/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const vendorId = searchParams.get("vendor_id");

    let query = supabase
      .from("products")
      .select("id,name,price_cents,inventory,image_url,vendor_id,is_active")
      .eq("is_active", true)
      .order("name", { ascending: true });

    if (vendorId) query = query.eq("vendor_id", vendorId);

    const { data, error } = await query;

    if (error) {
      console.error("Supabase products load error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data ?? []);
  } catch (e: any) {
    console.error("products route crash:", e);
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}
