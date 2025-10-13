// src/app/api/market/vendors/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

// Uses your server env vars:
// - NEXT_PUBLIC_SUPABASE_URL
// - SUPABASE_SERVICE_ROLE_KEY (the long service role secret)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type VendorRow = {
  id: string;
  name: string | null;
  category: string | null;
  description: string | null;
  logo_url: string | null;
  banner_url: string | null;
  website_url: string | null;
  instagram: string | null;
  status: string | null;
  is_active?: boolean | null;
  approved?: boolean | null;
};

function normalize(v: VendorRow) {
  return {
    id: v.id,
    name: v.name ?? "n/a",
    category: v.category ?? "n/a",
    description: v.description ?? "n/a",
    // Expose a unified image_url for the frontend
    image_url: v.logo_url || v.banner_url || null,
    website_url: v.website_url ?? null,
    instagram: v.instagram ?? null,
    status: v.status ?? null,
  };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    // Base select pulls both logo_url and banner_url so we can map them
    let base = supabase
      .from("vendors")
      .select(
        "id,name,category,description,logo_url,banner_url,website_url,instagram,status,is_active,approved"
      );

    if (id) {
      const { data, error } = await base.eq("id", id).single();
      if (error) throw error;
      // Return one vendor wrapped as { vendor: ... }
      return NextResponse.json({ vendor: normalize(data as VendorRow) });
    }

    // List view: show only active + approved vendors
    const { data, error } = await base
      .eq("is_active", true)
      .eq("approved", true)
      .order("name", { ascending: true });

    if (error) throw error;

    // Return an array of normalized vendors
    return NextResponse.json((data as VendorRow[]).map(normalize));
  } catch (e: any) {
    console.error("vendors API error:", e);
    return NextResponse.json({ error: e.message ?? "failed" }, { status: 500 });
  }
}
