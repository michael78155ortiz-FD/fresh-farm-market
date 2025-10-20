// src/app/admin/orders/page.tsx
import { supabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const supabase = await supabaseServer();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return (
      <main className="min-h-[60vh] grid place-items-center">
        <div className="rounded-xl border bg-white px-6 py-5">
          <p className="text-gray-700">
            You are not signed in.{" "}
            <a href="/auth/sign-in" className="text-green-600 underline">
              Sign in
            </a>
          </p>
        </div>
      </main>
    );
  }

  const userEmail = session.user.email ?? "unknown";

  return (
    <main className="mx-auto max-w-4xl p-6">
      <div className="flex items-start justify-between mb-6">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <div className="text-right">
          <div className="font-medium">{userEmail}</div>
          <div className="text-sm text-gray-500">Role: admin</div>
          <form action="/auth/sign-out" method="post" className="mt-2">
            <button className="rounded-md border px-3 py-1.5">Sign out</button>
          </form>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-10 text-center">
        <div className="text-5xl mb-2">🎉</div>
        <div className="text-green-700 font-medium text-lg">
          Authentication Working!
        </div>
        <p className="text-gray-600 mt-1">
          You&apos;re successfully logged in as {userEmail}
        </p>

        <div className="mt-6 text-left mx-auto max-w-lg rounded-lg border border-green-200 bg-green-50 p-4">
          <div className="font-medium mb-2">Verified:</div>
          <ul className="list-disc pl-6 space-y-1 text-green-800">
            <li>Browser sign-in created a session cookie</li>
            <li>Server page read the cookie via <code>@supabase/ssr</code></li>
            <li>SSR content changes based on auth state</li>
          </ul>
        </div>
      </div>
    </main>
  );
}