import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

export function getAdminSupabase(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  if (!cached) {
    cached = createClient(url, key, { auth: { persistSession: false } });
  }
  return cached;
}

/**
 * Back-compat export for older imports:
 *   import { supabaseAdmin } from ".../lib/supabaseAdmin"
 * It returns the client lazily (no top-level env access).
 */
export function supabaseAdmin(): SupabaseClient | null {
  return getAdminSupabase();
}
