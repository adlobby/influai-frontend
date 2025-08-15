// src/lib/supabase-browser.ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let _client: SupabaseClient | null = null;

export function createSupabaseBrowserClient() {
  if (_client) return _client;
  const url = import.meta.env.VITE_SUPABASE_URL!;
  const anon = import.meta.env.VITE_SUPABASE_ANON_KEY!;
  _client = createClient(url, anon, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true, // important for PKCE
    },
  });
  return _client;
}

// Back-compat alias used elsewhere in your code
export const getSupabase = createSupabaseBrowserClient;
