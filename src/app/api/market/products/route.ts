// src/app/api/market/products/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
type Row = Partial<{
  id: string | number;
  name: string;
  slug: string | null;
  image_url: string | null;
  image: string | null;
  price: number | string | null;
  price_cents: number | null;
  currency: string | null;
  is_active: boolean | null;
  status: string | null;
}>;
export async function GET() {
  try {
    const supabase = await createClient();
const { data, error } = await supabase
      .from('products')
      .select('id,name,slug,image_url,image,price,price_cents,currency,is_active,status');

    if (error) throw error;

    const products = (data as Row[]).map((p) => {
      // normalize price: prefer decimal "price", else cents/100
      let priceNum: number | null = null;
      if (p.price != null) {
        const n = Number(p.price);
        priceNum = Number.isFinite(n) ? n : null;
      } else if (p.price_cents != null) {
        priceNum = Math.round(p.price_cents) / 100;
      }
    const img = p.image_url ?? p.image ?? null;
      const active =
        p.is_active ?? (p.status ? p.status.toLowerCase() === 'active' : true);

      return {
        id: p.id,
        name: p.name ?? 'Unnamed Product',
        slug: p.slug ?? null,
        image_url: img,
        price: priceNum,
        currency: p.currency ?? 'USD',
        status: active ? 'active' : 'inactive',
      };
    }).filter(Boolean);

    return NextResponse.json({ ok: true, products }, { status: 200 });
  } catch (err: any) {
    console.error('API /api/market/products error:', err);
    return NextResponse.json(
      { ok: false, error: 'Internal error', detail: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}