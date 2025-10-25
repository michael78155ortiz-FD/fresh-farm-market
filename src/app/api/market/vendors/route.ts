import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // TODO: adjust table/columns to your schema if needed
    const { data, error } = await supabase
      .from('vendors')
      .select('id,name,slug,hero_image_url,status')
      .eq('status', 'active');

    if (error) throw error;
    return NextResponse.json({ vendors: data ?? [] }, { status: 200 });
  } catch (err: any) {
    console.error('API /api/market/vendors error:', err);
    return NextResponse.json(
      { error: 'Internal error', detail: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
