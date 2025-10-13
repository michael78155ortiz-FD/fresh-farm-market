// src/app/admin/orders/page.tsx
"use client";

import { useEffect, useState } from "react";

type LineItem = { description: string; quantity: number; unit_amount: number; currency: string | null };
type Order = {
  id: string;
  stripe_session_id: string;
  amount_total_cents: number | null;
  currency: string | null;
  customer_email: string | null;
  line_items: LineItem[];
  status: "paid" | "fulfilled" | "refunded" | string;
  created_at: string;
  refunded_at?: string | null;
  refund_id?: string | null;
};

// ✅ Crash-proof formatter: always uses a valid currency
function money(cents: number | null | undefined, currency?: string | null) {
  const cur = (currency || "USD").toUpperCase();
  const amt = (cents ?? 0) / 100;
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: cur }).format(amt);
  } catch {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(amt);
  }
}

const ADMIN_PASS = process.env.NEXT_PUBLIC_ADMIN_PASS || ""; // optional convenience

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  async function load() {
    try {
      const res = await fetch("/api/admin/orders");
      const ct = res.headers.get("content-type") || "";

      if (!res.ok) {
        const data = ct.includes("application/json") ? await res.json() : { error: await res.text() };
        throw new Error(data?.error || `Failed to load orders (${res.status})`);
      }

      const data = ct.includes("application/json") ? await res.json() : { orders: [] };
      setOrders(data.orders || []);
      setErr(null);
    } catch (e: any) {
      setErr(e?.message || "Error");
      setOrders([]);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function callAdmin(url: string, id: string) {
    try {
      setBusy(id);
      const passParam = ADMIN_PASS ? `?pass=${encodeURIComponent(ADMIN_PASS)}` : "";
      const res = await fetch(`${url}${passParam}`, { method: "POST" });
      const ct = res.headers.get("content-type") || "";
      const data = ct.includes("application/json") ? await res.json() : {};
      if (!res.ok) throw new Error((data as any)?.error || "Action failed");
      await load();
    } catch (e) {
      alert((e as any)?.message || "Error");
    } finally {
      setBusy(null);
    }
  }

  function StatusBadge({ status }: { status: string }) {
    const map: Record<string, string> = {
      paid: "bg-yellow-100 text-yellow-700",
      fulfilled: "bg-green-100 text-green-700",
      refunded: "bg-red-100 text-red-700",
    };
    return (
      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${map[status] || "bg-gray-100 text-gray-700"}`}>
        {status.toUpperCase()}
      </span>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Orders</h1>
        <a href="/market" className="text-sm text-gray-600 hover:underline">← Back to Market</a>
      </div>

      {err && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">{err}</div>}

      {!orders ? (
        <div className="text-gray-600">Loading…</div>
      ) : orders.length === 0 ? (
        <div className="text-gray-600">No orders yet. Complete a test checkout, then refresh.</div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="rounded-2xl border p-4 bg-white">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="font-semibold">{money(o.amount_total_cents, o.currency || "USD")}</div>
                <StatusBadge status={o.status} />
                <div className="text-xs text-gray-500">{new Date(o.created_at).toLocaleString()}</div>
              </div>

              <div className="mt-2 text-sm text-gray-700">Email: {o.customer_email ?? "—"}</div>

              <ul className="mt-3 text-sm list-disc pl-5">
                {(o.line_items || []).map((li, idx) => (
                  <li key={idx}>
                    {li.quantity} × {li.description} — {money(li.unit_amount, li.currency || o.currency || "USD")}
                  </li>
                ))}
              </ul>

              {o.refunded_at && (
                <div className="mt-2 text-xs text-red-600">
                  Refunded at: {new Date(o.refunded_at).toLocaleString()} {o.refund_id ? `(${o.refund_id})` : ""}
                </div>
              )}

              <div className="mt-4 flex gap-2">
                {/* Fulfill */}
                <button
                  onClick={() => callAdmin(`/api/admin/orders/${o.id}/fulfill`, o.id)}
                  disabled={o.status !== "paid" || busy === o.id}
                  className="rounded-2xl bg-black px-4 py-2 text-white disabled:opacity-50"
                  title={o.status !== "paid" ? "Only 'paid' orders can be fulfilled" : ""}
                >
                  {busy === o.id ? "Working…" : "Mark fulfilled"}
                </button>

                {/* Refund */}
                <button
                  onClick={() => {
                    if (!confirm("Refund this order in Stripe? This cannot be undone.")) return;
                    callAdmin(`/api/admin/orders/${o.id}/refund`, o.id);
                  }}
                  disabled={o.status === "refunded" || busy === o.id}
                  className="rounded-2xl px-4 py-2 border border-red-300 text-red-700 hover:bg-red-50 disabled:opacity-50"
                >
                  {o.status === "refunded" ? "Already refunded" : busy === o.id ? "Refunding…" : "Refund"}
                </button>
              </div>

              <div className="mt-3 text-xs text-gray-500">Session: {o.stripe_session_id}</div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
