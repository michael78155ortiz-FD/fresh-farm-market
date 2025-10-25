Here's the corrected version of the code:
typescript// src/app/api/market/vendors/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
type VendorRow = Partial<{
  id: string | number;
  name: string;
  slug: string | null;
  token: string | null;
  hero_image_url: string | null;
  image_url: string | null;
  status: string | null;     // e.g. 'active' | 'inactive'
  is_active: boolean | null; // alternative boolean flag
}>;
function toSlug(v?: string | null) {
  return (v ?? '')
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
export async function GET() {
  try {
    const supabase = createClient();
    // Ask for a superset of columns that commonly exist across schemas.
    // (No server-side filter on status to avoid "column does not exist" errors.)
    const { data, error } = await supabase
      .from('vendors')
      .select('id,name,slug,token,hero_image_url,image_url,status,is_active');
    if (error) throw error;
    const all = (data as VendorRow[] | null) ?? [];
    const vendors = all
      .map((v) => {
        // Normalize ACTIVE flag: prefer is_active, else status === 'active', else default true
        const isActive =
          v.is_active ?? (v.status ? v.status.toLowerCase() === 'active' : true);
        if (!isActive) return null;
        // Normalize slug: slug -> token -> slugify(name) -> null
        const slug =
          v.slug ??
          v.token ??
          (v.name ? toSlug(v.name) : null);
        // Normalize hero image
        const hero = v.hero_image_url ?? v.image_url ?? null;
        return {
          id: v.id,
          name: v.name ?? 'Unnamed Vendor',
          slug,
          hero_image_url: hero,
          status: 'active' as const,
        };
      })
      .filter((v): v is NonNullable<typeof v> => Boolean(v));
    return NextResponse.json({ vendors }, { status: 200 });
  } catch (err: any) {
    console.error('API /api/market/vendors error:', err);
    return NextResponse.json(
      { error: 'Internal error', detail: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}