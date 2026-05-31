import { createClient, SupabaseClient } from '@supabase/supabase-js'

let instance: SupabaseClient | null = null

/**
 * Returns a shared Supabase admin client (singleton).
 * Uses the service role key so server-side routes can read/write all tables.
 * Creates the client on first call and reuses it for subsequent requests.
 */
export function getSupabase(): SupabaseClient {
  if (instance) {
    return instance
  }

  const url = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    throw new Error(
      'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables',
    )
  }

  instance = createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  return instance
}

