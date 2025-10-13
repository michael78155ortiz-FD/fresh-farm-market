// src/lib/supabaseServer.ts
import { createClient } from "@supabase/supabase-js";

export function supabaseServer() {
  const url =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const service =
    process.env.SUPABASE_SERVICE_ROLE ||
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) throw new Error("Missing SUPABASE_URL");
  if (!service) throw new Error("Missing service role key");

  // No auth session persisted on server
  return createClient(url, service, { auth: { persistSession: false } });
}
