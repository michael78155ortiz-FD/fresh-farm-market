// src/app/api/admin/_guard.ts
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function requireAdmin() {
  const supabase = supabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const email = (session.user.email || "").toLowerCase();
  const allowed = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  if (!allowed.includes(email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Returning null means “all good”
  return null as NextResponse | null;
}
