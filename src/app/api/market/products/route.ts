import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // TODO: adjust table/columns to your schema if needed
    const { data, error } = await supabase
      .from('products')
      .select('id,name,price,slug,image_url,is_active')
      .eq('is_active', true);

    if (error) throw error;
    return NextResponse.json({ products: data ?? [] }, { status: 200 });
  } catch (err: any) {
    console.error('API /api/market/products error:', err);
    return NextResponse.json(
      { error: 'Internal error', detail: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
