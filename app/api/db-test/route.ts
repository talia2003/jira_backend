import { getSupabase } from '@/lib/supabaseAdmin'
import { corsPreflight, withCors } from '@/lib/cors'

/**
 * Verifies Supabase connectivity by reading from the smoke_test table.
 * Returns up to 20 rows ordered by newest first, or an error if the DB is unreachable.
 */
export async function GET(request: Request) {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('smoke_test')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) {
      return withCors(
        request,
        Response.json({ error: error.message }, { status: 500 }),
        { allowVercelPreview: true },
      )
    }
    return withCors(request, Response.json({ rows: data ?? [] }), { allowVercelPreview: true })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return withCors(request, Response.json({ error: message }, { status: 500 }), {
      allowVercelPreview: true,
    })
  }
}

export function OPTIONS(request: Request) {
  return corsPreflight(request, { allowVercelPreview: true })
}