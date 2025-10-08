import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs'; // be explicit

export async function GET(req: Request) {
  try {
    const url =
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.SUPABASE_URL || '';
    const anon =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.SUPABASE_ANON_KEY || '';

    if (!url || !anon) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Supabase env missing: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY' }),
        { status: 500, headers: { 'content-type': 'application/json' } }
      );
    }

    const supabase = createClient(url, anon, { auth: { persistSession: false } });

    const { data, error } = await supabase
      .from('vendors')            // <-- ensure this table exists
      .select('*')
      .limit(100);

    if (error) {
      console.error('vendors route query error:', error);
      return new Response(
        JSON.stringify({ ok: false, error: error.message }),
        { status: 500, headers: { 'content-type': 'application/json' } }
      );
    }

    return new Response(JSON.stringify({ ok: true, data }), {
      status: 200,
      headers: { 'content-type': 'application/json' }
    });
  } catch (err: any) {
    console.error('vendors route fatal error:', err);
    return new Response(
      JSON.stringify({ ok: false, error: err?.message || 'Internal Server Error' }),
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }
}
