// lib/supabaseAdmin.ts
import { createClient } from '@supabase/supabase-js';

/**
 * Returns a Supabase client that uses the service_role key.
 * Used only for server-side admin routes.
 */
export function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE!;
  return createClient(url, key, { auth: { persistSession: false } });
}
