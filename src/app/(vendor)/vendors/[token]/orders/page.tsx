"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

type OrderItem = {
  product_name?: string | null;
  unit?: string | null;
  qty?: number;
  price_cents?: number;
};

type Order = {
  id: string;
  status: string;
  created_at: string;
  customer_name?: string | null;
  customer_email?: string | null;
  customer_phone?: string | null;
  customer_address?: string | null;
  notes?: string | null;
  total_cents?: number | null;
  items?: OrderItem[];
};

const STATUS = ["received", "preparing", "ready", "completed", "canceled"] as const;

export default function VendorOrdersPage() {
  const params = useParams() as { token?: string };
  const token = String(params?.token ?? "");

  const [orders, setOrders] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter(
      (o) =>
        o.id.toLowerCase().includes(q) ||
        (o.customer_name ?? "").toLowerCase().includes(q) ||
        (o.customer_email ?? "").toLowerCase().includes(q) ||
        (o.status ?? "").toLowerCase().includes(q)
    );
  }, [orders, search]);

  async function load() {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/vendor/orders?token=${token}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error || "Failed to load");
      setOrders(Array.isArray(data.data) ? data.data : []);
    } catch (e: any) {
      setError(e.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function setStatus(order_id: string, status: string) {
    setError(null);
    try {
      const res = await fetch(`/api/vendor/orders?token=${token}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id, status }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error || "Failed to update");
      await load();
    } catch (e: any) {
      setError(e.message || "Network error");
    }
  }

  return (
    <main style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Manage orders</h1>
        <a
          href={`/vendors/${token}/products`}
          style={{
            padding: "10px 14px",
            background: "#0ea5e9",
            color: "#fff",
            borderRadius: 8,
            border: "1px solid #0369a1",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          ← Back to Products
        </a>
      </div>

      <div style={{ marginBottom: 8, display: "flex", gap: 10 }}>
        <input
          placeholder="Search orders by id/name/email/status…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: 8, width: 360 }}
        />
        {loading && <span style={{ color: "#9ca3af" }}>Loading…</span>}
        {error && <span style={{ color: "crimson" }}>Error: {error}</span>}
      </div>

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {filtered.map((o) => (
          <li
            key={o.id}
            style={{
              marginBottom: 12,
              padding: 12,
              border: "1px solid #262626",
              borderRadius: 10,
              background: "#0b0b0b",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <div>
                <div style={{ fontWeight: 700 }}>
                  Order {o.id.slice(0, 8)}… • {o.status ?? "unknown"}
                </div>
                <div style={{ color: "#9ca3af", fontSize: 12 }}>
                  {new Date(o.created_at).toLocaleString()}
                </div>

                {(o.customer_name || o.customer_email || o.customer_phone) && (
                  <div style={{ marginTop: 6, color: "#d1d5db" }}>
                    {o.customer_name ?? "Guest"} — {o.customer_email ?? "no email"}
                    {o.customer_phone ? ` • ${o.customer_phone}` : ""}
                  </div>
                )}
                {o.customer_address && (
                  <div style={{ color: "#9ca3af", fontSize: 12 }}>{o.customer_address}</div>
                )}
                {o.notes && (
                  <div style={{ color: "#9ca3af", fontSize: 12, marginTop: 4 }}>
                    Notes: {o.notes}
                  </div>
                )}

                {Array.isArray(o.items) && o.items.length > 0 && (
                  <ul style={{ marginTop: 8, paddingLeft: 18 }}>
                    {o.items.map((it, idx) => (
                      <li key={idx} style={{ color: "#e5e7eb" }}>
                        {it.product_name ?? "item"} × {it.qty ?? 1}
                        {it.unit ? ` / ${it.unit}` : ""}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 170 }}>
                {STATUS.map((s) => (
                  <button
                    key={s}
                    disabled={o.status === s}
                    onClick={() => setStatus(o.id, s)}
                    style={{
                      padding: "8px 10px",
                      borderRadius: 8,
                      border: "1px solid #374151",
                      color: "#fff",
                      background: o.status === s ? "#1f2937" : "#111827",
                      cursor: o.status === s ? "not-allowed" : "pointer",
                    }}
                  >
                    Set “{s}”
                  </button>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ul>

      {filtered.length === 0 && !loading && <i style={{ color: "#64748b" }}>No orders yet.</i>}
    </main>
  );
}
