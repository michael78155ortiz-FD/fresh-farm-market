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
        <Link href="/market" className="inline-flex items-center text-sm font-medium text-green-700 hover:text-green-800 hover:underline">
          <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Market
        </Link>
      </div>

      <header className="mb-8 rounded-2xl border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="relative h-20 w-20 overflow-hidden rounded-xl bg-gradient-to-br from-green-50 to-green-100 shadow-sm">
            {vendor.image_url ? (
              <img
                src={vendor.image_url}
                alt={vendor.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-4xl">
                🏪
              </div>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{vendor.name}</h1>
            {vendor.category && (
              <span className="mt-1 inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                {vendor.category}
              </span>
            )}
          </div>
        </div>
      </header>

      {products.length === 0 ? (
        <div className="rounded-2xl border bg-white p-12 text-center shadow-sm">
          <div className="mb-4 text-6xl">📦</div>
          <p className="text-lg text-gray-600">No products available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => {
            const inventory = p.inventory ?? 0;
            const inStock = inventory > 0;
            const lowStock = inventory > 0 && inventory <= 5;

            return (
              <div key={p.id} className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:shadow-md">
                {/* Product Image */}
                <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                  {p.image_url ? (
                    <img
                      src={p.image_url}
                      alt={p.name}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-6xl">
                      🥬
                    </div>
                  )}
                  
                  {/* Stock Badge - Top Right */}
                  <div className="absolute right-3 top-3">
                    {!inStock ? (
                      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 shadow-sm backdrop-blur-sm">
                        Sold Out
                      </span>
                    ) : lowStock ? (
                      <span className="animate-pulse rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700 shadow-sm backdrop-blur-sm">
                        ⚠️ Only {inventory} left!
                      </span>
                    ) : (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 shadow-sm backdrop-blur-sm">
                        ✓ In Stock
                      </span>
                    )}
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-5">
                  <div className="mb-3 flex items-start justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600">
                      {p.name}
                    </h3>
                    <span className="ml-2 text-lg font-bold text-green-700">
                      {money(p.price_cents)}
                    </span>
                  </div>

                  {/* Inventory Count - Bottom */}
                  {inStock && (
                    <div className="mb-3 text-sm text-gray-600">
                      {inventory} {inventory === 1 ? 'unit' : 'units'} available
                    </div>
                  )}

                  {/* Add to Cart Button */}
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
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}