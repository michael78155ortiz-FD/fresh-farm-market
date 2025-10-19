// src/app/auth/login/route.ts
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    const supabase = await supabaseServer();
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json({ ok: true, user: data.user });
  } catch (e: any) {
    console.error("Login error:", e);
    return NextResponse.json({ error: e?.message || "Login failed" }, { status: 500 });
  }
}