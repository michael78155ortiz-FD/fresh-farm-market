"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCart, clearCart } from "@/lib/cart";

export default function CheckoutPage() {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", notes: "" });
  const router = useRouter();

  useEffect(() => {
    setItems(getCart());
  }, []);

  const total = items.reduce((s, i) => s + i.price_cents * i.qty, 0);

  async function placeOrder() {
    if (!items.length) return alert("Your cart is empty.");
    const vendor_id = items[0].vendor_id;

    const payload = {
      vendor_id,
      customer_name: form.name,
      customer_email: form.email,
      customer_phone: form.phone,
      customer_address: form.address,
      notes: form.notes,
      items,
    };

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!data.ok) {
      alert(`Failed to place order: ${data.error}`);
      return;
    }

    alert(`Order placed! Order ID: ${data.data.id}`);
    clearCart();
    router.push("/market");
  }

  return (
    <div className="p-6 text-white">
      <a href="/market" className="text-green-400">← Back to Market</a>
      <h1 className="text-3xl font-bold mt-4">Checkout</h1>

      {items.length === 0 ? (
        <p className="mt-2">Your cart is empty.</p>
      ) : (
        <>
          <ul className="mt-4">
            {items.map((i, idx) => (
              <li key={idx}>
                {i.name} — {i.qty} × ${(i.price_cents / 100).toFixed(2)}
              </li>
            ))}
          </ul>

          <p className="mt-4 font-semibold">Total: ${(total / 100).toFixed(2)}</p>

          <div className="flex flex-col gap-2 mt-4">
            <input className="p-2 rounded bg-neutral-800" placeholder="Name"   value={form.name}   onChange={(e)=>setForm({...form,name:e.target.value})}/>
            <input className="p-2 rounded bg-neutral-800" placeholder="Email"  value={form.email}  onChange={(e)=>setForm({...form,email:e.target.value})}/>
            <input className="p-2 rounded bg-neutral-800" placeholder="Phone"  value={form.phone}  onChange={(e)=>setForm({...form,phone:e.target.value})}/>
            <input className="p-2 rounded bg-neutral-800" placeholder="Address"value={form.address}onChange={(e)=>setForm({...form,address:e.target.value})}/>
            <textarea className="p-2 rounded bg-neutral-800" placeholder="Notes (optional)" value={form.notes} onChange={(e)=>setForm({...form,notes:e.target.value})}/>
            <button onClick={placeOrder} className="bg-green-600 hover:bg-green-700 p-2 rounded mt-3">Place order</button>
          </div>
        </>
      )}
    </div>
  );
}
