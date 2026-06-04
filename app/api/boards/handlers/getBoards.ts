import { getSupabase } from '@/lib/supabaseAdmin'

export async function handleGetBoards() {
  try {
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('boards')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ boards: data ?? [] })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return Response.json({ error: message }, { status: 500 })
  }
}
