// src/app/market/vendor/[id]/page.tsx
import { headers } from "next/headers";
import Link from "next/link";
export const revalidate = 0;

type Vendor = {
  id: string;
  name: string;
  description?: string | null;
};

type Product = {
  id: string;
  vendor_id: string;
  name: string;
  description?: string | null;
  price_cents: number;
};

async function getBaseUrl(): Promise<string> {
  const explicit = process.env.NEXT_PUBLIC_BASE_URL;
  if (explicit) return explicit;
  const h = await headers();
  const proto = h.get("x-forwarded-proto") ?? "https";
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "";
  return host ? `${proto}://${host}` : "";
}

async function getData(id: string) {
  const base = await getBaseUrl();
  if (!base) throw new Error("Could not determine base URL");
  const [prodsRes, vendorsRes] = await Promise.all([
    fetch(`${base}/api/market/products`, { cache: "no-store" }),
    fetch(`${base}/api/market/vendors`, { cache: "no-store" }),
  ]);
  if (!prodsRes.ok || !vendorsRes.ok) {
    throw new Error("Failed to fetch market data");
  }
  const prodsJson = (await prodsRes.json()) as { ok: boolean; data: Product[] };
  const vendorsJson = (await vendorsRes.json()) as { ok: boolean; data: Vendor[] };
  const vendor = vendorsJson.data.find((v) => v.id === id) ?? null;
  const items = prodsJson.data.filter((p) => p.vendor_id === id);
  return { vendor, items };
}

export default async function VendorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  try {
    const { vendor, items } = await getData(id);
    if (!vendor) {
      return (
        <main className="p-6">
          <p className="opacity-80">Vendor not found.</p>
          <Link href="/market" className="underline mt-2 inline-block">
            ← Back to market
          </Link>
        </main>
      );
    }
    return (
      <main className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{vendor.name}</h1>
          <p className="opacity-70">{vendor.description ?? "No description"}</p>
        </div>
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <div key={p.id} className="rounded-2xl border p-4 shadow-sm">
              <div className="text-lg font-semibold">{p.name}</div>
              <div className="opacity-70 mt-1">{p.description ?? "No description"}</div>
              <div className="mt-3 font-bold">${(p.price_cents / 100).toFixed(2)}</div>
              <Link href="/market" className="text-sm underline mt-2 inline-block">
                Back to market
              </Link>
            </div>
          ))}
          {items.length === 0 && (
            <div className="col-span-full opacity-70">This vendor has no products yet.</div>
          )}
        </section>
      </main>
    );
  } catch (e: any) {
    return <main className="p-6">Error: {e?.message ?? "Unexpected error"}</main>;
  }
}
