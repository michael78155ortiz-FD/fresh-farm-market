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
      .from("products")
      .select("id, name, price_cents, active, created_at, updated_at")
      .eq("vendor_id", vendorId)
      .order("created_at", { ascending: false });
    if (error) throw error;

    return NextResponse.json({ ok: true, data });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message || "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token") ?? "";
    if (!token) return NextResponse.json({ ok: false, error: "Missing token" }, { status: 400 });

    const vendorId = await getVendorIdByToken(token);
    if (!vendorId) return NextResponse.json({ ok: false, error: "Vendor not active/valid" }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const { name, price_cents, active = true } = body || {};
    if (!name || typeof price_cents !== "number") {
      return NextResponse.json({ ok: false, error: "Required: { name, price_cents }" }, { status: 400 });
    }

    const s = supabaseService();
    const { data, error } = await s
      .from("products")
      .insert([{ vendor_id: vendorId, name, price_cents, active }])
      .select("id, name, price_cents, active, created_at, updated_at")
      .single();
    if (error) throw error;

    return NextResponse.json({ ok: true, data }, { status: 201 });
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
    const { id, name, price_cents, active } = body || {};
    if (!id) return NextResponse.json({ ok: false, error: "Required: { id }" }, { status: 400 });

    const updates: Record<string, any> = {};
    if (typeof name === "string") updates.name = name;
    if (typeof price_cents === "number") updates.price_cents = price_cents;
    if (typeof active === "boolean") updates.active = active;
    if (!Object.keys(updates).length) {
      return NextResponse.json({ ok: false, error: "No fields to update" }, { status: 400 });
    }

    const s = supabaseService();
    const { data, error } = await s
      .from("products")
      .update(updates)
      .eq("id", id)
      .eq("vendor_id", vendorId)
      .select("id, name, price_cents, active, created_at, updated_at")
      .maybeSingle();
    if (error) throw error;
    if (!data) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });

    return NextResponse.json({ ok: true, data });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message || "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token") ?? "";
    if (!token) return NextResponse.json({ ok: false, error: "Missing token" }, { status: 400 });

    const vendorId = await getVendorIdByToken(token);
    if (!vendorId) return NextResponse.json({ ok: false, error: "Vendor not active/valid" }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const { id } = body || {};
    if (!id) return NextResponse.json({ ok: false, error: "Required: { id }" }, { status: 400 });

    const s = supabaseService();
    const { error } = await s.from("products").delete().eq("id", id).eq("vendor_id", vendorId);
    if (error) throw error;

    return NextResponse.json({ ok: true, deleted: id });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message || "Server error" }, { status: 500 });
  }
}
