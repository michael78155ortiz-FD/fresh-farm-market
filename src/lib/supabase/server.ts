// src/lib/supabase/server.ts
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

/** Server client that *reads/writes* the same cookies the browser sets. */
export function supabaseServer() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({
            name,
            value,
            ...options,
            sameSite: options.sameSite ?? "lax",
          });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({
            name,
            value: "",
            ...options,
            maxAge: 0,
            sameSite: options.sameSite ?? "lax",
          });
        },
      },
    }
  );
}