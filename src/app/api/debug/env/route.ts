import { NextResponse } from "next/server";
export const runtime = "nodejs";
export async function GET() {
  const url = (process.env.SUPABASE_URL || "").trim();
  const role = (process.env.SUPABASE_SERVICE_ROLE || "").trim();
  return NextResponse.json({
    hasUrl: !!url,
    urlHost: url ? new URL(url).host : null,
    roleLen: role.length,
    roleLast4: role ? role.slice(-4) : null,
  });
}
