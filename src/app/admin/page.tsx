// src/app/admin/page.tsx
import Link from "next/link";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default function AdminHome() {
  const cards = [
    {
      href: "/admin/orders",
      title: "Orders",
      desc: "View, fulfill, or refund recent orders.",
    },
    {
      href: "/market",
      title: "Market",
      desc: "Go to the storefront to place a test order.",
    },
    {
      href: "/",
      title: "Home",
      desc: "Back to the site homepage.",
    },
  ];
  
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Quick links to manage your store.
        </p>
      </header>
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group rounded-2xl border bg-white p-5 transition hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{c.title}</h2>
              <span className="text-gray-400 transition group-hover:translate-x-1">→</span>
            </div>
            <p className="mt-2 text-sm text-gray-600">{c.desc}</p>
          </Link>
        ))}
      </section>
      <footer className="mt-10 text-xs text-gray-500">
        Tip: If you protected /admin with a password (middleware), you can open this
        page with <code className="rounded bg-gray-100 px-1">?pass=supersecret</code>.
      </footer>
    </main>
  );
}
