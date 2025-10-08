// src/app/(public)/market/page.tsx
import { headers } from "next/headers";
import AddToCartButton from "@/components/AddToCartButton";

async function getBaseUrl() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  if (!host) throw new Error("Missing host header");
  return `${proto}://${host}`;
}

export const dynamic = "force-dynamic";

type Vendor = {
  id: string;
  name?: string | null;
  rating?: number | null;
};

type Product = {
  id: string;
  vendor_id: string;
  name: string;
  price_cents: number;
  active: boolean;
};

export default async function MarketPage() {
  const base = await getBaseUrl();

  const [vendorsRes, productsRes] = await Promise.all([
    fetch(`${base}/api/market/vendors`, { cache: "no-store" }),
    fetch(`${base}/api/market/products`, { cache: "no-store" }),
  ]);

  const vendorsJson = vendorsRes.ok ? await vendorsRes.json() : { ok: false, data: [] };
  const productsJson = productsRes.ok ? await productsRes.json() : { ok: false, data: [] };

  const vendors: Vendor[] = vendorsJson?.data ?? [];
  const products: Product[] = (productsJson?.data ?? []).filter((p: Product) => p.active);

  return (
    <main style={{ padding: 24, color: "#fff" }}>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8 }}>Market</h1>
      <a href="/checkout" style={{ color: "#22c55e", textDecoration: "underline" }}>
        Go to checkout →
      </a>

      {/* Vendors */}
      <section style={{ marginTop: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Vendors</h2>
        {vendors.length === 0 ? (
          <p style={{ color: "#9ca3af" }}>No vendors yet.</p>
        ) : (
          <ul style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12, listStyle: "none", padding: 0 }}>
            {vendors.map((v) => (
              <li key={v.id} style={{ border: "1px solid #262626", borderRadius: 10, padding: 12, background: "#0b0b0b" }}>
                <div style={{ fontWeight: 700 }}>{v.name ?? "Vendor"}</div>
                {v.rating != null && (
                  <div style={{ color: "#9ca3af", fontSize: 12 }}>Rating: {v.rating.toFixed(1)}★</div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Products */}
      <section style={{ marginTop: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Products</h2>
        {products.length === 0 ? (
          <p style={{ color: "#9ca3af" }}>No products yet.</p>
        ) : (
          <ul style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12, listStyle: "none", padding: 0 }}>
            {products.map((p) => (
              <li key={p.id} style={{ border: "1px solid #262626", borderRadius: 10, padding: 12, background: "#0b0b0b" }}>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>{p.name}</div>
                <div style={{ color: "#9ca3af", marginBottom: 10 }}>
                  ${(p.price_cents / 100).toFixed(2)}
                </div>
                <AddToCartButton
                  id={p.id}
                  vendor_id={p.vendor_id}
                  name={p.name}
                  price_cents={p.price_cents}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
