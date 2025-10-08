import { NextRequest, NextResponse } from "next/server";
import { supabaseService } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const v = req.nextUrl.searchParams.get("v");
    const s = supabaseService();

    if (v === "vendors") {
      const { data, error } = await s.from("vendors").select("id, name, onboarding_token").order("created_at", { ascending: false });
      if (error) throw error;
      return NextResponse.json({ ok: true, data });
    }

    if (v === "products") {
      const { data, error } = await s.from("products").select("id, vendor_id, name, price_cents, active").order("created_at", { ascending: false });
      if (error) throw error;
      return NextResponse.json({ ok: true, data });
    }

    return NextResponse.json({ ok: true, data: [] });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message || "Server error" }, { status: 500 });
  }
}
