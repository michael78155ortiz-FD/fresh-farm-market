import { createClient } from '@supabase/supabase-js';

/**
 * Returns a Supabase client that uses the service_role key.
 * Used only for server-side admin routes.
 */
export function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE!;
  if (!url) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
  if (!key) throw new Error('Missing SUPABASE_SERVICE_ROLE');
  return createClient(url, key, { auth: { persistSession: false } });
}
