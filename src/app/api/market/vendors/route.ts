import { NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabaseAdmin";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = getAdminSupabase();
    if (!supabase) {
      return NextResponse.json(
        { ok: false, error: "Server configuration error" },
        { status: 500 }
      );
    }

    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .eq('approved', true);
    
    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ ok: true, data });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Failed to fetch vendors" },
      { status: 500 }
    );
  }
}
