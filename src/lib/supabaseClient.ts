// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

// These values come from your .env.local file
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// This is the "phone" that your app uses to talk to Supabase
export const supabase = createClient(url, anon)
