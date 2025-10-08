"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function VendorHome() {
  const params = useParams() as { token?: string };
  const token = String(params?.token ?? "");

  return (
    <main style={{ padding: 24, display: "grid", gap: 12 }}>
      <h1>Vendor Dashboard</h1>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Link href={`/vendors/${token}/products`} style={btn}>Manage Products</Link>
        <Link href={`/vendors/${token}/orders`} style={btn}>Manage Orders</Link>
        <Link href={`/vendors/${token}/reviews`} style={btn}>Reviews</Link>
      </div>
    </main>
  );
}

const btn: React.CSSProperties = {
  padding: "10px 14px",
  background: "#0ea5e9",
  color: "#fff",
  borderRadius: 8,
  border: "1px solid #0369a1",
  textDecoration: "none",
  fontWeight: 700,
};
