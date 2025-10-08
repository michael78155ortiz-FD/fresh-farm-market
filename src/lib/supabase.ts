import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export function getSupabaseAnon(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !/^https?:\/\//i.test(url)) throw new Error("Supabase URL missing/invalid at runtime");
  if (!anon) throw new Error("Supabase ANON key missing at runtime");
  return createClient(url, anon);
}

export function getSupabaseAdmin(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const service = process.env.SUPABASE_SERVICE_ROLE;
  if (!url || !/^https?:\/\//i.test(url)) throw new Error("Supabase URL missing/invalid at runtime");
  if (!service) throw new Error("Supabase SERVICE ROLE missing at runtime");
  return createClient(url, service);
}
