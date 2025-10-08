// app/api/admin/applications/route.ts
import { NextResponse } from 'next/server';
import { requireAdmin } from "../../../../lib/adminAuth";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";

/**
 * Lists all applications for the admin panel.
 */
export async function GET(req: Request) {
  requireAdmin(req);

  const supa = supabaseAdmin();
  const { data, error } = await supa
    .from('applications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, count: data?.length ?? 0, data });
}
