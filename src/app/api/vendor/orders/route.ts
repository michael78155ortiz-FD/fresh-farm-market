import { NextRequest, NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

async function getVendorIdByToken(token: string) {
  const s = supabaseService();
  const { data, error } = await s
    .from("vendors")
    .select("id, approved_application_id")
    .eq("onboarding_token", token)
    .maybeSingle();
  if (error) throw error;
  if (!data || !data.approved_application_id) return null;
  return data.id as string;
}

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token") ?? "";
    if (!token) return NextResponse.json({ ok: false, error: "Missing token" }, { status: 400 });

    const vendorId = await getVendorIdByToken(token);
    if (!vendorId) return NextResponse.json({ ok: false, error: "Vendor not active/valid" }, { status: 403 });

    const s = supabaseService();
    const { data, error } = await s
      .from("orders")
      .select("id, status, created_at, customer_name, customer_email, customer_phone, customer_address, notes, total_cents, items")
      .eq("vendor_id", vendorId)
      .order("created_at", { ascending: false });
    if (error) throw error;

    return NextResponse.json({ ok: true, data });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message || "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token") ?? "";
    if (!token) return NextResponse.json({ ok: false, error: "Missing token" }, { status: 400 });

    const vendorId = await getVendorIdByToken(token);
    if (!vendorId) return NextResponse.json({ ok: false, error: "Vendor not active/valid" }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const { order_id, status } = body || {};
    if (!order_id || typeof status !== "string") {
      return NextResponse.json({ ok: false, error: "Required: { order_id, status }" }, { status: 400 });
    }

    const s = supabaseService();
    const { data, error } = await s
      .from("orders")
      .update({ status })
      .eq("id", order_id)
      .eq("vendor_id", vendorId)
      .select("id, status, created_at, total_cents")
      .maybeSingle();
    if (error) throw error;
    if (!data) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });

    return NextResponse.json({ ok: true, data });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message || "Server error" }, { status: 500 });
  }
}
