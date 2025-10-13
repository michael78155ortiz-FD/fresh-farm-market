"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

type Vendor = {
  id: string;
  name: string;
  description?: string;
  bio?: string;
  category?: string; // e.g. "Food", "Drinks", etc.
  banner_url?: string;
  logo_url?: string;
};

type Product = {
  id: string;
  name: string;
  description?: string;
  price_cents: number;
  vendor_id: string;
  image_url?: string;
  category?: string;
};

function formatUSD(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" })
    .format((cents || 0) / 100);
}

const CATEGORIES = ["All", "Food", "Drinks", "Baked Goods", "Produce", "Catering"] as const;

export default function Browser({
  vendors,
  products,
}: {
  vendors: Vendor[];
  products: Product[];
}) {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<(typeof CATEGORIES)[number]>("All");

  const countByVendor = useMemo(() => {
    const acc: Record<string, number> = {};
    for (const p of products) acc[p.vendor_id] = (acc[p.vendor_id] || 0) + 1;
    return acc;
  }, [products]);

  const q = query.trim().toLowerCase();
  const cat = activeCat.toLowerCase();

  const filteredVendors = useMemo(() => {
    return vendors.filter(v => {
      const inCat = cat === "all" ? true : (v.category || "").toLowerCase() === cat;
      const inQuery =
        q.length === 0 ||
        (v.name || "").toLowerCase().includes(q) ||
        (v.description || v.bio || "").toLowerCase().includes(q);
      return inCat && inQuery;
    });
  }, [vendors, q, cat]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const inCat = cat === "all" ? true : (p.category || "").toLowerCase() === cat;
      const inQuery =
        q.length === 0 ||
        (p.name || "").toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q);
      return inCat && inQuery;
    });
  }, [products, q, cat]);

  return (
    <>
      {/* Search bar */}
      <div className="mt-8 max-w-2xl mx-auto">
        <div className="flex gap-2 bg-white rounded-full shadow-lg p-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search vendors or products…"
            className="flex-1 px-6 py-3 rounded-full outline-none text-gray-700"
          />
          <button
            className="bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition"
            onClick={() => {}}
          >
            Search
          </button>
        </div>
      </div>

      {/* Category chips */}
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {CATEGORIES.map((c) => {
          const on = activeCat === c;
          return (
            <button
              key={c}
              onClick={() => setActiveCat(c)}
              className={`px-4 py-2 rounded-full border transition ${
                on
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>

      {/* Vendors */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Local Vendors</h2>
            <p className="text-gray-600 mt-1">
              {filteredVendors.length} vendor{filteredVendors.length !== 1 ? "s" : ""} match
            </p>
          </div>
        </div>

        {filteredVendors.length === 0 ? (
          <div className="text-center py-20 text-gray-600">No vendors match your filters.</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredVendors.map((vendor) => (
              <Link
                key={vendor.id}
                href={`/market/vendor/${vendor.id}`}
                className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-200"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  <Image
                    src={
                      vendor.banner_url ||
                      vendor.logo_url ||
                      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=80"
                    }
                    alt={vendor.name || "Vendor"}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {vendor.category && (
                    <span className="absolute top-3 right-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-700 capitalize">
                      {vendor.category}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition line-clamp-1">
                    {vendor.name || "Untitled vendor"}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mt-1 mb-4">
                    {vendor.description || vendor.bio || "No description available"}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">
                      {countByVendor[vendor.id]
                        ? `${countByVendor[vendor.id]} product${
                            countByVendor[vendor.id] !== 1 ? "s" : ""
                          }`
                        : "No products yet"}
                    </span>
                    <span className="text-green-600 font-medium group-hover:underline">
                      View menu →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Products */}
      <section className="mx-auto max-w-7xl px-6 py-12 border-t border-gray-200">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Products</h2>
          <p className="text-gray-600 mt-1">
            {filteredProducts.length} item{filteredProducts.length !== 1 ? "s" : ""} match
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 text-gray-600">No products match your filters.</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.slice(0, 12).map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition border border-gray-200"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  <Image
                    src={
                      product.image_url ||
                      "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=1200&q=80"
                    }
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {product.description || "No description available"}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">
                      {formatUSD(product.price_cents)}
                    </span>
                    <Link
                      href={`/market/vendor/${product.vendor_id}`}
                      className="text-sm text-green-600 hover:underline"
                    >
                      View vendor
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
