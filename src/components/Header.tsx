"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-semibold">
          Fresh Farm
        </Link>

        <nav className="flex items-center gap-3">
          <Link href="/market" className="px-3 py-2 hover:underline">
            Market
          </Link>
          <Link href="/cart" className="px-3 py-2 hover:underline">
            Cart
          </Link>

          {/* 👇 new button */}
          <Link
            href="/vendor"
            className="rounded-lg px-4 py-2 font-medium bg-green-600 text-white hover:bg-green-700 transition"
          >
            Become a Vendor
          </Link>
        </nav>
      </div>
    </header>
  );
}
