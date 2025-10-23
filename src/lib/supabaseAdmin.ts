import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

/**
 * Lazily creates a Supabase service-role client at request time.
 * Returns null if the env is not configured, so callers can respond 500 gracefully.
 */
export function getAdminSupabase(): SupabaseClient | null {
  // Prefer server env; fall back to NEXT_PUBLIC if your project only exposes that
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) return null;

  if (!cached) {
    cached = createClient(url, key, {
      auth: { persistSession: false },
    });
  }
  return cached;
}
