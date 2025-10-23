import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = getAdminSupabase();
    if (!supabase) {
      return NextResponse.json(
        { ok: false, error: "Server configuration error" },
        { status: 500 }
      );
    }

    const { id } = await params;

    const { data: order, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !order) {
      return NextResponse.json({ ok: false, error: "Order not found" }, { status: 404 });
    }

    const { error: updErr } = await supabase
      .from("orders")
      .update({ status: "fulfilled", fulfilled_at: new Date().toISOString() })
      .eq("id", id);

    if (updErr) {
      return NextResponse.json({ ok: false, error: "Update failed" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("Fulfill error:", e);
    return NextResponse.json(
      { ok: false, error: e?.message || "Fulfill failed" },
      { status: 500 }
    );
  }
}
