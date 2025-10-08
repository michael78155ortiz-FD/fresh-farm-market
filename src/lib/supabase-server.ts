// src/lib/supabase-server.ts
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Hard fail early if envs are missing in Production
if (!url || !/^https?:\/\//.test(url)) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
}
if (!anon) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

export const supabase = createClient(url, anon, {
  auth: { persistSession: false },
});
