// src/components/SiteHeader.tsx
import Link from "next/link";
import CartLink from "@/components/cart/CartLink";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: Logo / Brand */}
        <Link href="/market" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-green-600 text-white font-bold">F</span>
          <span className="text-lg font-semibold tracking-tight">Freshly Delivery</span>
        </Link>

        {/* Center: Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/market" className="text-gray-700 hover:text-green-700">Market</Link>
          <Link href="/market/vendors" className="text-gray-700 hover:text-green-700">Vendors</Link>
          <Link href="/market/categories" className="text-gray-700 hover:text-green-700">Categories</Link>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <CartLink />
          <Link
            href="/auth/sign-in"
            className="px-3 py-2 text-sm font-medium rounded-lg text-green-700 hover:bg-green-50"
          >
            Sign in
          </Link>
          <Link
            href="/vendor/signup"
            className="px-3 py-2 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700"
          >
            Become a vendor
          </Link>
        </div>
      </div>
    </header>
  );
}