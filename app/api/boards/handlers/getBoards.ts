import { getAuthUser } from '@/lib/getAuthUser'
import { getSupabase } from '@/lib/supabaseAdmin'

export async function handleGetBoards(request: Request) {
  try {
    const { user, error: authError } = await getAuthUser(request)
    if (!user){
      return Response.json({ error: authError ?? 'Unauthorized' }, { status: 401 })
    }
    const supabase = getSupabase()

    const { data, error } = await supabase
      .from('boards')
      .select('*')
      .eq('owner_id', user.id)
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
