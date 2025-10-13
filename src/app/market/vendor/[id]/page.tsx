// src/app/market/vendor/[id]/page.tsx
import Link from "next/link";
import AddToCartForm from "./AddToCartForm";

type Vendor = {
  id: string;
  name: string;
  category?: string | null;
  image_url?: string | null;
};

type Product = {
  id: string;
  name: string;
  price_cents: number;
  inventory: number | null;
  image_url?: string | null;
  vendor_id: string;
  is_active?: boolean;
};

function money(cents: number, currency = "USD") {
  const safe = Number.isFinite(cents) ? cents : 0;
  return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(safe / 100);
}

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function VendorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: vendorId } = await params;

  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const [vRes, pRes] = await Promise.all([
    fetch(`${base}/api/market/vendors?id=${vendorId}`, { cache: "no-store" }),
    fetch(`${base}/api/market/products?vendor_id=${vendorId}`, { cache: "no-store" }),
  ]);

  if (!vRes.ok) throw new Error(`Failed to load vendor: ${await vRes.text()}`);
  if (!pRes.ok) throw new Error(`Failed to load products: ${await pRes.text()}`);

  const vData = await vRes.json();
  const pData = await pRes.json();

  const vendor: Vendor = vData?.vendor ?? vData;
  const products: Product[] = Array.isArray(pData?.products) ? pData.products : Array.isArray(pData) ? pData : [];

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6">
        <Link href="/market" className="text-sm text-green-700 hover:underline">
          ← Back to Market
        </Link>
      </div>

      <header className="mb-8 flex items-center gap-4">
        <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-gray-100">
          <img
            src={vendor.image_url || "/no-image.png"}
            alt={vendor.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">{vendor.name}</h1>
          {vendor.category ? <p className="text-sm text-gray-600">{vendor.category}</p> : null}
        </div>
      </header>

      {products.length === 0 ? (
        <p className="rounded-xl border bg-white p-6 text-gray-600">No products yet.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => {
            const inStock = (p.inventory ?? 0) > 0;
            return (
              <li key={p.id} className="rounded-2xl border bg-white p-4">
                <div className="relative mb-3 h-40 w-full overflow-hidden rounded-xl bg-gray-100">
                  <img
                    src={p.image_url || "/no-image.png"}
                    alt={p.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="mb-1 flex items-center justify-between">
                  <h3 className="font-medium">{p.name}</h3>
                  <span className="text-sm text-gray-700">{money(p.price_cents)}</span>
                </div>
                <div className="mb-3 text-xs">
                  {inStock ? (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-green-700">
                      In stock: {p.inventory}
                    </span>
                  ) : (
                    <span className="rounded-full bg-gray-200 px-2 py-0.5 text-gray-600">Sold out</span>
                  )}
                </div>
                <AddToCartForm
                  product={{
                    id: p.id,
                    name: p.name,
                    price_cents: p.price_cents,
                    image_url: p.image_url || "",
                  }}
                  inStock={inStock}
                  vendorId={vendorId}
                />
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
