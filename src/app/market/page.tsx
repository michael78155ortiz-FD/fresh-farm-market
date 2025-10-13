// src/app/market/page.tsx
import Link from "next/link";

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
  vendor_id: string;
};

function money(cents: number) {
  return new Intl.NumberFormat(undefined, { 
    style: "currency", 
    currency: "USD" 
  }).format(cents / 100);
}

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function MarketPage() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const [vendorsRes, productsRes] = await Promise.all([
    fetch(`${base}/api/market/vendors`, { cache: "no-store" }),
    fetch(`${base}/api/market/products`, { cache: "no-store" }),
  ]);

  if (!vendorsRes.ok || !productsRes.ok) {
    throw new Error("Failed to load market data");
  }

  const vendorsData = await vendorsRes.json();
  const productsData = await productsRes.json();

  const vendors: Vendor[] = Array.isArray(vendorsData?.vendors)
    ? vendorsData.vendors
    : Array.isArray(vendorsData)
    ? vendorsData
    : [];

  const products: Product[] = Array.isArray(productsData?.products)
    ? productsData.products
    : Array.isArray(productsData)
    ? productsData
    : [];

  // Group products by vendor
  const productsByVendor = products.reduce((acc, product) => {
    if (!acc[product.vendor_id]) {
      acc[product.vendor_id] = [];
    }
    acc[product.vendor_id].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="mb-3 text-4xl font-bold text-gray-900">
          Fresh Farm Market
        </h1>
        <p className="text-lg text-gray-600">
          Local vendors delivering farm-fresh products to your door
        </p>
      </div>

      {/* Vendors Grid */}
      {vendors.length === 0 ? (
        <div className="rounded-2xl border bg-white p-12 text-center">
          <p className="text-gray-600">No vendors available yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vendors.map((vendor) => {
            const vendorProducts = productsByVendor[vendor.id] || [];
            const productCount = vendorProducts.length;
            const lowestPrice = vendorProducts.length > 0
              ? Math.min(...vendorProducts.map((p) => p.price_cents))
              : 0;

            return (
              <Link
                key={vendor.id}
                href={`/market/vendor/${vendor.id}`}
                className="group relative overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:shadow-lg"
              >
                {/* Vendor Image */}
                <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-green-50 to-green-100">
                  {vendor.image_url ? (
                    <img
                      src={vendor.image_url}
                      alt={vendor.name}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="text-6xl">🏪</span>
                    </div>
                  )}
                  
                  {/* Category Badge */}
                  {vendor.category && (
                    <div className="absolute left-3 top-3">
                      <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-700 backdrop-blur-sm">
                        {vendor.category}
                      </span>
                    </div>
                  )}
                </div>

                {/* Vendor Info */}
                <div className="p-5">
                  <h3 className="mb-2 text-xl font-semibold text-gray-900 group-hover:text-green-600">
                    {vendor.name}
                  </h3>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{productCount} {productCount === 1 ? 'product' : 'products'}</span>
                    {lowestPrice > 0 && (
                      <span className="font-medium text-green-700">
                        From {money(lowestPrice)}
                      </span>
                    )}
                  </div>

                  {/* Sample Products */}
                  {vendorProducts.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {vendorProducts.slice(0, 3).map((product) => (
                        <span
                          key={product.id}
                          className="rounded-lg bg-gray-100 px-2 py-1 text-xs text-gray-700"
                        >
                          {product.name}
                        </span>
                      ))}
                      {vendorProducts.length > 3 && (
                        <span className="rounded-lg bg-gray-100 px-2 py-1 text-xs text-gray-700">
                          +{vendorProducts.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* View Button */}
                  <div className="mt-4">
                    <span className="inline-flex items-center text-sm font-medium text-green-600 group-hover:text-green-700">
                      View products
                      <svg
                        className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
