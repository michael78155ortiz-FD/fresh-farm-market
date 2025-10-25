import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabaseAdmin";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const supabase = getAdminSupabase();
    if (!supabase) {
      return NextResponse.json(
        { ok: false, error: "Server configuration error" },
        { status: 500 }
      );
    }

    const searchParams = req.nextUrl.searchParams;
    const vendorId = searchParams.get('vendor_id');
    
    let query = supabase
      .from('products')
      .select('id, vendor_id, name, price_cents, description, image_url')
      .eq('active', true);
    
    if (vendorId) {
      query = query.eq('vendor_id', vendorId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ ok: true, products: data });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}
