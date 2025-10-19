// src/app/auth/callback/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") || "/admin/orders";

  if (!code) {
    const to = new URL("/auth/sign-in", url.origin);
    return NextResponse.redirect(to);
  }

  const supabase = await supabaseServer();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const to = new URL("/auth/sign-in", url.origin);
    to.searchParams.set("error", error.message);
    return NextResponse.redirect(to);
  }

  return NextResponse.redirect(new URL(next, url.origin));
}