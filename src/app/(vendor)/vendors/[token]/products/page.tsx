"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

type Product = {
  id: string;
  name: string;
  price_cents: number;
  active: boolean;
  created_at: string;
  updated_at?: string;
};

export default function VendorProductsPage() {
  const params = useParams() as { token?: string };
  const token = String(params?.token ?? "");

  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">("");

  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((p) => p.name.toLowerCase().includes(s));
  }, [items, q]);

  async function load() {
    if (!token) return;
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(`/api/vendor/products?token=${token}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error || "Failed to load");
      setItems(Array.isArray(data.data) ? data.data : []);
    } catch (e: any) {
      setErr(e.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function addProduct() {
    if (!name || price === "" || typeof price !== "number") return;
    setErr(null);
    try {
      const res = await fetch(`/api/vendor/products?token=${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price_cents: Math.round(price) }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error || "Failed to add");
      setName("");
      setPrice("");
      await load();
    } catch (e: any) {
      setErr(e.message || "Network error");
    }
  }

  async function toggleActive(id: string, active: boolean) {
    setErr(null);
    try {
      const res = await fetch(`/api/vendor/products?token=${token}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, active: !active }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error || "Failed to update");
      await load();
    } catch (e: any) {
      setErr(e.message || "Network error");
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this product?")) return;
    setErr(null);
    try {
      const res = await fetch(`/api/vendor/products?token=${token}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) throw new Error(data?.error || "Failed to delete");
      await load();
    } catch (e: any) {
      setErr(e.message || "Network error");
    }
  }

  return (
    <main style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Products</h1>
        <a href={`/vendors/${token}`} style={linkBtn}>← Back to Dashboard</a>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 8, marginBottom: 12 }}>
        <input
          placeholder="Search products…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ padding: 8, minWidth: 260 }}
        />
        {loading && <span style={{ color: "#9ca3af" }}>Loading…</span>}
        {err && <span style={{ color: "crimson" }}>Error: {err}</span>}
      </div>

      <div
        style={{
          display: "grid",
          gap: 8,
          gridTemplateColumns: "minmax(260px, 1fr) 120px 120px 120px",
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        <input
          placeholder="New product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: 8 }}
        />
        <input
          placeholder="Price (cents)"
          inputMode="numeric"
          value={price}
          onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
          style={{ padding: 8 }}
        />
        <button onClick={addProduct}>Add</button>
      </div>

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {filtered.map((p) => (
          <li
            key={p.id}
            style={{
              marginBottom: 10,
              padding: 12,
              border: "1px solid #262626",
              borderRadius: 10,
              background: "#0b0b0b",
              display: "grid",
              gridTemplateColumns: "1fr 140px 120px 120px",
              gap: 10,
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontWeight: 700 }}>{p.name}</div>
              <div style={{ color: "#9ca3af", fontSize: 12 }}>
                Created {new Date(p.created_at).toLocaleString()}
              </div>
            </div>

            <span style={{ color: p.active ? "#10b981" : "#ef4444" }}>
              {p.active ? "Active" : "Inactive"}
            </span>

            <button onClick={() => toggleActive(p.id, p.active)}>
              {p.active ? "Set Inactive" : "Set Active"}
            </button>

            <button onClick={() => remove(p.id)} style={{ background: "#ef4444" }}>
              Delete
            </button>
          </li>
        ))}
      </ul>

      {filtered.length === 0 && !loading && <i style={{ color: "#64748b" }}>No products.</i>}
    </main>
  );
}

const linkBtn: React.CSSProperties = {
  padding: "10px 14px",
  background: "#0ea5e9",
  color: "#fff",
  borderRadius: 8,
  border: "1px solid #0369a1",
  textDecoration: "none",
  fontWeight: 700,
};
