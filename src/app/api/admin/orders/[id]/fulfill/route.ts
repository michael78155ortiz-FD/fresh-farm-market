// src/app/api/admin/orders/[id]/fulfill/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Tell Next.js this is a dynamic route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

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
      .select("*")
      .eq("id", id)
      .single();

    if (error || !order) {
      return NextResponse.json({ ok: false, error: "Order not found" }, { status: 404 });
    }

    await supabase
      .from("orders")
      .update({ 
        status: "fulfilled", 
        fulfilled_at: new Date().toISOString() 
      })
      .eq("id", id);

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("Fulfill error:", e);
    return NextResponse.json(
      { ok: false, error: e?.message || "Fulfill failed" },
      { status: 500 }
    );
  }
}
