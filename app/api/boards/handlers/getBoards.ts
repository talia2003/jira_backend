import { getSupabase } from '@/lib/supabaseAdmin'
import { getOrigin, jsonResponse } from '@/lib/cors'

export async function handleGetBoards(request: Request) {
  try {
    const supabase = getSupabase()
    const origin = getOrigin(request)

    const { data, error } = await supabase
      .from('boards')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return jsonResponse({ error: error.message }, 500, origin)
    }

    return jsonResponse({ boards: data ?? [] }, 200, origin)
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return jsonResponse({ error: message }, 500, getOrigin(request))
  }
}
