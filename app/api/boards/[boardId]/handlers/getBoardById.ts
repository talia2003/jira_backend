import { getAuthUser } from '@/lib/getAuthUser'
import { getSupabase } from '@/lib/supabaseAdmin'

export async function handleGetBoardById(request: Request, params: Promise<{ boardId: string }>) {
  try {
    const { user, error: authError } = await getAuthUser(request)
    if (!user){
      return Response.json({ error: authError ?? 'Unauthorized' }, { status: 401 })
    }
    const supabase = getSupabase()
    const { boardId } = await params

    const [boardResult, columnsResult, ticketsResult] = await Promise.all([
      supabase.from('boards').select('*').eq('id', boardId).single(),
      supabase.from('columns').select('*').eq('board_id', boardId).order('position'),
      supabase.from('tickets').select('*').eq('board_id', boardId).order('position'),
    ])

    if (boardResult.data?.owner_id !== user.id) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { data: board, error: boardError } = boardResult
    if (boardError) {
      return Response.json({ error: boardError.message }, { status: 404 })
    }

    const { data: columns, error: colError } = columnsResult
    if (colError) {
      return Response.json({ error: colError.message }, { status: 500 })
    }

    const { data: tickets, error: tickError } = ticketsResult
    if (tickError) {
      return Response.json({ error: tickError.message }, { status: 500 })
    }

    return Response.json({ board, columns, tickets })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return Response.json({ error: message }, { status: 500 })
  }
}
