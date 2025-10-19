"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/browser";

export default function SignInPage() {
  const [email, setEmail] = useState("michael78155ortiz@gmail.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const router = useRouter();

  async function doPassword(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      const supabase = supabaseBrowser();

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMsg(error.message);
        return;
      }

      // Ensure cookies are written before we hit the server page:
      await supabase.auth.getSession();

      // Hard navigate so the server can read the fresh cookies
      window.location.assign("/admin/orders");
    } catch (err: any) {
      setMsg(err?.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 grid place-items-center px-4">
      <form
        onSubmit={doPassword}
        className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm"
      >
        <h1 className="text-2xl font-semibold mb-6">Sign in</h1>

        <label className="block text-sm font-medium mb-1" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="w-full rounded-md border px-3 py-2 mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />

        <label className="block text-sm font-medium mb-1" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="w-full rounded-md border px-3 py-2 mb-6"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        {msg && (
          <p className="mb-4 text-sm text-red-600" role="alert">
            {msg}
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-green-600 px-4 py-2 text-white disabled:opacity-60"
          >
            {loading ? "Loading..." : "Sign in"}
          </button>

          <button
            type="button"
            className="rounded-md bg-gray-200 px-4 py-2 text-gray-900"
            onClick={() => alert("Magic link flow not wired in this demo")}
          >
            Use magic link
          </button>
        </div>
      </form>
    </main>
  );
}